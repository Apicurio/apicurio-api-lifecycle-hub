import { FunctionComponent } from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { Services } from "@services/services.ts";

export type MicrocksPageProps = {
    // No properties.
}

export const MicrocksPage: FunctionComponent<MicrocksPageProps> = () => {
    const microcksUrl: string = Services.getConfigService().integrations().microcks as string;
    Services.getLoggerService().debug("[MicrocksPageProps] Microcks URL: ", microcksUrl);

    return (
        <AppPage page={NavPage.MICROCKS}>
            <PageSection variant={PageSectionVariants.light} isFilled={true} padding={{ default: "noPadding" }}>
                <iframe src={microcksUrl} style={{ width: "100%", height: "100%" }} />
            </PageSection>
        </AppPage>
    );
};
