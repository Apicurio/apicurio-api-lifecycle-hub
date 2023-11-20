import React, { FunctionComponent, useEffect, useState } from "react";
import { PageSection, PageSectionVariants, Text, TextContent } from "@patternfly/react-core";
import { useParams } from "react-router-dom";
import { Api } from "@client/models";
import { Services } from "@services/services.ts";
import { IsLoading } from "@app/components";

export type ApiDetailsPageProps = {
    // No properties.
}

export const ApiDetailsPage: FunctionComponent<ApiDetailsPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [api, setApi] = useState<Api>();
    const params = useParams();

    // Load the api based on the api ID (from the path param).
    useEffect(() => {
        setLoading(true);
        const apiId: string = params["apiId"] as string;

        Promise.all([
            Services.getApisService().getApi(apiId).then(setApi)
        ]).then(() => {
            setLoading(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[ApiDetailsPage] Failed to get API with id ${apiId}: `, error);
        });
    }, [params]);

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};
