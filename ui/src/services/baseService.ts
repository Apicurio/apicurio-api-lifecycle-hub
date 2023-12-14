import { LoggerService } from "./logger";
import { ConfigService } from "./config";
import { AuthService } from "./auth";
import { RequestAdapter } from "@microsoft/kiota-abstractions";
import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary/dist/cjs/src/fetchRequestAdapter";
import {
    AnonymousAuthenticationProvider
} from "@microsoft/kiota-abstractions/dist/cjs/src/authentication/anonymousAuthenticationProvider";
import {
    AuthenticationProvider
} from "@microsoft/kiota-abstractions/dist/cjs/src/authentication/authenticationProvider";
import { LifecycleWorkflowsClient } from "@client/workflows/lifecycleWorkflowsClient.ts";
import { LifecycleHubClient } from "@client/hub/lifecycleHubClient.ts";

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

    protected _hubClient: LifecycleHubClient | undefined;
    protected _workflowsClient: LifecycleWorkflowsClient | undefined;

    public init(): void {
        this.initClients();
        this.initAuthInterceptor();
    }

    private initClients(): void {
        this.initHubClient();
        this.initWorkflowsClient();
    }

    private initHubClient(): void {
        const authProvider: AuthenticationProvider = new AnonymousAuthenticationProvider();
        const requestAdapter: RequestAdapter = new FetchRequestAdapter(authProvider);
        requestAdapter.baseUrl = this.hubBaseHref();
        this._hubClient = new LifecycleHubClient(requestAdapter);
    }

    private initWorkflowsClient(): void {
        const authProvider: AuthenticationProvider = new AnonymousAuthenticationProvider();
        const requestAdapter: RequestAdapter = new FetchRequestAdapter(authProvider);
        requestAdapter.baseUrl = this.workflowsBaseHref();
        this._workflowsClient = new LifecycleWorkflowsClient(requestAdapter);
    }

    public hubClient(): LifecycleHubClient {
        return this._hubClient as LifecycleHubClient;
    }

    public workflowsClient(): LifecycleWorkflowsClient {
        return this._workflowsClient as LifecycleWorkflowsClient;
    }

    public initAuthInterceptor() {
        // AXIOS.interceptors.request.use(this.auth?.getAuthInterceptor());
    }

    protected hubBaseHref(): string {
        let apiUrl: string = this.config?.hubUrl() || "";
        if (apiUrl.endsWith("/")) {
            apiUrl = apiUrl.substring(0, apiUrl.length - 1);
        }
        this.logger?.debug("[BaseService] Base HREF of Hub REST API: ", apiUrl);
        return apiUrl;
    }

    protected workflowsBaseHref(): string {
        let apiUrl: string = this.config?.workflowsUrl() || "";
        if (apiUrl.endsWith("/")) {
            apiUrl = apiUrl.substring(0, apiUrl.length - 1);
        }
        this.logger?.debug("[BaseService] Base HREF of Workflows REST API: ", apiUrl);
        return apiUrl;
    }

}
