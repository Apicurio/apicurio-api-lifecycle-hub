import { FunctionComponent } from "react";
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon } from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type ApisEmptyStateProps = {
};

export const ApisEmptyState: FunctionComponent<ApisEmptyStateProps> = () => {
    return (
        <EmptyState>
            <EmptyStateHeader titleText="No APIs" headingLevel="h4" icon={<EmptyStateIcon icon={AddCircleOIcon} />} />
            <EmptyStateBody>
                To get started, create or import a API.
            </EmptyStateBody>
        </EmptyState>
    );
};
