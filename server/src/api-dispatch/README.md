# API Dispatch Module

The API Dispatch module is a comprehensive HTTP client abstraction layer that handles API requests to various third-party services with support for authentication, request preparation, error handling, and token refresh mechanisms.

## Overview

This module provides a unified interface for making authenticated API calls to different providers while handling the complexities of various authentication methods, request signing, and error management. It's designed to be extensible and supports multiple authentication patterns including OAuth2, API keys, basic auth, and custom signing mechanisms.

## Architecture

The module consists of four main components:

1. **Main Dispatcher** (`index.ts`) - Core request handling logic
2. **Authentication Preparation** (`prepare/`) - Provider-specific request signing
3. **Error Handling** (`error-handler/`) - Provider-specific error processing
4. **Token Refresh** (`refresh-token.ts`) - OAuth token refresh mechanism

## Core Features

### 🔐 Multi-Authentication Support
- **Header Authentication**: Custom headers with token injection
- **Basic Authentication**: Username/password combinations
- **Query Parameter Authentication**: API keys in URL parameters
- **Path Parameter Authentication**: Dynamic URL path replacement
- **Body Authentication**: Token injection in request body
- **OAuth2**: Full OAuth2 flow with automatic token refresh

### 📝 Request Processing
- **Dynamic URL Construction**: Path parameter replacement with multiple patterns
- **Subdomain Handling**: Dynamic subdomain replacement for multi-tenant APIs
- **Content Type Management**: Automatic content-type detection and setting
- **File Upload Support**: Multipart form data for file uploads
- **Query Parameter Management**: Automatic query string construction

### 🛡️ Error Handling
- **Provider-Specific Error Processing**: Custom error handling for different APIs
- **Automatic Token Refresh**: 401 error handling with token refresh retry
- **Structured Error Responses**: Consistent error format across providers
- **XML Response Parsing**: Automatic XML to JSON conversion

### 🔄 Request Preparation
- **AWS Signature V4**: For AWS services (S3, SES)
- **JWT Signing**: For Apple Developer APIs
- **Cloudinary Signatures**: For Cloudinary uploads
- **Basic Auth**: For various API providers
- **Custom Signing**: Extensible signing mechanism
- **Conditional Application**: Only applies if provider has a preparation function

## API Reference

### Main Function: `access()`

```typescript
async function access({
  provider,
  target,
  payload,
  credsObj,
}: {
  provider: string;
  target: Target;
  payload: any;
  credsObj: CredsObj;
}): Promise<AccessReturn>
```

#### Parameters

- **provider**: Provider name (string) used to identify the service for request preparation, error handling, and token refresh
- **target**: Request target configuration including method, endpoint, and parameters
- **payload**: Request payload including body, params, and file data
- **credsObj**: Credentials object containing OAuth data and auth tokens

#### Returns

```typescript
{
  data: any;      // Response data (JSON or XML)
  headers: any;   // Response headers
}
```

### Complete Interface Definitions

```typescript
interface AccessReturn {
  [key: string]: any; // Response data and headers
}

interface PathParam {
  replace_key?: string;
  replace?: string; // legacy
  key_alias?: string;
}

interface SubdomainParam {
  replace?: string;
}

interface AuthHeader {
  headerName: string;
  headerValue?: string;
  authKey: string;
}

interface BasicAuth {
  username: string;
  password: string;
}

interface AuthConfig {
  header?: AuthHeader | AuthHeader[];
  basicauth?: BasicAuth;
  query?: string[];
  queryMap?: { [key: string]: string };
  path?: { [key: string]: string };
  body?: { [key: string]: string };
}

interface AuthToken {
  [key: string]: any; // Flexible structure for different auth token properties
  accessToken?: string;
  refreshToken?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
}

interface CredsObj {
  oauth_data?: { [key: string]: any } | null;
  authToken: AuthToken;
}
```

### Target Configuration

```typescript
interface Target {
  method: string;                    // HTTP method (GET, POST, PUT, etc.)
  meta: TargetMeta;                  // Endpoint metadata
  path?: { [key: string]: PathParam }; // Path parameters
  subdomain?: { [key: string]: SubdomainParam }; // Subdomain parameters
  domain_params?: { [key: string]: SubdomainParam }; // Domain parameters
  auth?: AuthConfig;                 // Authentication configuration
  headers?: { [key: string]: string }; // Default headers
  custom_headers?: { [key: string]: string }; // Custom headers
  payload_type?: 'formdata' | 'urlencoded' | 'json'; // Payload format
  type?: string;                     // Request type (file, upload, etc.)
}
```

### Authentication Configuration

