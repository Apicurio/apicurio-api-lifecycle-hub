import { FunctionComponent, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexItem,
    Gallery,
    GalleryItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
    TextList,
    TextListItem,
    TextListItemVariants,
    TextListVariants,
    TextVariants
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { Api, VersionSearchResults } from "@client/models";
import { Services } from "@services/services.ts";
import { NavPage, VersionList } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { FromNow } from "@app/components/common/FromNow.tsx";
import { VersionsSort } from "@models/VersionsSort.model.ts";
import { Paging } from "@models/Paging.model.ts";
import { IfNotLoading } from "@apicurio/common-ui-components";

const splitGalleryWidths = {
    sm: "100%",
    md: "100%",
    lg: "50%",
    xl: "50%"
};

export type ApiDetailsPageProps = {
    // No properties.
}

export const ApiDetailsPage: FunctionComponent<ApiDetailsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
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
            console.error(`[ApiDetailsPage] Failed to get API with id ${apiId}: `, error);
        });
    }, [params]);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{apiId}</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">API Details</Text>
                </TextContent>
            </PageSection>
            <IfNotLoading isLoading={isLoading}>
                <PageSection isFilled={true} style={{ padding: 0 }}>
                    <Gallery hasGutter={false} minWidths={splitGalleryWidths} maxWidths={splitGalleryWidths}>
                        <GalleryItem className="left-panel" style={{ padding: "20px" }}>
                            <Flex direction={{ default: "column" }}>
                                <FlexItem>
                                    <Card>
                                        <CardHeader>
                                            <TextContent>
                                                <Text component={TextVariants.h3}>Metadata</Text>
                                            </TextContent>
                                        </CardHeader>
                                        <CardBody>
                                            <TextContent>
                                                <TextList component={TextListVariants.dl}>
                                                    <TextListItem component={TextListItemVariants.dt}>API Id:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.apiId}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Name:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.name}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Description:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.description}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Type:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.type}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Encoding:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.encoding}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Owner:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.owner}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Created:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>
                                                        <FromNow date={api?.createdOn} />
                                                    </TextListItem>
                                                </TextList>
                                            </TextContent>
                                        </CardBody>
                                    </Card>
                                </FlexItem>
                                <FlexItem>
                                    <Card>
                                        <CardHeader actions={{ actions: <Button variant="secondary">Edit</Button> }}>
                                            <TextContent>
                                                <Text component={TextVariants.h3}>Labels</Text>
                                            </TextContent>
                                        </CardHeader>
                                        <CardBody>Body</CardBody>
                                    </Card>
                                </FlexItem>
                            </Flex>
                        </GalleryItem>
                        <GalleryItem className="right-panel" style={{ padding: "20px" }}>
                            <Card>
                                <CardHeader>
                                    <TextContent>
                                        <Text component={TextVariants.h3}>Versions</Text>
                                    </TextContent>
                                </CardHeader>
                                <CardBody>
                                    <VersionList
                                        apiId={apiId}
                                        versions={versionSearchResults}
                                        onSelect={() => {}}
                                        onDelete={() => {}}
                                        onSort={() => {}}
                                        sort={versionsSort}
                                    />
                                </CardBody>
                            </Card>
                        </GalleryItem>
                    </Gallery>
                </PageSection>
            </IfNotLoading>
        </AppPage>
    );
};
