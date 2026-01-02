# Label Printer Utility (Web Version)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

**English** | [简体中文](./README.zh-CN.md)

A modern, offline-capable web application for batch generating label PDF documents from images. Rebuilt from the ground up using React 19 to replace the legacy PyQt6 desktop application.

## ✨ Key Features

- **🚀 Pure Client-Side**: Generates print-ready A4 PDFs directly in your browser using `jspdf`. No data is uploaded to any server.
- **🎨 Modern UX**: Glassmorphism design system powered by Tailwind CSS v4 and Framer Motion animations.
- **🌍 Internationalization**: Built-in support for **Chinese (Simplified)** and **Thai**, with instant language switching.
- **👁️ Real-time Preview**: What you see is what you get. Vizualize your layout on a virtual A4 canvas before generating.
- **📐 Flexible Layout**:
  - Customizable Rows & Columns (Default 3x3)
  - Adjustable Margins & Spacing (mm precision)
  - Portrait & Landscape orientation support
- **🖼️ Smart Image Scaling**: Automatically scales and centers images to fit label slots without distortion (Aspect Ratio Preserved).

## 🛠️ Tech Stack

- **Framework**: React 19.2.3 (Latest Stable)
- **Build Tool**: Vite 7.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1, Lucide React (Icons)
- **PDF Engine**: jsPDF
- **Animation**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/label-react.git
   cd label-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 📦 Building for Production

To create a production-ready build (static files):

```bash
npm run build
```

The output will be in the `dist/` directory. You can drop these files into any static hosting service (Vercel, Netlify, GitHub Pages, or Nginx).

## 💡 Usage Guide

1. **Upload Source**: Click the upload area to select your label image (JPG/PNG).
2. **Configure Layout**: Use the left sidebar to adjust rows, columns, and spacing.
3. **Check Preview**: Verify the layout on the right preview panel.
4. **Generate**: Click "Generate PDF" to download the final file.

## 📄 License

MIT License.
