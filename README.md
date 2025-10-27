# LowCodeAPI

A unified API connector that abstracts third-party service integrations through a single, standardized interface. Build, deploy, and manage your integrations with ease.

## 🏗️ Project Overview

LowCodeAPI consisting of two main components:

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

### Contributors

<a href="https://github.com/samal/lowcodeapi/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=samal/lowcodeapi" />
</a>

## 🤝 Contributing

Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Workflow

## 📄 License

See [LICENSE](./LICENSE) for more information.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/samal/lowcodeapi/issues)
- **Documentation**: [Server](./server/README.md) | [UI](./ui/README.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
