import { FunctionComponent } from "react";
import { SearchedApi } from "@client/hub/models";
import { ObjectDropdown, ResponsiveTable } from "@apicurio/common-ui-components";
import { Task } from "@client/workflows/models";

/**
 * Properties
 */
export type TaskListProps = {
    tasks: Task[];
    onApprove: (taskId: string) => void;
    onReject: (taskId: string) => void;
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
    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 25, sortable: false },
        { index: 1, id: "description", label: "Type", width: 50, sortable: false },
        { index: 2, id: "assignee", label: "Assignee", width: 25, sortable: false }
    ];


    const renderColumnData = (column: Task, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <span>{column.name}</span>
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
                <span>{column.assignee}</span>
            );
        }
        return (
            <span />
        );
    };

    const actionsFor = (task: Task): (TaskAction | TaskActionSeparator)[] => {
        return [
            { label: "Approve", testId: `approve-${task.id}`, onClick: () => props.onApprove(task.id as string) },
            { label: "Reject", testId: `delete-api-${task.id}`, onClick: () => props.onReject(task.id as string) }
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
