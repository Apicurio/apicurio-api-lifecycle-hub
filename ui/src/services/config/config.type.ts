
export interface ApisConfig {
    hub: string;
}

export interface UiConfig {
    contextPath?: string;
    navPrefixPath?: string;
}

export interface AuthConfig {
    type: string;
}

export interface OidcAuthOptions extends AuthConfig {
    url: string;
    redirectUri: string;
    clientId: string;
    scopes: string;
}

// Used when `type=oidc`
export interface OidcAuthConfig extends AuthConfig {
    type: "oidc";
    options: OidcAuthOptions;
}

// Used when `type=none`
export interface NoneAuthConfig extends AuthConfig {
    type: "none";
}

export interface ConfigType {
    apis: ApisConfig;
    auth: OidcAuthConfig | NoneAuthConfig;
    ui: UiConfig;
    integrations?: any;
}
