# LowCodeAPI

A unified API connector for third-party service integrations.

## 🏗️ Overview

LowCodeAPI has two main components:

- **[🚀 Server](./server/README.md)** - Backend with unified API gateway
- **[🎨 UI](./ui/README.md)** - Frontend

## 📚 Documentation

- **[Server](./server/README.md)** - Backend setup, API endpoints, and development
- **[UI](./ui/README.md)** - Frontend development, components, and deployment
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## 🏛️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Backend API    │    │ Third-party     │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Services      │
│   Port: 3000    │    │   Port: 3456    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Getting started

### Server

Copy `.env.example` to `.env` and set the desired value or run `npm run env` to generate the `.env`.

### UI

Create a `.env` inside ui directory and copy the following values

```

DATA_ENDPOINT=http://localhost:3456
APP_URL=http://localhost:3456
API_URL=http://localhost:3456
NAME=LowCodeAPI

```

Run a docker instance for MySQL database and Redis

```bash

docker compose -f docker-compose.dev.yml up

or

docker compose up

```

### Contributors

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <a href="https://github.com/Samal" title="Samal">
    <img src="https://avatars.githubusercontent.com/Samal" 
         width="50" 
         style="clip-path: circle(50% at center);"
         alt="Samal" />
  </a>
  <a href="https://github.com/NehaGorai" title="Neha Gorai">
    <img src="https://avatars.githubusercontent.com/NehaGorai" 
         width="50" 
         style="clip-path: circle(50% at center);"
         alt="Neha Gorai" />
  </a>
</div>

Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Workflow

## 📄 License

See [LICENSE](./LICENSE) for more information.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/samal/lowcodeapi/issues)
