# API Dispatch Module Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "API Dispatch Module"
        A["access() Function"] --> B[Request Processing]
        B --> C[Path Parameter Processing]
        B --> D[Subdomain Processing]
        B --> E[Authentication Processing]
        B --> F[Request Preparation]
        B --> G[HTTP Request]
        G --> H[Response Processing]
        H --> I[Error Handling]
        I --> J[Token Refresh]
        J --> K[Retry Request]
        H --> L[XML Parsing]
        H --> M[Success Response]
    end

    subgraph "Authentication Preparation"
        F --> N[Provider Signing]
        N --> O[AWS Signature V4]
        N --> P[JWT Signing]
        N --> Q[Cloudinary Signing]
        N --> R[Basic Auth]
        N --> S[Custom Signing]
    end

    subgraph "Error Handling"
        I --> T[Provider Error Handlers]
        T --> U[Google Sheets Handler]
        T --> V[Gmail Handler]
        T --> W[Mailgun Handler]
        T --> X[Postmark Handler]
        T --> Y[Anthropic Handler]
    end

    subgraph "Token Refresh"
        J --> Z[OAuth2 Refresh]
        Z --> AA[40+ Providers]
        AA --> BB[Google Services]
        AA --> CC[Social Platforms]
        AA --> DD[Development Tools]
        AA --> EE[E-commerce Platforms]
    end

    subgraph "External APIs"
        G --> FF[Third-party APIs]
        FF --> GG[Google APIs]
        FF --> HH[AWS Services]
        FF --> II[Social Media APIs]
        FF --> JJ[E-commerce APIs]
        FF --> KK[Development APIs]
    end
```

## Request Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Access
    participant Auth
    participant Prepare
    participant HTTP
    participant ErrorHandler
    participant RefreshToken
    participant ExternalAPI

    Client->>Access: access(provider, target, payload, credsObj)
    
    Note over Access: Request Processing
    Access->>Access: Process path parameters
    Access->>Access: Process subdomain parameters
    Access->>Access: Apply authentication (target.auth)
    
    Note over Access: Authentication Preparation
    Access->>Prepare: Check provider signing
    alt Provider requires signing
        Prepare->>Prepare: Generate signature (AWS/JWT/Cloudinary)
        Prepare-->>Access: Signed request options
    end
    
    Note over Access: HTTP Request
    Access->>HTTP: sendRequest(url, options)
    HTTP->>ExternalAPI: Make API call
    ExternalAPI-->>HTTP: Response
    
    alt Success Response
        HTTP-->>Access: Success data
        Access->>Access: Parse XML if needed
        Access-->>Client: { data, headers }
    else Error Response (401)
        HTTP-->>Access: 401 Unauthorized
        Access->>RefreshToken: refreshToken(provider, authObj, credsObj)
        RefreshToken->>ExternalAPI: Refresh token request
        ExternalAPI-->>RefreshToken: New access token
        RefreshToken-->>Access: Updated credentials
        Access->>Access: Retry original request
        Access->>HTTP: sendRequest(url, options) [retry]
        HTTP->>ExternalAPI: Make API call [retry]
        ExternalAPI-->>HTTP: Response [retry]
        HTTP-->>Access: Success data [retry]
        Access-->>Client: { data, headers }
    else Other Error
        HTTP-->>Access: Error response
        Access->>ErrorHandler: Process provider-specific error
        ErrorHandler-->>Access: Formatted error
        Access-->>Client: Throw formatted error
    end
```

## Component Interaction Diagram

```mermaid
graph LR
    subgraph "Core Components"
        A[index.ts<br/>Main Dispatcher]
        B[prepare/<br/>Authentication]
        C[error-handler/<br/>Error Processing]
        D[refresh-token.ts<br/>Token Refresh]
    end

    subgraph "Authentication Types"
        E[Header Auth]
        F[Basic Auth]
        G[Query Auth]
        H[Path Auth]
        I[Body Auth]
        J[OAuth2]
    end

    subgraph "Request Types"
        K[JSON Request]
        L[Form Data]
        M[URL Encoded]
        N[File Upload]
        O[XML Response]
    end

    subgraph "Provider Categories"
        P[Google Services]
        Q[AWS Services]
        R[Social Media]
        S[E-commerce]
        T[Development Tools]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I
    A --> J
    A --> K
    A --> L
    A --> M
    A --> N
    A --> O
    B --> P
    B --> Q
    C --> R
    C --> S
    D --> T
```

## Data Flow Diagram

```mermaid
flowchart TD
    Start([Client Request]) --> Input{Parse Input}
    Input --> Path[Process Path Parameters]
    Path --> Subdomain[Process Subdomain Parameters]
    Subdomain --> Auth{Apply Authentication}
    
    Auth --> Header[Header Authentication]
    Auth --> Basic[Basic Authentication]
    Auth --> Query[Query Authentication]
    Auth --> PathAuth[Path Authentication]
    Auth --> Body[Body Authentication]
    
    Header --> Prepare{Request Preparation}
    Basic --> Prepare
    Query --> Prepare
    PathAuth --> Prepare
    Body --> Prepare
    
    Prepare --> Sign[Provider Signing]
    Sign --> HTTP[Send HTTP Request]
    
    HTTP --> Response{Response Status}
    Response -->|200-299| Success[Process Success Response]
    Response -->|401| Refresh[Token Refresh]
    Response -->|Other| Error[Error Handling]
    
    Refresh --> NewToken{Token Refresh Success}
    NewToken -->|Yes| Retry[Retry Original Request]
    NewToken -->|No| Error
    Retry --> HTTP
    
    Success --> XML{Is XML Response}
    XML -->|Yes| ParseXML[Parse XML to JSON]
    XML -->|No| Return[Return Response]
    ParseXML --> Return
    
    Error --> ProviderError[Provider-Specific Error]
    ProviderError --> Throw[Throw Formatted Error]
    
    Return --> End([Return to Client])
    Throw --> End
```

