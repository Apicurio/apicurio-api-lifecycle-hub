import { FunctionComponent } from "react";
import { Services } from "@services/services.ts";

/**
 * Properties
 */
export type RegistryVersionDetailsProps = {
    isRegistered: boolean;
    groupId: string;
    artifactId: string;
    version: string;
};

export const RegistryVersionDetails: FunctionComponent<RegistryVersionDetailsProps> = (props: RegistryVersionDetailsProps) => {
    if (!props.isRegistered) {
        return <></>;
    }

    const registryUrl: string = Services.getConfigService().integrations().registry as string;
    const frameUrl: string = `${registryUrl}artifacts/${props.groupId}/${props.artifactId}/versions/${props.version}`;

    Services.getLoggerService().debug("Frame URL: ", frameUrl);

    return (
        <iframe src={frameUrl} style={{ width: "100%", height: "100%" }} />
    );
};
