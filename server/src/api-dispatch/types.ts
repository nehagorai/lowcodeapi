export interface AccessReturn {
  data: unknown; // or specific response types
  headers: Record<string, string>;
}

export interface PathParam {
  replace_key?: string;
  replace?: string; // legacy
  key_alias?: string;
}

export interface SubdomainParam {
  replace?: string;
}

export interface AuthHeader {
  headerName: string;
  headerValue?: string;
  authKey: string;
}

export interface BasicAuth {
  username: string;
  password: string;
}

export interface AuthConfig {
  header?: AuthHeader | AuthHeader[];
  basicauth?: BasicAuth;
  query?: string[];
  queryMap?: { [key: string]: string };
  path?: { [key: string]: string };
  body?: { [key: string]: string };
}

export interface TargetMeta {
  contentType?: string;
  api_endpoint: string;
}

export interface Target {
  method: string;
  meta: TargetMeta;
  path?: { [key: string]: PathParam };
  subdomain?: { [key: string]: SubdomainParam };
  domain_params?: { [key: string]: SubdomainParam };
  auth?: AuthConfig;
  headers?: { [key: string]: string };
  custom_headers?: { [key: string]: string };
  payload_type?: 'formdata' | 'urlencoded' | 'json';
  type?: string;
}

export interface AuthToken {
  [key: string]: any; // Flexible structure for different auth token properties
  accessToken?: string;
  refreshToken?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
}

export interface CredsObj {
  oauth_data?: { [key: string]: any } | null;
  authToken: AuthToken;
}

export interface AuthResult {
  url: string;
  options: { [key: string]: any };
  requestHeaders: { [key: string]: any };
  body: { [key: string]: any };
}

export interface SubdomainResult {
  url: string;
  localParams: { [key: string]: any };
}

export interface ProcessSubdomainParams {
  subdomain?: { [key: string]: SubdomainParam };
  domain_params?: { [key: string]: SubdomainParam };
  url: string;
  localParams: { [key: string]: any };
  oauth_data: { [key: string]: any } | null;
  authObj: AuthToken;
}

export interface ApplyAuthenticationParams {
  authDefault: AuthConfig | undefined;
  authObj: AuthToken;
  url: string;
  requestHeaders: { [key: string]: any };
  body: { [key: string]: any };
}

export interface AccessParams {
  provider: string;
  target: Target;
  payload: any;
  credsObj: CredsObj;
}
