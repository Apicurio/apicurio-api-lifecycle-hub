import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { Api } from "@client/models";
import { Services } from "@services/services.ts";
import { IsLoading, NavPage } from "@app/components";
import { AppPage } from "@app/components/layout/AppPage.tsx";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";

export type ApiDetailsPageProps = {
    // No properties.
}

export const ApiDetailsPage: FunctionComponent<ApiDetailsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [api, setApi] = useState<Api>();

    const params = useParams();
    const appNav = useAppNavigation();

    const apiId: string = params["apiId"] as string;

    // Load the api based on the api ID (from the path param).
    useEffect(() => {
        setLoading(true);

        Promise.all([
            Services.getApisService().getApi(apiId).then(setApi)
        ]).then(() => {
            setLoading(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[ApiDetailsPage] Failed to get API with id ${apiId}: `, error);
        });
    }, [params]);

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNav.createLink("/apis")}>APIs</Link></BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>{apiId}</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <AppPage page={NavPage.APIS} breadcrumb={breadcrumb}>
            <PageSection variant={PageSectionVariants.light} isWidthLimited>
                <TextContent>
                    <Text component="h1">API Details</Text>
                </TextContent>
            </PageSection>
            <IsLoading condition={isLoading}>
                <PageSection>
                    <h1>API details for <span>{ api?.name }</span> go here</h1>
                </PageSection>
            </IsLoading>
        </AppPage>
    );
};
