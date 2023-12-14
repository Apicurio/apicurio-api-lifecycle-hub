import { FunctionComponent, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { CreateVersionModal, NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { IfNotLoading, ListWithToolbar, PleaseWaitModal } from "@apicurio/common-ui-components";
import { Services } from "@services/services.ts";
import { Api, NewVersion, VersionSearchResults } from "@client/hub/models";
import { Link, useParams } from "react-router-dom";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { VersionsSort } from "@models/VersionsSort.model.ts";
import { Paging } from "@models/Paging.model.ts";
import { VersionList, VersionsToolbar, VersionsToolbarData } from "@app/components/versions";
import { PlusIcon } from "@patternfly/react-icons";


export type VersionsPageProps = {
    // No properties.
}


export const VersionsPage: FunctionComponent<VersionsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");
    const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] = useState(false);
    const [api, setApi] = useState<Api>();

    const [versionSearchCriteria, setVersionSearchCriteria] = useState<VersionsToolbarData>({
        filterValue: "",
        paging: {
            page: 1,
            pageSize: 10
        }
    });

    const [versionSearchResults, setVersionSearchResults] = useState<VersionSearchResults>({
        count: 0,
        versions: []
    });
    const [versionsSort] = useState<VersionsSort>({
        by: "createdOn",
        direction: "asc"
    });
    const [versionPaging] = useState<Paging>({
        page: 1,
        pageSize: 50
    });

    const params = useParams();
    const appNav = useAppNavigation();

    const apiId: string = params["apiId"] as string;

    // Load the api based on the api ID (from the path param).
    useEffect(() => {
        setLoading(true);

        Promise.all([
            Services.getApisService().getApi(apiId).then(setApi),
            Services.getApisService().searchVersions(apiId, undefined, versionPaging).then(results => setVersionSearchResults(results as VersionSearchResults))
        ]).then(() => {
            setLoading(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[VersionDetailsPage] Failed to get API with id ${apiId}: `, error);
        });
    }, [params]);

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const onCreateVersion = (data: NewVersion): void => {
        setIsCreateVersionModalOpen(false);
        pleaseWait("Creating new version, please wait.");
        Services.getApisService().createVersion(apiId, data).then(() => {
            closePleaseWaitModal();
            appNav.navigateTo(`/apis/${apiId}/versions/${data.version}`);
        }).catch(error => {
            // TODO proper error handling
            Services.getLoggerService().error("[VersionsPage] Error creating a version: ", error);
            closePleaseWaitModal();
        });
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiId}`)}>{apiId}</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>Versions</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1" className="title">All Versions of '{api?.name || "Unknown API"}'</Text>
                    <Text component="p" className="description">
                        This page lists all versions of a single API.  Use this page to manage those versions (create,
                        update, delete, compare, etc).
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection variant={PageSectionVariants.default} isFilled={true}>
                <IfNotLoading isLoading={isLoading}>
                    <ListWithToolbar toolbar={
                        <VersionsToolbar
                            data={versionSearchCriteria}
                            versions={versionSearchResults}
                            onCreate={() => setIsCreateVersionModalOpen(true)}
                            onChange={setVersionSearchCriteria} />
                    } emptyState={
                        <EmptyState>
                            <EmptyStateHeader titleText="Empty state" headingLevel="h4" icon={<EmptyStateIcon icon={PlusIcon} />} />
                            <EmptyStateBody>
                                This represents the empty state pattern in PatternFly. Hopefully it's simple enough to use but flexible enough to
                                meet a variety of needs.
                            </EmptyStateBody>
                            <EmptyStateFooter>
                                <EmptyStateActions>
                                    <Button variant="primary" onClick={() => setIsCreateVersionModalOpen(true)}>Create version</Button>
                                </EmptyStateActions>
                            </EmptyStateFooter>
                        </EmptyState>
                    } filteredEmptyState={
                        <h1>TBD</h1>
                    } isLoading={false} isError={false} isFiltered={false} isEmpty={versionSearchResults.count === 0}
                    >
                        <VersionList
                            apiId={apiId}
                            versions={versionSearchResults}
                            sort={versionsSort}
                            onSort={() => {}}
                            onDelete={() => {}}
                            onSelect={(version) => appNav.navigateTo(`/apis/${apiId}/versions/${version.version}`)}
                        />
                    </ListWithToolbar>
                </IfNotLoading>
            </PageSection>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
            <CreateVersionModal
                isOpen={isCreateVersionModalOpen}
                onCreate={data => onCreateVersion(data)}
                onCancel={() => setIsCreateVersionModalOpen(false)} />
        </AppPage>
    );
};
