import { ConfigService } from "../config";
import { Service } from "../baseService";
import { User, UserManager, UserManagerSettings } from "oidc-client-ts";

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

export class AuthService implements Service {
    private config: ConfigService | undefined;

    private enabled: boolean = false;
    private userManager: UserManager | undefined;
    private oidcUser: User | undefined;

    public init = () => {
        if (this.config?.authType() === "oidc") {
            this.userManager = new UserManager(this.getClientSettings());
        }
    };

    public authenticateUsingOidc = (): Promise<any> => {
        return this.userManager?.getUser().then((authenticatedUser) => {
            if (authenticatedUser) {
                this.oidcUser = authenticatedUser;
                this.userManager?.startSilentRenew();
                return Promise.resolve(authenticatedUser);
            } else {
                console.warn("Not authenticated, call doLogin!");
                return this.doLogin();
            }
        }) || Promise.reject(new Error("(authenticateUsingOidc) User manager is undefined."));
    };

    public getClientSettings(): UserManagerSettings {
        const configOptions: any = this.config?.authOptions();

        return {
            authority: configOptions.url,
            client_id: configOptions.clientId,
            redirect_uri: configOptions.redirectUri,
            response_type: "code",
            scope: configOptions.scopes,
            filterProtocolClaims: true,
            includeIdTokenInSilentRenew: true,
            includeIdTokenInSilentSignout: true,
            loadUserInfo: true
        };
    }

    public isAuthenticated(): boolean {
        return this.userManager != null && this.oidcUser != null && !this.oidcUser.expired;
    }

    public doLogin = (): Promise<any> => {
        return this.userManager?.signinRedirect().then(() => {
            this.userManager?.startSilentRenew();
            return this.userManager?.signinRedirectCallback();
        }) || Promise.reject("(doLogin) User manager is undefined.");
    };

    public doLogout = () => {
        this.userManager?.signoutRedirect({ post_logout_redirect_uri: window.location.href });
    };

    public getOidcToken = () => {
        return this.oidcUser?.id_token;
    };

    public isAuthenticationEnabled(): boolean {
        return this.enabled;
    }

    public authenticate(): Promise<any> {
        if (this.config?.authType() === "oidc") {
            this.enabled = true;
            const url = new URL(window.location.href);
            if (url.searchParams.get("state") || url.searchParams.get("code")) {
                return this.userManager?.signinRedirectCallback().then(user => {
                    this.oidcUser = user;
                    return Promise.resolve(user);
                }) || Promise.reject(new Error("User manager undefined."));
            } else {
                return this.authenticateUsingOidc();
            }
        } else {
            this.enabled = false;
            return Promise.resolve("Authentication not enabled.");
        }
    }

    // public getAuthInterceptor(): (config: AxiosRequestConfig) => Promise<any> {
    //     /* eslint-disable @typescript-eslint/no-this-alias */
    //     const self: AuthService = this;
    //     return (config: AxiosRequestConfig) => {
    //         if (self.config?.authType() === "oidc") {
    //             if (config.headers) {
    //                 config.headers.Authorization = `Bearer ${this.getOidcToken()}`;
    //             }
    //             return Promise.resolve(config);
    //         } else {
    //             return Promise.resolve(config);
    //         }
    //     };
    // }
}
