import { ConfigService } from "./config";
import { LoggerService } from "./logger";
import { Service } from "./baseService";
import { DownloaderService } from "./downloader";
import { AuthService } from "./auth";
import { VersionService } from "@services/version";
import { SystemService } from "@services/system";
import { ApisService } from "@services/apis";
import { TasksService } from "@services/tasks";

/**
 * Class that provides access to all the services in the application.
 */
export class Services {

    static _isInit: boolean = false;

    public static getConfigService(): ConfigService {
        return Services.all.config;
    }

    public static getVersionService(): VersionService {
        return Services.all.version;
    }

    public static getDownloaderService(): DownloaderService {
        return Services.all.downloader;
    }

    public static getLoggerService(): LoggerService {
        return Services.all.logger;
    }

    public static getSystemService(): SystemService {
        return Services.all.system;
    }

    public static getApisService(): ApisService {
        return Services.all.apis;
    }

    public static getTasksService(): TasksService {
        return Services.all.tasks;
    }

    public static getAuthService(): AuthService {
        return Services.all.auth;
    }

    private static all: any = {
        config: new ConfigService(),
        version: new VersionService(),
        downloader: new DownloaderService(),
        system: new SystemService(),
        logger: new LoggerService(),
        auth: new AuthService(),
        apis: new ApisService(),
        tasks: new TasksService(),
    };

    // tslint:disable-next-line:member-ordering member-access
    static _initialize(): void {
        console.info("[Services] _initialize() in Services");
        if (Services._isInit) {
            console.info("[Services] Services already initialized...skipping.");
            return;
        }
        console.info("[Services] Actually initializing Services!!!");
        // First perform simple service-service injection.
        Object.keys(Services.all).forEach( svcToInjectIntoName => {
            const svcToInjectInto: any = Services.all[svcToInjectIntoName];
            Object.keys(Services.all).filter(key => key !== svcToInjectIntoName).forEach(injectableSvcKey => {
                if (svcToInjectInto[injectableSvcKey] === undefined) {
                    svcToInjectInto[injectableSvcKey] = Services.all[injectableSvcKey];
                }
            });
        });
        // Once that's done, init() all the services
        Object.keys(Services.all).forEach( svcToInjectIntoName => {
            const svcToInit: Service = Services.all[svcToInjectIntoName];
            svcToInit.init();
        });
        Services._isInit = true;
        Services.getLoggerService().info("[Services] Services successfully initialized.");
    }

}
Services._initialize();
