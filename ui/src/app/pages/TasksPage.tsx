import { FunctionComponent, useEffect, useState } from "react";
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateHeader,
    EmptyStateIcon,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { NavPage, TaskList } from "@app/components";
import { IfNotLoading, ListWithToolbar } from "@apicurio/common-ui-components";
import { Task } from "@client/workflows/models";
import { Services } from "@services/services.ts";
import { CubesIcon } from "@patternfly/react-icons";

export type TasksPageProps = {
    // No properties.
}

export const TasksPage: FunctionComponent<TasksPageProps> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);

    const doListTasks = (): void => {
        Services.getTasksService().getTasks().then(results => {
            setTasks(results as Task[]);
            setIsLoading(false);
        }).catch(error => {
            // TODO proper error handling
            Services.getLoggerService().error("[ApisPage] Error searching for tasks: ", error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        doListTasks();
    }, []);

    const emptyState = (
        <EmptyState>
            <EmptyStateHeader titleText="No tasks" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                No tasks found for you. Great!
            </EmptyStateBody>
        </EmptyState>
    );

    return (
        <AppPage page={NavPage.TASKS}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">My Tasks</Text>
                    <Text component="p" className="description">
                        Lists all tasks assigned to you.  Try completing some tasks to progress the workflows
                        they belong to.
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection variant={PageSectionVariants.default} isFilled={true}>
                <IfNotLoading isLoading={isLoading}>
                    <ListWithToolbar
                        toolbar={<></>}
                        emptyState={emptyState}
                        filteredEmptyState={<></>}
                        isLoading={false}
                        isError={false}
                        isFiltered={false}
                        isEmpty={tasks.length === 0}
                    >
                        <TaskList tasks={tasks} />
                    </ListWithToolbar>
                </IfNotLoading>
            </PageSection>
        </AppPage>
    );
};