```typescript
interface AuthConfig {
  header?: AuthHeader | AuthHeader[];  // Header-based auth
  basicauth?: BasicAuth;               // Basic authentication
  query?: string[];                    // Query parameter auth
  queryMap?: { [key: string]: string }; // Query parameter mapping
  path?: { [key: string]: string };    // Path parameter auth
  body?: { [key: string]: string };    // Body parameter auth
}
```

## Usage Examples

### Basic API Call

```typescript
import access from './api-dispatch';

const result = await access({
  provider: 'example',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/users'
    },
    auth: {
      header: {
        headerName: 'Authorization',
        headerValue: 'Bearer',
        authKey: 'accessToken'
      }
    }
  },
  payload: {
    params: { limit: 10 }
  },
  credsObj: {
    authToken: {
      accessToken: 'your-access-token'
    }
  }
});
```

### OAuth2 with Automatic Refresh

```typescript
const result = await access({
  provider: 'example',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/data',
      contentType: 'application/json'
    },
    auth: {
      header: {
        headerName: 'Authorization',
        headerValue: 'Bearer',
        authKey: 'accessToken'
      }
    }
  },
  payload: {
    body: { name: 'John Doe' }
  },
  credsObj: {
    authToken: {
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      CLIENT_ID: 'client-id',
      CLIENT_SECRET: 'client-secret'
    }
  }
});
// Automatically refreshes token on 401 and retries
```

### File Upload

```typescript
const result = await access({
  provider: 'example',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/upload'
    },
    type: 'file',
    auth: { /* auth config */ }
  },
  payload: {
    body: { description: 'My file' },
    file: {
      originalname: 'document.pdf',
      fieldname: 'file'
    }
  },
  credsObj: { /* credentials */ }
});
```

## Supported Providers

### Authentication Preparation
- **AWS S3**: Signature V4 authentication
- **AWS SES**: Signature V4 authentication
- **Cloudinary**: SHA signature generation
- **Apple Developer**: JWT token generation
- **Scenario**: Basic authentication

### Error Handling
- **Google Sheets**: Structured error responses
- **Gmail**: Detailed error information
- **Mailgun**: Custom error formatting
- **Postmark**: Message-based errors
- **Anthropic**: AI service error handling

### Token Refresh
Supports OAuth2 token refresh for 40+ providers including:
- Google services (Sheets, Docs, Gmail, Drive, Calendar, Forms)
- Social platforms (Facebook, Instagram, Discord, Reddit)
- Development tools (GitHub, GitLab, Slack)
- E-commerce (Shopify, Gumroad)
- And many more...

## Path Parameter Patterns

The module supports multiple path parameter replacement patterns:

- `{key}` - Standard curly braces
- `:key` - Colon prefix
- `<key>` - Angle brackets

Example:
```typescript
// URL: https://api.example.com/users/{userId}/posts
// Parameter: { userId: "123" }
// Result: https://api.example.com/users/123/posts
```

## Error Handling

### Automatic Token Refresh
When a 401 Unauthorized response is received:
1. The module attempts to refresh the access token using the refresh token
2. If successful, the original request is retried with the new token
3. If refresh fails, the original error is returned

### Provider-Specific Error Processing
Each provider can have custom error handling logic that:
- Extracts relevant error information from the response
- Formats errors in a consistent structure
- Preserves error codes and additional metadata

## Development

### Adding New Providers

1. **Authentication Preparation**: Add signing logic in `prepare/index.ts` (optional)
2. **Error Handling**: Add error processing in `error-handler/index.ts` (optional)
3. **Token Refresh**: Add refresh URL in `refresh-token.ts` (for OAuth providers)

**Note**: All three components are optional. The module will work with basic authentication even if no provider-specific handlers are defined.

### Testing

The module includes comprehensive error handling and logging for debugging:
- Request/response logging
- Error tracking
- Token refresh monitoring

## Dependencies

- `form-data`: File upload handling
- `qs`: Query string parsing
- `xml2js`: XML response parsing
- `@aws-sdk/signature-v4`: AWS request signing
- `@aws-crypto/sha256-js`: AWS cryptographic functions
- `jsonwebtoken`: JWT token generation
- `moment`: Date/time handling
- `cloudinary`: Cloudinary signature generation

## Security Considerations

- Credentials are handled securely with proper token management
- Automatic token refresh prevents credential exposure
- Request signing ensures API integrity
- Error handling prevents sensitive information leakage

## Performance

- Efficient request batching and parallel processing
- Automatic retry mechanisms for transient failures
- Optimized payload handling for different content types
- Minimal overhead for simple requests

---

For more information about specific providers or advanced usage patterns, refer to the individual component documentation or the main project README.
