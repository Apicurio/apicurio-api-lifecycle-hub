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
import { Api, Labels, NewVersion, UpdateApi, VersionSearchResults } from "@client/hub/models";
import { Services } from "@services/services.ts";
import { CreateVersionModal, NavPage, LatestVersionsList, ShowLabels, EditLabelsModal } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { Paging } from "@models/Paging.model.ts";
import { FromNow, IfNotLoading, ObjectDropdown, PleaseWaitModal } from "@apicurio/common-ui-components";

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
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");
    const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] = useState(false);
    const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] = useState(false);
    const [api, setApi] = useState<Api>();

    const [versionSearchResults, setVersionSearchResults] = useState<VersionSearchResults>({
        count: 0,
        versions: []
    });
    const [versionPaging] = useState<Paging>({
        page: 1,
        pageSize: 8
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

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const onCreateVersion = (data: NewVersion): void => {
        setIsCreateVersionModalOpen(false);
        pleaseWait("Create version, please wait.");
        Services.getApisService().createVersion(apiId, data).then(() => {
            closePleaseWaitModal();
            appNav.navigateTo(`/apis/${apiId}/versions/${data.version}`);
        }).catch(error => {
            // TODO handle errors better than this
            Services.getLoggerService().error("Error creating version: ", error);
            closePleaseWaitModal();
        });
    };

    const onEditLabels = (newLabels: Labels): void => {
        setIsEditLabelsModalOpen(false);
        pleaseWait("Updating labels...");
        const update: UpdateApi = {
            name: api?.name,
            description: api?.description,
            labels: newLabels
        };
        Services.getApisService().updateApiMetaData(apiId, update).then(() => {
            closePleaseWaitModal();
            setApi({
                ...api,
                labels: newLabels
            });
        }).catch(error => {
            // TODO handle errors better than this
            Services.getLoggerService().error("Error updating labels: ", error);
            closePleaseWaitModal();
        });
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{apiId}</BreadcrumbItem>
        </Breadcrumb>
    );

    const versionActions = (
        <ObjectDropdown
            label="Version actions"
            isKebab={true}
            items={[
                { label: "New version", onClick: () => setIsCreateVersionModalOpen(true) },
                { divider: true },
                { label: "View all versions", onClick: () => appNav.navigateTo(`/apis/${apiId}/versions`) },
            ]}
            onSelect={item => item.onClick()}
            itemToString={item => item.label}
            itemIsDivider={item => item.divider}
            popperProps={{
                position: "right"
            }}
        />
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">API Details</Text>
                    <Text component="p" className="description">
                        Manage the details of this API by updating its metadata and creating or editing versions.
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
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.apiId}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Name:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.name}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Description:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.description || "No description."}</TextListItem>

                                                    <TextListItem component={TextListItemVariants.dt}>Type:</TextListItem>
                                                    <TextListItem component={TextListItemVariants.dd}>{api?.type}</TextListItem>

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
                                        <CardHeader actions={{ actions: <Button variant="secondary" onClick={() => setIsEditLabelsModalOpen(true)}>Edit</Button> }}>
                                            <TextContent>
                                                <Text component={TextVariants.h3}>Labels</Text>
                                            </TextContent>
                                        </CardHeader>
                                        <CardBody>
                                            <ShowLabels labels={api?.labels} />
                                        </CardBody>
                                    </Card>
                                </FlexItem>
                            </Flex>
                        </GalleryItem>
                        <GalleryItem className="right-panel" style={{ padding: "20px" }}>
                            <Card>
                                <CardHeader actions={{ actions: versionActions }}>
                                    <TextContent>
                                        <Text component={TextVariants.h3}>Latest versions</Text>
                                    </TextContent>
                                </CardHeader>
                                <CardBody>
                                    <LatestVersionsList
                                        apiId={apiId}
                                        versions={versionSearchResults}
                                        onSelect={() => {}}
                                        onDelete={() => {}}
                                        onCreate={() => setIsCreateVersionModalOpen(true)}
                                    />
                                </CardBody>
                            </Card>
                        </GalleryItem>
                    </Gallery>
                </PageSection>
            </IfNotLoading>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
            <CreateVersionModal
                isOpen={isCreateVersionModalOpen}
                onCreate={data => onCreateVersion(data)}
                onCancel={() => setIsCreateVersionModalOpen(false)} />
            <EditLabelsModal
                isOpen={isEditLabelsModalOpen}
                labels={api?.labels}
                onEdit={onEditLabels}
                onCancel={() => setIsEditLabelsModalOpen(false)} />
        </AppPage>
    );
};
