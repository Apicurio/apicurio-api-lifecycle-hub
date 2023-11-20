import { BaseService } from "../baseService";
import { Api, ApiSearchResults, NewApi } from "@client/models";
import { PagingModel } from "@models/Paging.model.ts";
import { ApisRequestBuilderGetRequestConfiguration } from "@client/apis";

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

    public searchApis(criteria: string | undefined, paging: PagingModel): Promise<ApiSearchResults | undefined> {
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
}
