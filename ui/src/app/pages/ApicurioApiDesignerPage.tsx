import { FunctionComponent } from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { Services } from "@services/services.ts";

export type ApicurioApiDesignerPageProps = {
    // No properties.
}

export const ApicurioApiDesignerPage: FunctionComponent<ApicurioApiDesignerPageProps> = () => {
    const designerUrl: string = Services.getConfigService().integrations().apiDesigner as string;
    Services.getLoggerService().debug("[ApicurioRegistryPage] Designer URL: ", designerUrl);

    return (
        <AppPage page={NavPage.DESIGNER}>
            <PageSection variant={PageSectionVariants.light} isFilled={true} padding={{ default: "noPadding" }}>
                <iframe src={designerUrl} style={{ width: "100%", height: "100%" }} />
            </PageSection>
        </AppPage>
    );
};
