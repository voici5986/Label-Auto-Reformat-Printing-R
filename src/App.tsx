import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import type { HelperLayoutConfig } from "./utils/layoutMath";
import { generatePDF } from "./utils/pdfGenerator";
import { Toast, type ToastType } from "./components/Toast";
import { useI18n } from "./utils/i18n";

// Default Config
const DEFAULT_CONFIG: HelperLayoutConfig = {
  rows: 3,
  cols: 3,
  marginMm: 10,
  spacingMm: 10,
  orientation: 'landscape',
};

function App() {
  const { t } = useI18n(); // Helper to access translations if needed, though most UI in subcomponents

  // State
  const [config, setConfig] = useState<HelperLayoutConfig>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("label_printer_config");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: "",
    type: "success",
    visible: false
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // Persist Config
  useEffect(() => {
    localStorage.setItem("label_printer_config", JSON.stringify(config));
  }, [config]);

  // Handlers
  const handleConfigChange = (updates: Partial<HelperLayoutConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setSelectedFileName(file.name);
  };

  const handleGenerateValues = async () => {
    if (!imageFile) return;
    try {
      await generatePDF(config, imageFile);
      showToast(t('gen_success'), 'success');
    } catch (e) {
      showToast(t('gen_failed') + ": " + (e as Error).message, 'error');
    }
  };

  return (
    <Layout>
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <ControlPanel
          config={config}
          onConfigChange={handleConfigChange}
          onFileSelect={handleFileSelect}
          selectedFileName={selectedFileName}
          onGeneratePdf={handleGenerateValues}
        />
        <PreviewPanel
          config={config}
          imageFile={imageFile}
        />
      </main>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </Layout>
  );
}

export default App;
