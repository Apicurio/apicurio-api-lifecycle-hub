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
import { Api, Version } from "@client/models";
import { Services } from "@services/services.ts";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { FromNow } from "@app/components/common/FromNow.tsx";
import { IfNotLoading, PleaseWaitModal } from "@apicurio/common-ui-components";

const splitGalleryWidths = {
    sm: "100%",
    md: "100%",
    lg: "50%",
    xl: "50%"
};

export type VersionDetailsPageProps = {
    // No properties.
}

export const VersionDetailsPage: FunctionComponent<VersionDetailsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [api, setApi] = useState<Api>();
    const [version, setVersion] = useState<Version>();

    const params = useParams();
    const appNav = useAppNavigation();

    const apiIdParam: string = params["apiId"] as string;
    const versionParam: string = params["version"] as string;

    // Load the api based on the api ID (from the path param).
    useEffect(() => {
        setLoading(true);

        Promise.all([
            Services.getApisService().getApi(apiIdParam).then(setApi),
            Services.getApisService().getVersion(apiIdParam, versionParam).then(setVersion),
        ]).then(() => {
            setLoading(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[VersionDetailsPage] Failed to get API with id ${apiIdParam}: `, error);
        });
    }, [params]);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}`)}>{apiIdParam}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}/versions`)}>Versions</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{versionParam}</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">Version Details</Text>
                    <Text component="p" className="description">
                        Manage the details of this API Version by updating its metadata and content.
                    </Text>
                </TextContent>
            </PageSection>
            <IfNotLoading isLoading={isLoading}>
                <PageSection isFilled={true} style={{ padding: 0 }}>
                    <Gallery hasGutter={false} minWidths={splitGalleryWidths} maxWidths={splitGalleryWidths}>
                        <GalleryItem className="left-panel" style={{ padding: "20px" }}>
                            <Flex direction={{ default: "column" }}>
                                <FlexItem>
                                    <Card>
                                        <CardHeader actions={{ actions: <Button variant="secondary">Edit</Button> }}>
                                            <TextContent>
                                                <Text component={TextVariants.h3}>Metadata</Text>
                                            </TextContent>
                                        </CardHeader>
                                        <CardBody>
                                            <TextContent>
                                                <TextList component={TextListVariants.dl}>
                                                    <TextListItem component={TextListItemVariants.dt}>API Id:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{apiIdParam}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>API Name:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.name}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Version:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{version?.version}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Description:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{version?.description || "No description."}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Created:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>
                                                        <FromNow date={version?.createdOn} />
                                                    </TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Modified:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>
                                                        <FromNow date={version?.modifiedOn} />
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
                            Something else here?
                        </GalleryItem>
                    </Gallery>
                </PageSection>
            </IfNotLoading>
        </AppPage>
    );
};
