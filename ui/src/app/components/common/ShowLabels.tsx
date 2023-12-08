import { FunctionComponent } from "react";
import { Labels } from "@client/models";
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateVariant, Label } from "@patternfly/react-core";

export type ShowLabelsProps = {
    labels: Labels | undefined;
}

export const ShowLabels: FunctionComponent<ShowLabelsProps> = (props: ShowLabelsProps) => {
    const theLabels: any = props.labels || {};
    const labelKeys: string[] = Object.getOwnPropertyNames(theLabels);

    if (labelKeys.length === 0) {
        return (
            <EmptyState variant={EmptyStateVariant.xs}>
                <EmptyStateHeader titleText="No labels" headingLevel="h4" />
                <EmptyStateBody>
                    This API has no labels yet.
                </EmptyStateBody>
            </EmptyState>
        );
    }

    return (
        <div className="all-labels">
            {
                Object.getOwnPropertyNames(theLabels).map((key, idx) => {
                    return (
                        <Label key={idx} color="blue" style={{ marginRight: "5px" }}>{key}<b>=</b>{theLabels[key]}</Label>
                    );
                })
            }
        </div>
    );
};
