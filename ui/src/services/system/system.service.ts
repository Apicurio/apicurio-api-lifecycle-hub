import { BaseService } from "../baseService";
import { SystemInfo } from "@client/hub/models";

/**
 * The System service.
 */
export class SystemService extends BaseService {

    public getInfo(): Promise<SystemInfo | undefined> {
        this.logger?.info("[SystemService] Getting the global list of artifactTypes.");

        return this.client().system.info.get();
    }

}
