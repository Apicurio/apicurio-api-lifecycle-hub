import { FunctionComponent } from "react";
import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon
} from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type VersionsEmptyStateProps = {
    // No properties
};

export const VersionsEmptyState: FunctionComponent<VersionsEmptyStateProps> = () => {
    return (
        <EmptyState>
            <EmptyStateHeader titleText="No Versions" headingLevel="h4" icon={<EmptyStateIcon icon={AddCircleOIcon} />} />
            <EmptyStateBody>
                No versions found.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button variant="primary">Create version</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );
};