## Authentication Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> RequestReceived
    
    RequestReceived --> PathProcessing : Process path parameters
    PathProcessing --> SubdomainProcessing : Process subdomain
    SubdomainProcessing --> AuthCheck : Check authentication type
    
    AuthCheck --> HeaderAuth : header config
    AuthCheck --> BasicAuth : basicauth config
    AuthCheck --> QueryAuth : query config
    AuthCheck --> QueryMapAuth : queryMap config
    AuthCheck --> PathAuth : path config
    AuthCheck --> BodyAuth : body config
    AuthCheck --> NoAuth : no auth config
    
    HeaderAuth --> AuthApplied : Add headers
    BasicAuth --> AuthApplied : Set credentials
    QueryAuth --> AuthApplied : Add query params
    QueryMapAuth --> AuthApplied : Add mapped query params
    PathAuth --> AuthApplied : Replace path params
    BodyAuth --> AuthApplied : Add body params
    NoAuth --> AuthError : Throw error
    
    AuthApplied --> PrepareCheck : Check preparation needed
    PrepareCheck --> Signing : Provider requires signing
    PrepareCheck --> RequestReady : No signing needed
    
    Signing --> RequestReady : Apply signature
    RequestReady --> SendRequest : Make HTTP call
    
    SendRequest --> ResponseReceived : Get response
    ResponseReceived --> SuccessCheck : Check status
    
    SuccessCheck --> Success : 200-299
    SuccessCheck --> Unauthorized : 401
    SuccessCheck --> Error : Other status
    
    Unauthorized --> RefreshToken : Attempt refresh
    RefreshToken --> TokenRefreshed : Success
    RefreshToken --> RefreshFailed : Failed
    
    TokenRefreshed --> SendRequest : Retry with new token
    RefreshFailed --> Error : Use original error
    
    Success --> [*]
    Error --> [*]
    AuthError --> [*]
```

## Error Handling Flow

```mermaid
graph TD
    Error[API Error Received] --> ProviderCheck{Provider-specific handler?}
    
    ProviderCheck -->|Yes| ProviderHandler[Provider Error Handler]
    ProviderCheck -->|No| GenericError[Generic Error Handler]
    
    ProviderHandler --> GoogleSheets[Google Sheets Handler]
    ProviderHandler --> Gmail[Gmail Handler]
    ProviderHandler --> Mailgun[Mailgun Handler]
    ProviderHandler --> Postmark[Postmark Handler]
    ProviderHandler --> Anthropic[Anthropic Handler]
    
    GoogleSheets --> ExtractError[Extract error.message]
    Gmail --> ExtractError
    Mailgun --> ExtractError
    Postmark --> ExtractError
    Anthropic --> ExtractError
    
    GenericError --> ExtractMessage[Extract data.message]
    
    ExtractError --> FormatError[Format Custom Error]
    ExtractMessage --> FormatError
    
    FormatError --> AddMetadata[Add error metadata]
    AddMetadata --> SetCode[Set error code]
    SetCode --> SetHeaders[Set response headers]
    SetHeaders --> ThrowError[Throw formatted error]
    
    ThrowError --> Client[Return to Client]
```

## Implementation Details

### Key Implementation Notes

1. **Provider Parameter**: The `provider` parameter is a string that identifies the service and is used to:
   - Look up provider-specific request preparation functions (`prepare[provider]`)
   - Apply provider-specific error handling (`errorHandler[provider]`)
   - Trigger OAuth token refresh for supported providers

2. **Authentication Priority**: 
   ```typescript
   const authDefault = auth; // Uses target.auth as primary
   ```

3. **Path Parameter Patterns**: Supports multiple replacement patterns:
   - `{key}` - Standard curly braces
   - `:key` - Colon prefix  
   - `<key>` - Angle brackets

4. **Subdomain Processing**: Handles both `subdomain` and `domain_params` configurations

5. **Request Preparation**: Only applies provider-specific signing if the provider has a preparation function:
   ```typescript
   if (prepare[provider] && typeof prepare[provider] === 'function') {
     // Apply provider-specific signing
   }
   ```

6. **Error Handling**: 
   - Automatic token refresh on 401 errors with retry mechanism
   - Provider-specific error processing if available:
   ```typescript
   if (errorHandler[provider]) {
     error = errorHandler[provider](err, provider);
   } else {
     error = new Error(data.message || `Error received from the ${provider} API`);
   }
   ```

7. **XML Response Parsing**: Automatically converts XML responses to JSON format

8. **Provider Usage Patterns**: The provider string is used as a key in three different handler objects:
   - `prepare[provider]` - Request preparation/signing functions
   - `errorHandler[provider]` - Error processing functions  
   - `refreshToken({ provider, ... })` - OAuth token refresh

### File Structure

```
api-dispatch/
├── index.ts              # Main dispatcher with access() function
├── prepare/
│   └── index.ts          # Provider-specific request signing
├── error-handler/
│   └── index.ts          # Provider-specific error processing
├── refresh-token.ts      # OAuth token refresh (re-exports from oauth/)
└── README.md            # Module documentation
```

This architecture documentation provides a comprehensive view of how the API Dispatch module works, including the flow of requests, error handling, authentication, and token refresh mechanisms.
