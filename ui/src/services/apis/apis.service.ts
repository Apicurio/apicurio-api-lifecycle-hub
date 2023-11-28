import { BaseService } from "../baseService";
import { Api, ApiSearchResults, NewApi, VersionSearchResults } from "@client/models";
import { Paging } from "@models/Paging.model.ts";
import { ApisRequestBuilderGetRequestConfiguration } from "@client/apis";
import { VersionsRequestBuilderGetRequestConfiguration } from "@client/apis/item/versions";

/**
 * The System service.
 */
export class ApisService extends BaseService {

    public getApi(apiId: string): Promise<Api | undefined> {
        this.logger?.debug("[ApisService] Getting API with id=", apiId);
        return this.client().apis.byApiId(apiId).get();
    }

    public deleteApi(apiId: string): Promise<void> {
        this.logger?.debug("[ApisService] Deleting API with id=", apiId);
        return this.client().apis.byApiId(apiId).delete();
    }

    public searchApis(criteria: string | undefined, paging: Paging): Promise<ApiSearchResults | undefined> {
        this.logger?.debug("[ApisService] Searching for APIs: ", criteria, paging);
        const name: string | undefined = criteria ? criteria : undefined;
        const offset: number = (paging.page - 1) * paging.pageSize;
        const limit: number = paging.pageSize;
        const params: ApisRequestBuilderGetRequestConfiguration = {
            queryParameters: {
                name,
                offset,
                limit
            }
        };
        return this.client().apis.get(params);
    }

    public createApi(data: NewApi): Promise<void> {
        this.logger?.debug("[ApisService] Creating a new API with id=", data.apiId);
        return this.client().apis.post(data);
    }

    public searchVersions(apiId: string, criteria: string | undefined, paging: Paging): Promise<VersionSearchResults | undefined> {
        this.logger?.debug("[ApisService] Searching for API versions: ", apiId, criteria, paging);
        const version: string | undefined = criteria ? criteria : undefined;
        const offset: number = (paging.page - 1) * paging.pageSize;
        const limit: number = paging.pageSize;
        const params: VersionsRequestBuilderGetRequestConfiguration = {
            queryParameters: {
                version,
                offset,
                limit
            }
        };
        return this.client().apis.byApiId(apiId).versions.get(params);
    }

}
