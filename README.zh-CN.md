# 标签打印排版工具 (Web 版)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

[English](./README.md) | **简体中文**

基于 React 19 重构的现代化 Web 应用，用于将图片批量生成为可打印的标签 PDF 文档。完全替代了旧版的 PyQt6 桌面应用程序。

## ✨ 核心特性

- **🚀 纯客户端运行**: 使用 `jspdf` 直接在浏览器中生成可打印的 A4 PDF。所有数据都在本地处理，不上传到任何服务器。
- **🎨 现代 UX 设计**: 基于 Tailwind CSS v4 和 Framer Motion 动画的玻璃拟态设计风格。
- **🌍 国际化支持**: 内置 **简体中文** 和 **泰语** 支持，可一键实时切换。
- **👁️ 实时预览**: 所见即所得。在生成之前，可以在虚拟 A4 画布上可视化查看排版效果。
- **📐 灵活排版**:
  - 主要参数：自定义行数和列数（默认 3x3）
  - 精确控制：可调整边距和间距（毫米级精度）
  - 纸张支持：支持纵向和横向排版
- **🖼️ 智能缩放**: 自动缩放并居中图片以适应标签插槽，同时保持原始比例（无拉伸变形）。

## 🛠️ 技术栈

- **框架**: React 19.2.3 (最新稳定版)
- **构建工具**: Vite 7.3
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.1, Lucide React (图标库)
- **PDF 引擎**: jsPDF
- **动画**: Framer Motion

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v18 或更高版本)

### 安装步骤

1. 克隆仓库:
   ```bash
   git clone https://github.com/your-username/label-react.git
   cd label-react
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 启动开发服务器:
   ```bash
   npm run dev
   ```
   在浏览器中打开 `http://localhost:5173`。

## 📦 生产环境构建

构建用于生产环境的静态文件:

```bash
npm run build
```

构建产物将位于 `dist/` 目录中。您可以将这些文件部署到任何静态托管服务（如 Vercel, Netlify, GitHub Pages 或 Nginx）。

## 💡 使用指南

1. **上传源文件**: 点击上传区域选择您的标签图片 (JPG/PNG)。
2. **配置排版**: 使用左侧边栏调整行数、列数和间距。
3. **检查预览**: 在右侧预览面板中确认排版效果。
4. **生成文档**: 点击“生成 PDF 文档”按钮下载最终文件。

## 📄 许可证

MIT License.
