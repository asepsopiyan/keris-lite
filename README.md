# 🚀 KERIS Lite - Next.js RAG MVP

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **KERIS** (Knowledge Extraction and Retrieval Information System) - A modern RAG (Retrieval Augmented Generation) application built with Next.js 15, featuring vector search capabilities and a beautiful UI.

## ✨ Features

- 🔍 **RAG Capabilities** - Advanced retrieval augmented generation with vector search
- 💬 **Real-time Chat** - Streaming chat interface with AI responses
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🚀 **Next.js 15** - Latest Next.js with App Router and TypeScript
- 🔐 **Vector Search** - Efficient document search using vector embeddings
- 🐳 **Docker Ready** - Containerized deployment with docker-compose
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Optimized for speed and user experience

## 🏗️ Architecture

```
keris-lite/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API endpoints
│   │   └── page.tsx   # Main application
│   └── lib/           # Core libraries
│       ├── config.ts  # Configuration
│       ├── llm.ts     # LLM integration
│       └── vector.ts  # Vector search
├── data/              # Sample data
├── scripts/           # Utility scripts
└── docker-compose.yml # Docker setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asepsopiyan/keris-lite.git
   cd keris-lite
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Setup environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup

```bash
# Build and run with Docker
docker-compose up --build

# Or run in background
docker-compose up -d
```

## 📚 Documentation

- [**PROJECT_SUMMARY.md**](./PROJECT_SUMMARY.md) - Comprehensive project overview
- [**QUICKSTART.md**](./QUICKSTART.md) - Detailed setup guide
- [**UI_FEATURES.md**](./UI_FEATURES.md) - UI components and features
- [**test-setup.md**](./test-setup.md) - Testing configuration

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript check
```

### Project Structure

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: API routes with streaming responses
- **Vector DB**: Integration ready for various vector databases
- **LLM**: Configurable LLM integration

## 🌟 Key Features

### RAG Implementation
- Document ingestion and processing
- Vector embeddings generation
- Semantic search capabilities
- Context-aware responses

### Modern UI Components
- Responsive chat interface
- Real-time streaming
- Beautiful animations
- Mobile-optimized design

### Performance Optimizations
- Next.js 15 optimizations
- Efficient data loading
- Optimized bundle size
- Fast refresh development

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- OpenAI for LLM capabilities
- Vector database communities

## 📞 Support

If you have any questions or need help:

- 🐛 [Report a Bug](https://github.com/asepsopiyan/keris-lite/issues)
- 💡 [Request a Feature](https://github.com/asepsopiyan/keris-lite/issues)
- 📧 [Contact](mailto:asep.sopiyan1309@gmail.com)

---

**Made with ❤️ by [asepsopiyan](https://github.com/asepsopiyan)**

*Star this repository if you find it helpful! ⭐*
