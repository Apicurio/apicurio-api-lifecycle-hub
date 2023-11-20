import { CSSProperties, FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import "./ApiDescription.css";

/**
 * Properties
 */
export type ApiDescriptionProps = {
    description: string | undefined;
    truncate?: boolean;
    className?: string;
    style?: CSSProperties | undefined;
}

export const ApiDescription: FunctionComponent<ApiDescriptionProps> = ({ description, truncate, className, style }: ApiDescriptionProps) => {
    let classes: string = "";
    if (className) {
        classes = className;
    }
    if (!description) {
        classes = classes + " no-description";
    }
    return truncate ? (
        <div>
            <Truncate style={style} className={classes} content={description || "No description."} tooltipPosition="top" />
        </div>
    ) : (
        <div className={classes} style={style}>{description || "No description."}</div>
    );
};