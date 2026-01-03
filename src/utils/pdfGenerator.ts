import jsPDF from "jspdf";
import { calculateLabelLayout } from "./layoutMath";
import type { HelperLayoutConfig } from "./layoutMath";
import type { ImageItem } from "../App";

export async function generatePDF(config: HelperLayoutConfig, imageItems: ImageItem[]): Promise<void> {
    // 1. Calculate Layout
    const layout = calculateLabelLayout(config);
    if (layout.error) {
        throw new Error(layout.error);
    }

    // 2. Load all images with their settings
    const loadedImages = await Promise.all(imageItems.map(async (item) => {
        const data = await fileToDataURL(item.file);
        const props = await getImageProperties(data);
        return { ...item, data, ...props };
    }));

    if (loadedImages.length === 0) {
        throw new Error("No images provided");
    }

    // 3. Create PDF
    const pdf = new jsPDF({
        orientation: config.orientation,
        unit: "mm",
        format: "a4",
    });

    // 4. Draw Images
    layout.positions.forEach((pos, idx) => {
        let img = null;

        // 统一使用“精确分配”逻辑
        let accumulated = 0;
        for (const candidate of loadedImages) {
            const start = accumulated;
            accumulated += candidate.count;
            if (idx >= start && idx < accumulated) {
                img = candidate;
                break;
            }
        }

        if (!img) return;

        // Calculate aspect ratio fit (Contain)
        const scale = Math.min(pos.width / img.width, pos.height / img.height);

        const w = img.width * scale;
        const h = img.height * scale;

        // Center the image in the slot
        const x = pos.x + (pos.width - w) / 2;
        const y = pos.y + (pos.height - h) / 2;

        pdf.addImage(
            img.data,
            img.format,
            x,
            y,
            w,
            h,
            undefined,
            'FAST'
        );
    });

    // 5. Save
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, ""); // YYYYMMDDHHMMSS
    pdf.save(`label_${dateStr}.pdf`);
}

/**
 * Helper to convert File to Base64 DataURL
 */
function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Helper to get image format (JPEG/PNG) and dimensions
 */
function getImageProperties(dataUrl: string): Promise<{ format: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let format = "PNG";
            if (dataUrl.startsWith("data:image/jpeg")) {
                format = "JPEG";
            }
            resolve({
                format,
                width: img.width,
                height: img.height
            });
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}
