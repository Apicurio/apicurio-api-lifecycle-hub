import { LoggerService } from "./logger";
import { ConfigService } from "./config";
import { AuthService } from "./auth";
import { LifecycleHubClient } from "@client/lifecycleHubClient.ts";
import { RequestAdapter } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary/dist/cjs/src/fetchRequestAdapter";
import {
    AnonymousAuthenticationProvider
} from "@microsoft/kiota-abstractions/dist/cjs/src/authentication/anonymousAuthenticationProvider";
import {
    AuthenticationProvider
} from "@microsoft/kiota-abstractions/dist/cjs/src/authentication/authenticationProvider";

/**
 * Interface implemented by all services.
 */
export interface Service {
    init(): void;
}

/**
 * Base class for all services.
 */
export abstract class BaseService implements Service {

    protected logger: LoggerService | undefined;
    protected config: ConfigService | undefined;
    protected auth: AuthService | undefined;

    protected _client: LifecycleHubClient | undefined;

    public init(): void {
        this.initClient();
        this.initAuthInterceptor();
    }

    private initClient(): void {
        const authProvider: AuthenticationProvider = new AnonymousAuthenticationProvider();
        const requestAdapter: RequestAdapter = new FetchRequestAdapter(authProvider);
        requestAdapter.baseUrl = this.apiBaseHref();
        this._client = new LifecycleHubClient(requestAdapter);
    }

    public client(): LifecycleHubClient {
        return this._client as LifecycleHubClient;
    }

    public initAuthInterceptor() {
        // AXIOS.interceptors.request.use(this.auth?.getAuthInterceptor());
    }

    protected apiBaseHref(): string {
        let apiUrl: string = this.config?.hubUrl() || "";
        if (apiUrl.endsWith("/")) {
            apiUrl = apiUrl.substring(0, apiUrl.length - 1);
        }
        this.logger?.debug("[BaseService] Base HREF of REST API: ", apiUrl);
        return apiUrl;
    }
    //
    // private unwrapErrorData(error: any): any {
    //     if (error && error.response && error.response.data) {
    //         return {
    //             message: error.message,
    //             ...error.response.data,
    //             status: error.response.status
    //         };
    //     } else if (error && error.response) {
    //         return {
    //             message: error.message,
    //             status: error.response.status
    //         };
    //     } else if (error) {
    //         console.error("Unknown error detected: ", error);
    //         return {
    //             message: error.message,
    //             status: 500
    //         };
    //     } else {
    //         console.error("Unknown error detected: ", error);
    //         return {
    //             message: "Unknown error",
    //             status: 500
    //         };
    //     }
    // }
}
