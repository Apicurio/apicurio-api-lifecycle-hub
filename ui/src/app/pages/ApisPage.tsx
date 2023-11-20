import { FunctionComponent, useEffect, useState } from "react";
import { PageSection, PageSectionVariants, Text, TextContent } from "@patternfly/react-core";
import {
    ApiList,
    ApisToolbar,
    ApisToolbarData,
    CreateApiModal,
    IfNotEmpty,
    IsLoading,
    NavPage,
    PleaseWaitModal
} from "@app/components";
import { ApiSearchResults, NewApi } from "@client/models";
import { Services } from "@services/services.ts";
import { ApisEmptyState } from "@app/components/apis/ApisEmptyState.tsx";
import { ApisSort } from "@models/ApisSort.model.ts";
import { AppPage } from "@app/components/layout/AppPage.tsx";


export type ApisPageProps = {
    // No properties.
}


export const ApisPage: FunctionComponent<ApisPageProps> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");

    const [apiSearchCriteria, setApiSearchCriteria] = useState<ApisToolbarData>({
        filterValue: "",
        paging: {
            page: 1,
            pageSize: 10
        }
    });
    const [apiSearchResults, setApiSearchResults] = useState<ApiSearchResults>({
        count: 0,
        apis: []
    });
    const [apisSort, setApisSort] = useState<ApisSort>({
        by: "name",
        direction: "asc"
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const onCreateApi = (): void => {
        setIsCreateModalOpen(true);
    };

    const onSearchCriteriaChange = (data: ApisToolbarData): void => {
        Services.getLoggerService().info("[ApisPage] API search criteria changed: ", data);
        setApiSearchCriteria(data);
    };

    const onCreateModalCancel = (): void => {
        setIsCreateModalOpen(false);
    };

    const onCreateModalCreate = (data: NewApi): void => {
        setIsCreateModalOpen(false);
        pleaseWait("Creating API, please wait.");
        Services.getApisService().createApi(data).then(() => {
            closePleaseWaitModal();
            // TODO redirect to API detail page
        }).catch(error => {
            // TODO proper error handling
            Services.getLoggerService().error("[ApisPage] Error creating an API: ", error);
            closePleaseWaitModal();
        });
    };

    useEffect(() => {
        Services.getApisService().searchApis(apiSearchCriteria.filterValue, apiSearchCriteria.paging).then(results => {
            Services.getLoggerService().info("[ApisPage] Search results are in: ", results);
            setApiSearchResults(results as ApiSearchResults);
            setIsLoading(false);
        }).catch(error => {
            // TODO proper error handling
            Services.getLoggerService().error("[ApisPage] Error searching for APIs: ", error);
            setApiSearchResults({
                count: 0,
                apis: []
            });
            setIsLoading(false);
        });
    }, [apiSearchCriteria]);

    return (
        <AppPage page={NavPage.APIS}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1" className="title">APIs</Text>
                    <Text component="p" className="description">
                        Lists all APIs you have access to.  Manage the list of APIs by filtering the list,
                        creating new APIs, and navigating to the details view for an API.
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection variant={PageSectionVariants.default} isFilled={true}>
                <IsLoading condition={isLoading}>
                    <ApisToolbar data={apiSearchCriteria} apis={apiSearchResults} onCreateApi={onCreateApi} onChange={onSearchCriteriaChange} />
                    <div className="api-search-results-wrapper" style={{ backgroundColor: "white" }}>
                        <IfNotEmpty collection={apiSearchResults.apis} emptyState={ <ApisEmptyState /> }>
                            <ApiList apis={apiSearchResults}
                                sort={apisSort}
                                onSort={setApisSort}
                                onSelect={(apiId) => {
                                    Services.getLoggerService().info("=====> onSelect: ", apiId);
                                }}
                                onDelete={(apiId) => {
                                    Services.getLoggerService().info("=====> onDelete: ", apiId);
                                }} />
                        </IfNotEmpty>
                    </div>
                </IsLoading>
            </PageSection>
            <CreateApiModal isOpen={isCreateModalOpen} onCancel={onCreateModalCancel} onCreate={onCreateModalCreate} />
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
        </AppPage>
    );
};
