import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardHeader, Divider,
    Flex,
    FlexItem,
    Gallery,
    GalleryItem, List, ListItem, ListVariant,
    PageSection,
    PageSectionVariants, Tab, TabContent, Tabs, TabTitleText,
    Text,
    TextContent,
    TextList,
    TextListItem,
    TextListItemVariants,
    TextListVariants,
    TextVariants
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { Api, Labels, UpdateVersion, Version } from "@client/hub/models";
import { Services } from "@services/services.ts";
import { BpmnDiagram, EditLabelsModal, NavPage, RegistryVersionDetails, ShowLabels } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { IfNotLoading, FromNow, PleaseWaitModal, If } from "@apicurio/common-ui-components";
import { CodeEditor, Language } from "@patternfly/react-code-editor";
import { CloseIcon, DownloadIcon, PencilAltIcon, TrashIcon } from "@patternfly/react-icons";

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
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [content, setContent] = useState("");
    const [api, setApi] = useState<Api>();
    const [version, setVersion] = useState<Version>();
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");
    const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] = useState(false);
    const [tabKey, setTabKey] = useState(0);

    const params = useParams();
    const appNav = useAppNavigation();

    const apiIdParam: string = params["apiId"] as string;
    const versionParam: string = params["version"] as string;

    const labels: any = version?.labels || {};
    const isReadOnly: boolean = labels["version:readOnly"] === "true";
    const isRegistered: boolean = labels["registry:artifactId"] !== undefined;
    const registryGroupId: string = labels["registry:groupId"] || "default";
    const registryArtifactId: string = labels["registry:artifactId"] || "";
    const registryVersion: string = labels["registry:version"] || "1";

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const onEditLabels = (newLabels: Labels): void => {
        setIsEditLabelsModalOpen(false);
        pleaseWait("Updating labels...");
        const update: UpdateVersion = {
            description: api?.description,
            labels: newLabels
        };
        Services.getApisService().updateVersionMetaData(apiIdParam, versionParam, update).then(() => {
            closePleaseWaitModal();
            setVersion({
                ...version,
                labels: newLabels
            });
        }).catch(error => {
            // TODO handle errors better than this
            Services.getLoggerService().error("Error updating labels: ", error);
            closePleaseWaitModal();
        });
    };

    const onFinalize = (): void => {
        pleaseWait("Finalizing API version, please wait...");
        Services.getTasksService().finalizeApiVersion(apiIdParam, versionParam).then(() => {
            closePleaseWaitModal();
        }).catch(error => {
            console.error("[VersionDetailsPage] Failed to finalize API version: ", error);
            closePleaseWaitModal();
        });
    };

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

    useEffect(() => {
        // Update the version every couple of seconds - will show labels automatically as the
        // workflow progresses.
        const interval = setInterval(() => {
            Services.getApisService().getVersion(apiIdParam, versionParam).then(setVersion);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tabKey === 1) {
            // Load content when switching to the content tab
            setIsLoadingContent(true);
            Services.getApisService().getVersionContent(apiIdParam, versionParam).then(content => {
                setContent(content);
                setIsLoadingContent(false);
            }).catch(error => {
                // TODO better error handling needed!
                console.error(`[VersionDetailsPage] Failed to load content for ${apiIdParam}@${versionParam}: `, error);
                setIsLoadingContent(false);
            });
        }
    }, [tabKey]);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}`)}>{apiIdParam}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}/versions`)}>Versions</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{versionParam}</BreadcrumbItem>
        </Breadcrumb>
    );

    const infoTabRef = React.createRef<HTMLElement>();
    const contentTabRef = React.createRef<HTMLElement>();
    const workflowTabRef = React.createRef<HTMLElement>();
    const registryTabRef = React.createRef<HTMLElement>();

    let tabList = [
        <Tab
            eventKey={0}
            title={<TabTitleText>Info</TabTitleText>}
            aria-label="Basic version info"
            tabContentId="info-tab"
            tabContentRef={infoTabRef} />,
        <Tab
            eventKey={1}
            title={<TabTitleText>Content</TabTitleText>}
            aria-label="Content"
            tabContentId="content-tab"
            tabContentRef={contentTabRef} />,
        <Tab
            eventKey={2}
            title={<TabTitleText>Lifecycle</TabTitleText>}
            aria-label="Lifecycle"
            tabContentId="workflow-tab"
            tabContentRef={workflowTabRef} />,
    ];

    if (isRegistered) {
        const registryTab = <Tab
            eventKey={3}
            title={<TabTitleText>Registry</TabTitleText>}
            aria-label="Registry"
            tabContentId="registry-tab"
            tabContentRef={registryTabRef} />;
        tabList = [...tabList, registryTab];
    }

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
                    <Tabs
                        style={{ paddingLeft: "20px", backgroundColor: "white" }}
                        activeKey={tabKey}
                        onSelect={(_event, eventKey) => setTabKey(eventKey as number)}
                        isBox={false}
                        aria-label="Version details tabs"
                        role="region"
                    >
                        {
                            tabList
                        }
                    </Tabs>
                    <>
                        <TabContent
                            eventKey={0}
                            id="info-tab"
                            ref={infoTabRef}
                        >
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
                                                <CardHeader actions={{ actions: <Button variant="secondary" onClick={() => setIsEditLabelsModalOpen(true)}>Edit</Button> }}>
                                                    <TextContent>
                                                        <Text component={TextVariants.h3}>Labels</Text>
                                                    </TextContent>
                                                </CardHeader>
                                                <CardBody>
                                                    <ShowLabels labels={version?.labels} />
                                                </CardBody>
                                            </Card>
                                        </FlexItem>
                                    </Flex>
                                </GalleryItem>
                                <GalleryItem className="right-panel" style={{ padding: "20px" }}>
                                    <Card>
                                        <CardHeader>
                                            <TextContent>
                                                <Text component={TextVariants.h3}>Actions</Text>
                                            </TextContent>
                                        </CardHeader>
                                        <CardBody>
                                            <If condition={!isReadOnly}>
                                                <List variant={ListVariant.inline}>
                                                    <ListItem>
                                                        <Button icon={<PencilAltIcon />} variant="primary" onClick={() => appNav.navigateTo(`/apis/${apiIdParam}/versions/${versionParam}/editor`)}>Edit content</Button>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Button icon={<CloseIcon />} variant="secondary" onClick={onFinalize}>Finalize Version</Button>
                                                    </ListItem>
                                                </List>
                                                <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                                            </If>
                                            <List variant={ListVariant.inline}>
                                                <ListItem><Button icon={<DownloadIcon />} variant="secondary">Download</Button></ListItem>
                                            </List>
                                            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                                            <Button icon={<TrashIcon />} variant="danger">Delete</Button>
                                        </CardBody>
                                    </Card>
                                </GalleryItem>
                            </Gallery>
                        </TabContent>
                        <TabContent
                            eventKey={1}
                            id="content-tab"
                            ref={contentTabRef}
                            hidden={true}
                        >
                            <IfNotLoading isLoading={isLoadingContent}>
                                <CodeEditor
                                    code={content}
                                    readOnly={true}
                                    language={Language.json}
                                    onEditorDidMount={(editor, monaco) => {
                                        editor.layout();
                                        editor.focus();
                                        monaco.editor.getModels()[0].updateOptions({ tabSize: 4 });
                                    }}
                                    height="sizeToFit"
                                />
                            </IfNotLoading>
                        </TabContent>
                        <TabContent
                            eventKey={2}
                            id="workflow-tab"
                            ref={workflowTabRef}
                            hidden={true}
                        >
                            <BpmnDiagram diagramUrl="/workflow_default.bpmn" />
                        </TabContent>
                        <TabContent
                            eventKey={3}
                            id="registry-tab"
                            ref={registryTabRef}
                            hidden={true}
                            style={{ height: "100%" }}
                        >
                            <RegistryVersionDetails
                                isRegistered={isRegistered}
                                groupId={registryGroupId}
                                artifactId={registryArtifactId}
                                version={registryVersion} />
                        </TabContent>

                    </>
                </PageSection>
            </IfNotLoading>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
            <EditLabelsModal
                isOpen={isEditLabelsModalOpen}
                labels={version?.labels}
                onEdit={onEditLabels}
                onCancel={() => setIsEditLabelsModalOpen(false)} />
        </AppPage>
    );
};
