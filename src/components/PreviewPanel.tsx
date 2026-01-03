import { useEffect, useMemo, useState, useRef } from "react";
import { calculateLabelLayout, A4_WIDTH_MM, A4_HEIGHT_MM } from "../utils/layoutMath";
import type { HelperLayoutConfig } from "../utils/layoutMath";
import { Maximize } from "lucide-react";
import { useI18n } from "../utils/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { mapPctToScale, getThumbBottomPct } from "../utils/zoomMath";

interface PreviewPanelProps {
    config: HelperLayoutConfig;
    imageFile: File | null;
}

export function PreviewPanel({ config, imageFile }: PreviewPanelProps) {
    const { t } = useI18n();
    const [scale, setScale] = useState(1);
    const [baseFitScale, setBaseFitScale] = useState(0.8);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Zoom control states
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const sliderTrackRef = useRef<HTMLDivElement>(null);

    // 计算自动缩放比例 (保持在本地，因为依赖 DOM ref)
    useEffect(() => {
        const updateFitScale = () => {
            if (!containerRef.current) return;
            const TOP_GAP = 10;
            const BOTTOM_GAP = 10;
            const HORIZONTAL_GAP = 20;

            const containerW = containerRef.current.clientWidth - HORIZONTAL_GAP;
            const containerH = containerRef.current.clientHeight - (TOP_GAP + BOTTOM_GAP);

            const isPortrait = config.orientation === 'portrait';
            const paperWidthMm = isPortrait ? A4_WIDTH_MM : A4_HEIGHT_MM;
            const paperHeightMm = isPortrait ? A4_HEIGHT_MM : A4_WIDTH_MM;

            const mmToPx = 3.78;
            const paperW = paperWidthMm * mmToPx;
            const paperH = paperHeightMm * mmToPx;

            setBaseFitScale(Math.min(containerW / paperW, containerH / paperH));
        };

        updateFitScale();
        window.addEventListener('resize', updateFitScale);
        return () => window.removeEventListener('resize', updateFitScale);
    }, [config.orientation]);

    // 处理图片 URL 生命周期
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setImageUrl(null);
    }, [imageFile]);

    const layout = useMemo(() => calculateLabelLayout(config), [config]);

    const isPortrait = config.orientation === 'portrait';
    const paperWidthMm = isPortrait ? A4_WIDTH_MM : A4_HEIGHT_MM;
    const paperHeightMm = isPortrait ? A4_HEIGHT_MM : A4_WIDTH_MM;

    const handleSliderChange = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!sliderTrackRef.current) return;
        const rect = sliderTrackRef.current.getBoundingClientRect();
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        const pct = 1 - (clientY - rect.top) / rect.height;
        setScale(mapPctToScale(pct));
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent | TouchEvent) => handleSliderChange(e);
        const onUp = () => setIsDragging(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, [isDragging]);

    return (
        <section className="flex-1 flex flex-col p-2 pl-0 h-full overflow-hidden">
            <div className="flex-1 bg-glass-surface/40 backdrop-blur-glass rounded-lg border border-glass-border/60 flex flex-col relative overflow-hidden shadow-inner font-sans">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Scrollable Area */}
                <div ref={containerRef} className="flex-1 overflow-auto text-center p-2 scrollbar-thin scrollbar-thumb-slate-300">
                    <div className="inline-block text-left align-top" style={{
                        width: `${paperWidthMm * scale * baseFitScale}mm`,
                        height: `${paperHeightMm * scale * baseFitScale}mm`,
                        marginTop: '0px',
                        position: 'relative'
                    }}>
                        <motion.div
                            initial={false}
                            animate={{
                                width: `${paperWidthMm}mm`,
                                height: `${paperHeightMm}mm`,
                                scale: scale * baseFitScale,
                                boxShadow: isDragging
                                    ? `0 ${20 / scale}px ${50 / scale}px -12px rgba(0,0,0,${0.1 + (1 - scale / 3) * 0.1})`
                                    : "0 20px 50px -12px rgba(0,0,0,0.15)"
                            }}
                            transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white absolute top-0 left-0"
                            style={{ transformOrigin: 'top left' }}
                        >
                            {layout.positions.map((pos, idx) => (
                                <div
                                    key={idx}
                                    className="absolute overflow-hidden flex items-center justify-center bg-white border border-slate-200 border-dashed"
                                    style={{
                                        left: `${pos.x}mm`,
                                        top: `${pos.y}mm`,
                                        width: `${pos.width}mm`,
                                        height: `${pos.height}mm`,
                                    }}
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} className="w-full h-full object-contain" alt="" />
                                    ) : (
                                        <span className="text-[12px] text-slate-400 font-medium select-none">Label {idx + 1}</span>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Vertical Zoom Controls */}
                <div
                    className="absolute bottom-2 left-2 flex flex-col items-center gap-1 z-20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Reset Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setScale(1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 hover:text-brand-primary transition-all shadow-sm border border-transparent hover:border-slate-200 bg-white/50"
                        title={t('zoom_reset')}
                    >
                        <Maximize className="w-4 h-4" />
                    </motion.button>

                    <motion.div
                        animate={{
                            backgroundColor: isDragging ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)",
                            boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 6px rgba(0,0,0,0.05)"
                        }}
                        className="backdrop-blur-glass rounded-lg p-1.5 border border-glass-border flex flex-col items-center h-40 w-8 relative"
                    >
                        {/* Tooltip (Enhanced popup animation) */}
                        <AnimatePresence>
                            {(isHovered || isDragging) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -5, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -5, scale: 0.8 }}
                                    className="absolute left-12 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[14px] px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none font-bold z-30"
                                >
                                    {Math.round(scale * 100)}%
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            ref={sliderTrackRef}
                            className="w-1.5 h-full bg-slate-200/50 rounded-lg relative cursor-ns-resize"
                            onMouseDown={(e) => { setIsDragging(true); handleSliderChange(e); }}
                            onTouchStart={(e) => { setIsDragging(true); handleSliderChange(e); }}
                        >
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-brand-primary rounded-lg shadow-md pointer-events-none"
                                animate={{
                                    bottom: `${getThumbBottomPct(scale)}%`
                                }}
                                transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                                style={{ marginBottom: '-8px' }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
