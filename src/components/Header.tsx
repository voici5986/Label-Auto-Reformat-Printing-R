import { Printer, Globe, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "../utils/i18n";

export function Header() {
    const { t, language, setLanguage } = useI18n();

    const toggleLanguage = () => {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-10 glass-panel border-x-0 border-t-0 rounded-none z-20 px-6 flex items-center justify-between shrink-0 shadow-sm"
        >
            <div className="flex items-center gap-3">
                <div className="bg-brand-primary text-white p-1 rounded-lg shadow-lg shadow-brand-primary/30">
                    <Printer className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                        {t('main_title')}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleLanguage}
                    className="text-slate-500 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-slate-100/50 flex items-center gap-1"
                    title="Switch Language"
                >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase">{language}</span>
                </button>
                <button className="text-slate-500 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-slate-100/50">
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>
        </motion.header>
    );
}
