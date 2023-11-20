import React, { FunctionComponent } from "react";
import { Page } from "@patternfly/react-core";
import { AppHeader, AppSidebar, NavPage } from "@app/components";


export type AppPageProps = {
    page: NavPage;
    breadcrumb?: React.ReactNode;
    children: React.ReactNode;
};


export const AppPage: FunctionComponent<AppPageProps> = (props: AppPageProps) => {

    return (
        <Page
            className="pf-m-redhat-font"
            isManagedSidebar={false}
            header={<AppHeader />}
            breadcrumb={props.breadcrumb}
            sidebar={<AppSidebar page={props.page} />}
        >
            {props.children}
        </Page>
    );
};
