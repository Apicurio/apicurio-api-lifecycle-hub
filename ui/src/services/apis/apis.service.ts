import { BaseService } from "../baseService";
import {
    Api,
    ApiSearchResults,
    NewApi,
    NewVersion,
    UpdateApi, UpdateVersion,
    Version,
    VersionSearchResults
} from "@client/hub/models";
import { Paging } from "@models/Paging.model.ts";
import { ApisRequestBuilderGetRequestConfiguration } from "@client/hub/apis";
import { VersionsRequestBuilderGetRequestConfiguration } from "@client/hub/apis/item/versions";

/**
 * The System service.
 */
export class ApisService extends BaseService {

    public getApi(apiId: string): Promise<Api | undefined> {
        this.logger?.debug("[ApisService] Getting API with id=", apiId);
        return this.hubClient().apis.byApiId(apiId).get();
    }

    public deleteApi(apiId: string): Promise<void> {
        this.logger?.debug("[ApisService] Deleting API with id=", apiId);
        return this.hubClient().apis.byApiId(apiId).delete();
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
        return this.hubClient().apis.get(params);
    }

    public createApi(data: NewApi): Promise<void> {
        this.logger?.debug("[ApisService] Creating a new API with id=", data.apiId);
        return this.hubClient().apis.post(data);
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
        return this.hubClient().apis.byApiId(apiId).versions.get(params);
    }

    public createVersion(apiId: string, data: NewVersion): Promise<void> {
        this.logger?.debug("[ApisService] Creating a new Version: ", apiId, data.version);
        return this.hubClient().apis.byApiId(apiId).versions.post(data);
    }

    public getVersion(apiId: string, version: string): Promise<Version | undefined> {
        this.logger?.debug("[ApisService] Getting Version with: ", apiId, version);
        return this.hubClient().apis.byApiId(apiId).versions.byVersion(version).get();
    }

    public updateApiMetaData(apiId: string, data: UpdateApi): Promise<void> {
        this.logger?.debug("[ApisService] Updating API labels for: ", apiId);
        if (data.labels) {
            data.labels = {
                additionalData: data.labels as any
            };
        }
        return this.hubClient().apis.byApiId(apiId).put(data);
    }

    public updateVersionMetaData(apiId: string, version: string, data: UpdateVersion): Promise<void> {
        this.logger?.debug("[ApisService] Updating version: ", apiId, version);
        if (data.labels) {
            data.labels = {
                additionalData: data.labels as any
            };
        }
        return this.hubClient().apis.byApiId(apiId).versions.byVersion(version).put(data);
    }

    public getVersionContent(apiId: string, version: string): Promise<string> {
        return this.hubClient().apis.byApiId(apiId).versions.byVersion(version).content.get().then(ab => {
            const decoder: TextDecoder = new TextDecoder("utf-8");
            return decoder.decode(ab);
        });
    }

    public updateVersionContent(apiId: string, version: string, newContent: string, newContentType: string): Promise<void> {
        const encoder: TextEncoder = new TextEncoder();
        const buffer = encoder.encode(newContent);
        return this.hubClient().apis.byApiId(apiId).versions.byVersion(version).content.put(buffer, newContentType);
    }
}
