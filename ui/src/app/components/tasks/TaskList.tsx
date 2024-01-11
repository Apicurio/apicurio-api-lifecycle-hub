import { FunctionComponent } from "react";
import { SearchedApi } from "@client/hub/models";
import { ObjectDropdown, ResponsiveTable } from "@apicurio/common-ui-components";
import { Task } from "@client/workflows/models";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { Link } from "react-router-dom";

/**
 * Properties
 */
export type TaskListProps = {
    tasks: Task[];
};

type TaskAction = {
    label: string;
    testId: string;
    onClick: () => void;
};

type TaskActionSeparator = {
    isSeparator: true;
};


export const TaskList: FunctionComponent<TaskListProps> = (props: TaskListProps) => {
    const appNav = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 25, sortable: false },
        { index: 1, id: "description", label: "Description", width: 50, sortable: false },
        { index: 2, id: "assignee", label: "Assignee", width: 25, sortable: false }
    ];

    const renderColumnData = (column: Task, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <Link to={appNav.createLink(`/tasks/${column.id}`)}>{column.name}</Link>
            );
        }
        // Description.
        if (colIndex === 1) {
            return (
                <span>{column.description}</span>
            );
        }
        // Assignee
        if (colIndex === 2) {
            return (
                <span>{column.assignee || "Demo User"}</span>
            );
        }
        return (
            <span />
        );
    };

    const navigateToTask = (taskId: string): void => {
        appNav.navigateTo(`/tasks/${taskId}`);
    };

    const actionsFor = (task: Task): (TaskAction | TaskActionSeparator)[] => {
        return [
            { label: "View Task", testId: `view-${task.id}`, onClick: () => navigateToTask(task.id as string) }
        ];
    };

    return (
        <div className="task-list">
            <ResponsiveTable
                ariaLabel="list of tasks"
                columns={columns}
                data={props.tasks}
                expectedLength={props.tasks.length}
                minimumColumnWidth={350}
                renderHeader={({ column, Th }) => (
                    <Th className="task-list-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="task-list-cell" key={`cell-${colIndex}-${row.id}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as SearchedApi, colIndex) as any} />
                )}
                renderActions={({ row }) => (
                    <ObjectDropdown
                        items={actionsFor(row)}
                        isKebab={true}
                        label="Actions"
                        itemToString={item => item.label}
                        itemToTestId={item => item.testId}
                        itemIsDivider={item => item.isSeparator}
                        onSelect={item => item.onClick()}
                        testId={`task-actions-${row.id}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
