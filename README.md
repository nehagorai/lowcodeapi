# LowCodeAPI

A unified API connector for third-party service integrations.

## Overview

LowCodeAPI has two main components:

- **[🚀 Server](./server/README.md)** - Backend with unified API gateway
- **[🎨 UI](./ui/README.md)** - Frontend

## Documentation

- **[Server](./server/README.md)** - Backend setup, API endpoints, and development
- **[UI](./ui/README.md)** - Frontend development, components, and deployment
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Backend API    │    │ Third-party     │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Services      │
│   Port: 3000    │    │   Port: 3456    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Getting started

Local instance runs Frontend and Backend seperately. Both requires seperate `.env` to run at moment.

You can generate `.env` using `npm run env`, this will create `.env` file inside `server` as well as `ui` directory.

If you want to manually create `.env`, copy `.env.example` to `.env` in thier respective directory and fill the desired value.

You can follow [How to start](./guide/how-to-start.md) here.

### Contributors

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <a href="https://github.com/Samal" title="Samal">
    <img src="https://avatars.githubusercontent.com/samal" 
         width="50" 
         style="clip-path: circle(50% at center);"
         alt="Samal" />
  </a>
  <a href="https://github.com/NehaGorai" title="Neha Gorai">
    <img src="https://avatars.githubusercontent.com/nehagorai" 
         width="50" 
         style="clip-path: circle(50% at center);"
         alt="Neha Gorai" />
  </a>
</div>

Please see our [Contributing Guide](./CONTRIBUTING.md).

## License

See [LICENSE](./LICENSE) for more information.

## Support

- **Issues**: [GitHub Issues](https://github.com/samal/lowcodeapi/issues)
