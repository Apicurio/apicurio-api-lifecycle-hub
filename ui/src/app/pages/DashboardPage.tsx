import { FunctionComponent } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Gallery,
    GalleryItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { NavPage } from "@app/components";

export type DashboardPageProps = {
    // No properties.
}

export const DashboardPage: FunctionComponent<DashboardPageProps> = () => {

    return (
        <AppPage page={NavPage.DASHBOARD}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">Dashboard</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <Gallery hasGutter maxWidths={{ default: "400px" }}>
                    <GalleryItem key={1}>
                        <Card>
                            <CardHeader>
                                <b>APIs</b>
                            </CardHeader>
                            <CardBody>This is a card about APIs</CardBody>
                        </Card>
                    </GalleryItem>
                    <GalleryItem key={2}>
                        <Card>
                            <CardHeader>
                                <b>Tasks</b>
                            </CardHeader>
                            <CardBody>This is a card about Tasks</CardBody>
                        </Card>
                    </GalleryItem>
                </Gallery>
            </PageSection>
        </AppPage>
    );
};
