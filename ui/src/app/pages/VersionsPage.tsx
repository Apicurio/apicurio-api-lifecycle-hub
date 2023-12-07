import { FunctionComponent, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { IfNotLoading, PleaseWaitModal } from "@apicurio/common-ui-components";
import { Services } from "@services/services.ts";
import { Api, VersionSearchResults } from "@client/models";
import { Link, useParams } from "react-router-dom";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { VersionsSort } from "@models/VersionsSort.model.ts";
import { Paging } from "@models/Paging.model.ts";
import { VersionList } from "@app/components/versions";


export type VersionsPageProps = {
    // No properties.
}


export const VersionsPage: FunctionComponent<VersionsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");
    const [api, setApi] = useState<Api>();

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
                    <VersionList
                        apiId={apiId}
                        versions={versionSearchResults}
                        sort={versionsSort}
                        onSort={() => {}}
                        onDelete={() => {}}
                        onSelect={() => {}}
                    />
                </IfNotLoading>
            </PageSection>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
        </AppPage>
    );
};
