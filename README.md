# LowCodeAPI

A unified API connector that abstracts third-party service integrations through a single, standardized interface. Build, deploy, and manage your integrations with ease.

## 🏗️ Project Overview

LowCodeAPI is a comprehensive platform consisting of two main components:

- **[🚀 Server](./server/README.md)** - Backend with unified API gateway
- **[🎨 UI](./ui/README.md)** - Frontend

## 📚 Documentation

- **[Server Documentation](./server/README.md)** - Backend setup, API endpoints, and development
- **[UI Documentation](./ui/README.md)** - Frontend development, components, and deployment
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## 🏛️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Backend API    │    │ Third-party     │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Services      │
│   Port: 3000    │    │   Port: 3001    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow


## 📄 License

See the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/lowcodeapi/issues)
- **Documentation**: [Server](./server/README.md) | [UI](./ui/README.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
