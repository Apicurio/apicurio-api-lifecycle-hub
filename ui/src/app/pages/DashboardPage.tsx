import { FunctionComponent, useEffect, useState } from "react";
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
import { Services } from "@services/services.ts";
import { IfNotLoading } from "@apicurio/common-ui-components";

export type DashboardPageProps = {
    // No properties.
}

export const DashboardPage: FunctionComponent<DashboardPageProps> = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [apiCount, setApiCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);

    useEffect(() => {
        Promise.all([
            Services.getApisService().searchApis(undefined, { page: 1, pageSize: 500 })
                .then(results => setApiCount(results?.count || 0)),
            Services.getTasksService().getTasks().then(tasks => {
                setTaskCount(tasks?.length || 0);
            })
        ]).then(() => {
            setIsLoading(false);
        }).catch(error => {
            Services.getLoggerService().error("Error loading dashboard data: ", error);
            setIsLoading(false);
        });
    }, []);

    return (
        <AppPage page={NavPage.DASHBOARD}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">Dashboard</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <IfNotLoading isLoading={isLoading}>
                    <Gallery hasGutter maxWidths={{ default: "400px" }}>
                        <GalleryItem key={1}>
                            <Card>
                                <CardHeader>
                                    <b>APIs</b>
                                </CardHeader>
                                <CardBody>There are {apiCount} API(s) available.</CardBody>
                            </Card>
                        </GalleryItem>
                        <GalleryItem key={2}>
                            <Card>
                                <CardHeader>
                                    <b>Tasks</b>
                                </CardHeader>
                                <CardBody>You have {taskCount} tasks assigned to you.</CardBody>
                            </Card>
                        </GalleryItem>
                    </Gallery>
                </IfNotLoading>
            </PageSection>
        </AppPage>
    );
};
