import { FunctionComponent, useEffect, useState } from "react";
import {
    ActionGroup,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Form,
    FormGroup,
    FormSection,
    PageSection,
    PageSectionVariants,
    Switch,
    Text,
    TextContent,
    TextInput
} from "@patternfly/react-core";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { NavPage } from "@app/components";
import { If, IfNotLoading, PleaseWaitModal } from "@apicurio/common-ui-components";
import { Task } from "@client/workflows/models";
import { Services } from "@services/services.ts";
import { Link, useParams } from "react-router-dom";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";

export type TaskDetailsPageProps = {
    // No properties.
}

export const TaskDetailsPage: FunctionComponent<TaskDetailsPageProps> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [task, setTask] = useState<Task>();
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitModalMessage, setPleaseWaitModalMessage] = useState("Please wait.");
    const [registryGroup, setRegistryGroup] = useState("default");
    const [registryArtifactId, setRegistryArtifactId] = useState("Demo API");
    const [registryVersion, setRegistryVersion] = useState("1.0");

    const params = useParams();
    const appNav = useAppNavigation();

    const taskId: string = params["taskId"] as string;

    const pleaseWait = (message: string): void => {
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitModalMessage(message);
    };

    const closePleaseWaitModal = (): void => {
        setIsPleaseWaitModalOpen(false);
    };

    const doCompleteApproval = (): void => {
        pleaseWait("Completing approval task, please wait...");
        const taskData: any = {
            approved: true,
            registryGroup,
            registryArtifactId,
            registryVersion
        };
        Services.getTasksService().complete(taskId, taskData).then(() => {
            closePleaseWaitModal();
            appNav.navigateTo("/tasks");
        }).catch(error => {
            Services.getLoggerService().error("Error completing task: ", error);
            closePleaseWaitModal();
        });
    };

    const doCompleteImplement = (): void => {
        pleaseWait("Completing Implement API task, please wait...");
        Services.getTasksService().complete(taskId).then(() => {
            closePleaseWaitModal();
            appNav.navigateTo("/tasks");
        }).catch(error => {
            Services.getLoggerService().error("Error completing task: ", error);
            closePleaseWaitModal();
        });
    };

    useEffect(() => {
        setIsLoading(true);
        Services.getTasksService().getTask(taskId).then(task => {
            setTask(task);
            setIsLoading(false);
        });
    }, []);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/tasks")}>Tasks</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{ task?.name || taskId}</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.TASKS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">Task Details</Text>
                    <Text component="p" className="description">
                        {
                            task?.description
                        }
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection variant={PageSectionVariants.default} isFilled={true}>
                <IfNotLoading isLoading={isLoading}>
                    <If condition={task?.name === "Approval"}>
                        <Form>
                            <FormSection title="Instructions">
                                <FormGroup fieldId="task-instructions">
                                    <Text>
                                        You have been asked to review a (finalized) API Design and approve it
                                        for registration in the Registry.
                                    </Text>
                                    <Text>
                                        <Link to={appNav.createLink("/apis/test-api/versions/1.0")}>Click here</Link>
                                        &nbsp;to review the API Design.
                                    </Text>
                                </FormGroup>
                            </FormSection>
                            <FormSection title="Registry" style={{ marginTop: "5px" }}>
                                <FormGroup fieldId="task-registry-info">
                                    <Text>
                                        Please provide Apicurio Registry coordinates - this is where you want the
                                        API definition to land.
                                    </Text>
                                </FormGroup>
                                <FormGroup label="Group" isRequired={true} fieldId="task-registry-group">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="task-registry-group"
                                        data-testid="task-registry-group"
                                        name="task-registry-group"
                                        aria-describedby="task-registry-group-helper"
                                        value={registryGroup}
                                        onChange={(_event, value) => {setRegistryGroup(value);}}
                                    />
                                </FormGroup>
                                <FormGroup label="Group" isRequired={true} fieldId="task-registry-artifactId">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="task-registry-artifactId"
                                        data-testid="task-registry-artifactId"
                                        name="task-registry-artifactId"
                                        aria-describedby="task-registry-artifactId-helper"
                                        value={registryArtifactId}
                                        onChange={(_event, value) => {setRegistryArtifactId(value);}}
                                    />
                                </FormGroup>
                                <FormGroup label="Version" isRequired={true} fieldId="task-registry-version">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="task-registry-version"
                                        data-testid="task-registry-version"
                                        name="task-registry-version"
                                        aria-describedby="task-registry-version-helper"
                                        value={registryVersion}
                                        onChange={(_event, value) => {setRegistryVersion(value);}}
                                    />
                                </FormGroup>
                            </FormSection>
                            <FormSection title="Approval" style={{ marginTop: "5px" }}>
                                <FormGroup label="Do you approve?" isRequired={true} fieldId="task-approval">
                                    <Switch
                                        id="approval-switch"
                                        label="I approve"
                                        labelOff="I do NOT approve"
                                        isChecked={true}
                                        onChange={() => {}}
                                        ouiaId="BasicSwitch"
                                    />
                                </FormGroup>
                            </FormSection>
                            <ActionGroup>
                                <Button variant="primary" onClick={doCompleteApproval}>Complete Task</Button>
                                <Button variant="link">Reject Task</Button>
                            </ActionGroup>
                        </Form>
                    </If>
                    <If condition={task?.name === "Implement API"}>
                        <Form>
                            <FormSection title="Instructions">
                                <FormGroup fieldId="task-instructions">
                                    <Text>
                                        You have been asked to implement version 1.0 of Test API.  Please check out
                                        the GitHub branch, write any necessary code, and push your changes to the
                                        branch.  When done, come back here and mark this task as complete.
                                    </Text>
                                    <Text>
                                        <Link to={appNav.createLink("/apis/test-api/versions/1.0")}>Click here</Link>
                                        &nbsp;to review the Pull Request and check it out locally.
                                    </Text>
                                </FormGroup>
                            </FormSection>
                            <ActionGroup>
                                <Button variant="primary" onClick={doCompleteImplement}>Complete Task</Button>
                                <Button variant="link">Reject Task</Button>
                            </ActionGroup>
                        </Form>
                    </If>
                </IfNotLoading>
            </PageSection>
            <PleaseWaitModal message={pleaseWaitModalMessage} isOpen={isPleaseWaitModalOpen} />
        </AppPage>
    );
};
