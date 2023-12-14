import { BaseService } from "../baseService";
import { CompleteTask, Task } from "@client/workflows/models";

/**
 * The System service.
 */
export class TasksService extends BaseService {

    public getTasks(): Promise<Task[] | undefined> {
        this.logger?.debug("[TasksService] Getting all tasks.");

        return this.workflowsClient().tasks.get();
    }

    public approve(taskId: string): Promise<void> {
        this.logger?.debug("[TasksService] Approving task: ", taskId);

        const approval: CompleteTask = {
            additionalData: {
                approval: true
            }
        };
        return this.workflowsClient().tasks.byTaskId(taskId).put(approval);
    }

    public reject(taskId: string): Promise<void> {
        this.logger?.debug("[TasksService] Rejecting task: ", taskId);

        const approval: CompleteTask = {
            additionalData: {
                approval: false
            }
        };
        return this.workflowsClient().tasks.byTaskId(taskId).put(approval);
    }
}
