# API Dispatch Module - Usage Examples

This document provides comprehensive examples of how to use the API Dispatch module for various scenarios and providers.

## Table of Contents

1. [Basic API Calls](#basic-api-calls)
2. [Authentication Methods](#authentication-methods)
3. [OAuth2 with Token Refresh](#oauth2-with-token-refresh)
4. [File Uploads](#file-uploads)
5. [Provider-Specific Examples](#provider-specific-examples)
6. [Error Handling](#error-handling)
7. [Advanced Usage](#advanced-usage)

## Basic API Calls

### Simple GET Request with Header Authentication

```typescript
import dispatchRequest from './api-dispatch';

// Example: Fetching user data from a REST API
const result = await dispatchRequest{
  provider: 'example-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/users/123',
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
    params: { include: 'profile' }
  },
  credsObj: {
    authToken: {
      accessToken: 'your-access-token-here'
    }
  }
});

console.log('User data:', result.data);
console.log('Response headers:', result.headers);
```

### POST Request with JSON Body

```typescript
// Example: Creating a new user
const result = await dispatchRequest{
  provider: 'user-service',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/users',
      contentType: 'application/json'
    },
    auth: {
      header: {
        headerName: 'X-API-Key',
        authKey: 'apiKey'
      }
    }
  },
  payload: {
    body: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
  },
  credsObj: {
    authToken: {
      apiKey: 'your-api-key-here'
    }
  }
});

console.log('Created user:', result.data);
```

## Authentication Methods

### 1. Header Authentication (Multiple Headers)

```typescript
// Example: API requiring multiple headers
const result = await dispatchRequest{
  provider: 'multi-header-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/data'
    },
    auth: {
      header: [
        {
          headerName: 'Authorization',
          headerValue: 'Bearer',
          authKey: 'accessToken'
        },
        {
          headerName: 'X-Client-ID',
          authKey: 'clientId'
        },
        {
          headerName: 'X-API-Version',
          headerValue: 'v2',
          authKey: 'version'
        }
      ]
    }
  },
  payload: {},
  credsObj: {
    authToken: {
      accessToken: 'your-token',
      clientId: 'client-123',
      version: '2.0'
    }
  }
});
```

### 2. Basic Authentication

```typescript
// Example: API using username/password authentication
const result = await dispatchRequest{
  provider: 'basic-auth-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/protected'
    },
    auth: {
      basicauth: {
        username: 'usernameKey',
        password: 'passwordKey'
      }
    }
  },
  payload: {},
  credsObj: {
    authToken: {
      usernameKey: 'your-username',
      passwordKey: 'your-password'
    }
  }
});
```

### 3. Query Parameter Authentication

```typescript
// Example: API key in query parameters
const result = await dispatchRequest{
  provider: 'query-auth-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/data'
    },
    auth: {
      query: ['api_key', 'user_id']
    }
  },
  payload: {
    params: { limit: 10 }
  },
  credsObj: {
    authToken: {
      api_key: 'your-api-key',
      user_id: 'user-123'
    }
  }
});
// Resulting URL: https://api.example.com/data?api_key=your-api-key&user_id=user-123&limit=10
```

### 4. Query Map Authentication

```typescript
// Example: Facebook Graph API style authentication
const result = await dispatchRequest{
  provider: 'facebook',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://graph.facebook.com/v18.0/me'
    },
    auth: {
      queryMap: {
        access_token: 'accessToken'
      }
    }
  },
  payload: {
    params: { fields: 'id,name,email' }
  },
  credsObj: {
    authToken: {
      accessToken: 'your-facebook-token'
    }
  }
});
// Resulting URL: https://graph.facebook.com/v18.0/me?access_token=your-facebook-token&fields=id,name,email
```

### 5. Path Parameter Authentication

```typescript
// Example: API with authentication in URL path
const result = await dispatchRequest{
  provider: 'path-auth-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/{tenant_id}/users'
    },
    auth: {
      path: {
        tenant_id: 'tenantId'
      }
    }
  },
  payload: {},
  credsObj: {
    authToken: {
      tenantId: 'tenant-123'
    }
  }
});
// Resulting URL: https://api.example.com/tenant-123/users
```

### 6. Body Parameter Authentication

```typescript
// Example: API requiring auth token in request body
const result = await dispatchRequest{
  provider: 'body-auth-api',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/authenticate'
    },
    auth: {
      body: {
        token: 'authToken'
      }
    }
  },
  payload: {
    body: {
      action: 'get_data',
      filters: { status: 'active' }
    }
  },
  credsObj: {
    authToken: {
      authToken: 'your-auth-token'
    }
  }
});
// The token will be automatically added to the request body
```

## OAuth2 with Token Refresh

### Google Sheets API with Automatic Token Refresh

```typescript
// Example: Reading from Google Sheets with automatic token refresh
const result = await dispatchRequest{
  provider: 'googlesheets',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}'
    },
    path: {
      spreadsheetId: {
        key_alias: 'spreadsheetId'
      },
      range: {
        key_alias: 'range'
      }
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
    params: { valueRenderOption: 'FORMATTED_VALUE' }
  },
  credsObj: {
    oauth_data: {
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E'
    },
    authToken: {
      accessToken: 'expired-or-valid-token',
      refreshToken: 'your-refresh-token',
      CLIENT_ID: 'your-client-id',
      CLIENT_SECRET: 'your-client-secret'
    }
  }
});

// If the access token is expired, the module will automatically:
// 1. Detect the 401 error
// 2. Refresh the token using the refresh token
// 3. Retry the original request with the new token
// 4. Return the successful response

console.log('Sheet data:', result.data);
```

### GitHub API with OAuth2

```typescript
// Example: Fetching user repositories from GitHub
const result = await dispatchRequest{
  provider: 'github',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.github.com/user/repos'
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
    params: {
      type: 'owner',
      sort: 'updated',
      per_page: 10
    }
  },
  credsObj: {
    authToken: {
      accessToken: 'your-github-token',
      refreshToken: 'your-refresh-token',
      CLIENT_ID: 'your-client-id',
      CLIENT_SECRET: 'your-client-secret'
    }
  }
});

console.log('Repositories:', result.data);
```

## File Uploads

### Single File Upload

```typescript
// Example: Uploading a file to a service
const result = await dispatchRequest{
  provider: 'file-service',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/upload'
    },
    type: 'file',
    auth: {
      header: {
        headerName: 'Authorization',
        headerValue: 'Bearer',
        authKey: 'accessToken'
      }
    }
  },
  payload: {
    body: {
      description: 'My uploaded file',
      category: 'documents'
    },
    file: {
      originalname: 'document.pdf',
      fieldname: 'file'
    }
  },
  credsObj: {
    authToken: {
      accessToken: 'your-access-token'
    }
  }
});

console.log('Upload result:', result.data);
```

### Form Data Upload

```typescript
// Example: Uploading with form data
const result = await dispatchRequest{
  provider: 'form-upload-service',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/submit'
    },
    payload_type: 'formdata',
    auth: {
      header: {
        headerName: 'X-API-Key',
        authKey: 'apiKey'
      }
    }
  },
  payload: {
    body: {
      title: 'My Form Submission',
      content: 'This is the form content',
      tags: 'important,urgent'
    }
  },
  credsObj: {
    authToken: {
      apiKey: 'your-api-key'
    }
  }
});
```

## Provider-Specific Examples

### AWS S3 with Signature V4

```typescript
// Example: Uploading to AWS S3 with automatic signature generation
const result = await dispatchRequest{
  provider: 'awss3',
  target: {
    method: 'PUT',
    meta: {
      api_endpoint: 'https://my-bucket.s3.amazonaws.com/{key}'
    },
    path: {
      key: {
        key_alias: 'objectKey'
      }
    },
    auth: {
      header: {
        headerName: 'Authorization',
        authKey: 'accessKeyId'
      }
    }
  },
  payload: {
    body: {
      content: 'Hello, S3!',
      metadata: { type: 'text/plain' }
    }
  },
  credsObj: {
    oauth_data: {
      objectKey: 'my-folder/my-file.txt'
    },
    authToken: {
      accessKeyId: 'your-access-key',
      secretAccessKey: 'your-secret-key',
      region: 'us-east-1'
    }
  }
});

// The module automatically:
// 1. Generates AWS Signature V4
// 2. Adds required headers
// 3. Signs the request
// 4. Makes the authenticated request
```

### Cloudinary Image Upload

```typescript
// Example: Uploading image to Cloudinary with signature
const result = await dispatchRequest{
  provider: 'cloudinary',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.cloudinary.com/v1_1/{cloud_name}/image/upload'
    },
    path: {
      cloud_name: {
        key_alias: 'cloudName'
      }
    },
    payload_type: 'formdata'
  },
  payload: {
    body: {
      file: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      public_id: 'my-image',
      folder: 'uploads'
    }
  },
  credsObj: {
    oauth_data: {
      cloudName: 'your-cloud-name'
    },
    authToken: {
      apiSecret: 'your-api-secret'
    }
  }
});

// The module automatically:
// 1. Generates Cloudinary signature
// 2. Adds timestamp and signature to request
// 3. Makes the authenticated upload request
```

### Apple Developer API with JWT

```typescript
// Example: Using Apple Developer API with JWT authentication
const result = await dispatchRequest{
  provider: 'appledeveloper',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.appstoreconnect.apple.com/v1/apps'
    },
    auth: {
      header: {
        headerName: 'Authorization',
        authKey: 'key_id'
      }
    }
  },
  payload: {
    params: { 'filter[platform]': 'IOS' }
  },
  credsObj: {
    authToken: {
      key_id: 'your-key-id',
      private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'
    }
  }
});

// The module automatically:
// 1. Generates JWT token with proper claims
// 2. Signs with your private key
// 3. Adds Bearer token to Authorization header
```

## Error Handling

### Basic Error Handling

```typescript
try {
  const result = await dispatchRequest{
    provider: 'example-api',
    target: {
      method: 'GET',
      meta: {
        api_endpoint: 'https://api.example.com/data'
      },
      auth: {
        header: {
          headerName: 'Authorization',
          headerValue: 'Bearer',
          authKey: 'accessToken'
        }
      }
    },
    payload: {},
    credsObj: {
      authToken: {
        accessToken: 'invalid-token'
      }
    }
  });
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Error Code:', error.code);
  console.error('Error Data:', error.data);
  console.error('Response Headers:', error.headers);
}
```

### Provider-Specific Error Handling

```typescript
// Example: Google Sheets with custom error handling
try {
  const result = await dispatchRequest{
    provider: 'googlesheets',
    target: {
      method: 'GET',
      meta: {
        api_endpoint: 'https://sheets.googleapis.com/v4/spreadsheets/invalid-id/values/A1'
      },
      auth: {
        header: {
          headerName: 'Authorization',
          headerValue: 'Bearer',
          authKey: 'accessToken'
        }
      }
    },
    payload: {},
    credsObj: {
      authToken: {
        accessToken: 'valid-token'
      }
    }
  });
} catch (error) {
  // The googlesheets error handler will extract the specific error message
  console.error('Google Sheets Error:', error.message);
  console.error('Error Details:', error.error);
}
```

## Advanced Usage

### Dynamic URL Construction with Multiple Parameters

```typescript
// Example: Complex URL with multiple path parameters
const result = await dispatchRequest{
  provider: 'complex-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/{version}/users/{userId}/posts/{postId}/comments'
    },
    path: {
      version: { key_alias: 'apiVersion' },
      userId: { key_alias: 'userId' },
      postId: { key_alias: 'postId' }
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
    params: { limit: 20, offset: 0 }
  },
  credsObj: {
    oauth_data: {
      apiVersion: 'v2',
      userId: 'user-123',
      postId: 'post-456'
    },
    authToken: {
      accessToken: 'your-token'
    }
  }
});
// Resulting URL: https://api.example.com/v2/users/user-123/posts/post-456/comments?limit=20&offset=0
```

### Subdomain Parameter Processing

```typescript
// Example: Multi-tenant API with subdomain parameters
const result = await dispatchRequest{
  provider: 'multi-tenant-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://{tenant}.api.example.com/data'
    },
    subdomain: {
      tenant: { key_alias: 'tenantId' }
    },
    auth: {
      header: {
        headerName: 'X-Tenant-Token',
        authKey: 'tenantToken'
      }
    }
  },
  payload: {},
  credsObj: {
    oauth_data: {
      tenantId: 'acme-corp'
    },
    authToken: {
      tenantToken: 'tenant-specific-token'
    }
  }
});
// Resulting URL: https://acme-corp.api.example.com/data
```

### XML Response Processing

```typescript
// Example: API returning XML that gets automatically converted to JSON
const result = await dispatchRequest{
  provider: 'xml-api',
  target: {
    method: 'GET',
    meta: {
      api_endpoint: 'https://api.example.com/xml-data'
    },
    auth: {
      header: {
        headerName: 'Authorization',
        headerValue: 'Bearer',
        authKey: 'accessToken'
      }
    }
  },
  payload: {},
  credsObj: {
    authToken: {
      accessToken: 'your-token'
    }
  }
});

// The response will contain both original XML and parsed JSON
console.log('Original XML:', result.data.xml);
console.log('Parsed JSON:', result.data.json);
```

### Custom Headers and Content Types

```typescript
// Example: API requiring custom headers and specific content type
const result = await dispatchRequest{
  provider: 'custom-api',
  target: {
    method: 'POST',
    meta: {
      api_endpoint: 'https://api.example.com/submit',
      contentType: 'application/xml'
    },
    headers: {
      'X-Custom-Header': 'custom-value',
      'Accept': 'application/xml'
    },
    custom_headers: {
      'X-Request-ID': 'req-123',
      'X-Client-Version': '1.0.0'
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
    body: '<data><item>value</item></data>'
  },
  credsObj: {
    authToken: {
      accessToken: 'your-token'
    }
  }
});
```

## Best Practices

### 1. Error Handling
Always wrap API calls in try-catch blocks to handle errors gracefully:

```typescript
try {
  const result = await dispatchRequest{...});
  // Process successful response
} catch (error) {
  // Handle different error types
  if (error.code === 401) {
    // Handle authentication errors
  } else if (error.code === 429) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

### 2. Token Management
Store tokens securely and let the module handle refresh automatically:

```typescript
// Store tokens in secure storage
const credsObj = {
  authToken: {
    accessToken: await secureStorage.get('accessToken'),
    refreshToken: await secureStorage.get('refreshToken'),
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET
  }
};
```

### 3. Parameter Organization
Use `oauth_data` for dynamic parameters and `authToken` for credentials:

```typescript
const credsObj = {
  oauth_data: {
    // Dynamic parameters that change per request
    userId: 'user-123',
    projectId: 'project-456'
  },
  authToken: {
    // Static credentials
    accessToken: 'token',
    apiKey: 'key'
  }
};
```

### 4. Provider-Specific Configuration
Leverage provider-specific handlers for better error handling and request preparation:

```typescript
// Use provider names that match the handlers
const providers = [
  'googlesheets',  // Has custom error handler
  'awss3',         // Has signature preparation
  'cloudinary',    // Has signature preparation
  'github',        // Has OAuth refresh support
  'facebook'       // Has OAuth refresh support
];
```

This comprehensive set of examples should help you understand and implement the API Dispatch module in various scenarios. Each example demonstrates different features and capabilities of the module.
