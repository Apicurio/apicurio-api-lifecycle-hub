import { ConfigType, OidcAuthConfig, OidcAuthOptions } from "./config.type";
import { Service } from "../baseService";

const DEFAULT_CONFIG: ConfigType = {
    apis: {
        lifecycleHub: "http://localhost:8080/apis/lifecycle/v0"
    },
    auth: {
        type: "none"
    },
    ui: {
        contextPath: "/",
        navPrefixPath: "/"
    }
};


export function getConfig(): ConfigType {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ApiLifecycleConfig) { return ApiLifecycleConfig as ConfigType; }

    const gw: any = window as any;
    if (gw["ApiLifecycleConfig"]) {
        return gw["ApiLifecycleConfig"] as ConfigType;
    }

    return DEFAULT_CONFIG;
}


/**
 * A simple configuration service.  Reads information from a global "ApiLifecycleConfig" variable
 * that is typically included via JSONP.
 */
export class ConfigService implements Service {
    private config: ConfigType;

    constructor() {
        this.config = getConfig();
    }

    public init(): void {
        // Nothing to init (done in c'tor)
    }

    public lifecycleHubUrl(): string {
        return this.config.apis.lifecycleHub || "";
    }

    public uiContextPath(): string {
        return this.config.ui.contextPath || "/";
    }

    public uiNavPrefixPath(): string|undefined {
        if (!this.config.ui || !this.config.ui.navPrefixPath) {
            return "";
        }
        if (this.config.ui.navPrefixPath.endsWith("/")) {
            this.config.ui.navPrefixPath = this.config.ui.navPrefixPath.substr(0, this.config.ui.navPrefixPath.length - 1);
        }
        return this.config.ui.navPrefixPath;
    }

    public authType(): string {
        return this.config.auth.type || "none";
    }

    public authOptions(): OidcAuthOptions {
        if (this.config.auth) {
            const auth: OidcAuthConfig = this.config.auth as OidcAuthConfig;
            return auth.options;
        }
        return {} as any;
    }

}
