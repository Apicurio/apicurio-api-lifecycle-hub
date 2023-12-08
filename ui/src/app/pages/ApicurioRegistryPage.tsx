import { FunctionComponent } from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { Services } from "@services/services.ts";

export type ApicurioRegistryPageProps = {
    // No properties.
}

export const ApicurioRegistryPage: FunctionComponent<ApicurioRegistryPageProps> = () => {
    const registryUrl: string = Services.getConfigService().integrations().registry as string;
    Services.getLoggerService().debug("[ApicurioRegistryPage] Registry URL: ", registryUrl);

    return (
        <AppPage page={NavPage.REGISTRY}>
            <PageSection variant={PageSectionVariants.light} isFilled={true} padding={{ default: "noPadding" }}>
                <iframe src={registryUrl} style={{ width: "100%", height: "100%" }} />
            </PageSection>
        </AppPage>
    );
};
