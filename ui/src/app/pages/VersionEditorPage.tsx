import React, { FunctionComponent, RefObject, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { Api, Version } from "@client/models";
import { Services } from "@services/services.ts";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { IfNotLoading, PleaseWaitModal } from "@apicurio/common-ui-components";

export type VersionEditorPageProps = {
    // No properties.
}

export const VersionEditorPage: FunctionComponent<VersionEditorPageProps> = () => {
    const ref: RefObject<any> = React.createRef();

    const [isLoading, setLoading] = useState(true);
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const [isFrameLoaded, setIsFrameLoaded] = useState(false);
    // TODO implement correlationId (uuid probably)
    const [correlationId] = useState("12345");
    const [content, setContent] = useState("");
    const [api, setApi] = useState<Api>();
    const [version, setVersion] = useState<Version>();
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");

    const params = useParams();
    const appNav = useAppNavigation();

    const apiDesignerEmbeddedEditorUrl: string = (Services.getConfigService().integrations().apiDesigner + "/editor-embedded").replace("//editor-embedded", "/editor-embedded");

    const apiIdParam: string = params["apiId"] as string;
    const versionParam: string = params["version"] as string;

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const onSave = (newContent: string): void => {
        pleaseWait("Saving version content, please wait...");
        Services.getApisService().updateVersionContent(apiIdParam, versionParam, newContent, "application/json").then(() => {
            closePleaseWaitModal();
        }).catch(error => {
            Services.getLoggerService().info("[VersionEditorPage] Error saving version content: ", error);
            closePleaseWaitModal();
        });
    };

    // Load the api based on the api ID (from the path param).
    useEffect(() => {
        setLoading(true);

        Promise.all([
            Services.getApisService().getApi(apiIdParam).then(setApi),
            Services.getApisService().getVersion(apiIdParam, versionParam).then(setVersion),
            Services.getApisService().getVersionContent(apiIdParam, versionParam).then(setContent)
        ]).then(() => {
            setIsContentLoaded(true);
            setLoading(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[VersionEditorPage] Failed to get API with id ${apiIdParam}: `, error);
        });
    }, [params]);

    useEffect(() => {
        // Send content to API Designer iframe only when frame and content are both loaded
        if (isFrameLoaded && isContentLoaded) {
            // TODO properly handle artifactType and contentType
            const message: any = {
                type: "apicurio_onLoad",
                correlationId: correlationId,
                artifactType: "OPENAPI",
                data: {
                    content: content,
                    contentType: "application/json"
                }
            };
            ref.current.contentWindow.postMessage(message, "*");
        }
    }, [isContentLoaded, isFrameLoaded]);

    useEffect(() => {
        const eventListener: any = (event: any) => {
            if (event.data && event.data.type === "apicurio_onSave") {
                if (event.data.correlationId === correlationId) {
                    console.info("[VersionEditorPage] Handling 'onSave' from API Designer frame.");
                    const newContent: any = event.data.data.content;
                    onSave(newContent);
                } else {
                    console.info("[VersionEditorPage] Ignoring 'onSave' from API Designer frame (unmatched correlationId).");
                }
            }
        };

        console.info("[VersionEditorPage] Adding window event listener.");
        window.addEventListener("message", eventListener, false);
        return () => {
            window.removeEventListener("message", eventListener, false);
        };
    });

    const onEditorLoaded = (): void => {
        setIsFrameLoaded(true);
    };

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}`)}>{apiIdParam}</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}/versions`)}>Versions</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNav.createLink(`/apis/${apiIdParam}/versions/${versionParam}`)}>{versionParam}</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>Editor</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">Edit Version</Text>
                    <Text component="p" className="description">
                        Edit the content of the version - make whatever changes you need and then save them back to
                        the hub.
                    </Text>
                </TextContent>
            </PageSection>
            <IfNotLoading isLoading={isLoading}>
                <PageSection isFilled={true} style={{ padding: 0 }}>
                    <iframe
                        style={{ width: "100%", height: "100%" }}
                        id="version-editor-frame"
                        ref={ ref }
                        onLoad={onEditorLoaded}
                        src={apiDesignerEmbeddedEditorUrl} />
                </PageSection>
            </IfNotLoading>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
        </AppPage>
    );
};
