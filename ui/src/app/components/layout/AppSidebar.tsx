import React, { FunctionComponent } from "react";
import { Nav, NavGroup, NavItem, NavList, PageSidebar, PageSidebarBody } from "@patternfly/react-core";
import { AppNavigation, useAppNavigation } from "@hooks/useAppNavigation.ts";
import { NavPage } from "@app/components";


export type AppSidebarProps = {
    page: NavPage;
};


export const AppSidebar: FunctionComponent<AppSidebarProps> = (props: AppSidebarProps) => {
    const appNav: AppNavigation = useAppNavigation();

    const onNavSelect = (_event: React.FormEvent<HTMLInputElement>, selectedItem: any) => {
        appNav.navigateTo(selectedItem.to);
        _event.preventDefault();
        _event.stopPropagation();
    };

    return (
        <PageSidebar isSidebarOpen={true} id="vertical-sidebar">
            <PageSidebarBody>
                <Nav onSelect={onNavSelect}>
                    <NavList>
                        <NavGroup title="Lifecycle Hub">
                            <NavItem itemId={NavPage.DASHBOARD} isActive={props.page === NavPage.DASHBOARD} to="/dashboard">
                                Dashboard
                            </NavItem>
                            <NavItem itemId={NavPage.APIS} isActive={props.page === NavPage.APIS} to="/apis">
                                APIs
                            </NavItem>
                        </NavGroup>
                        <NavGroup title="Integrations">
                            <NavItem itemId={NavPage.DESIGNER} isActive={props.page === NavPage.DESIGNER} to="/designer">
                                API Designer
                            </NavItem>
                            <NavItem itemId={NavPage.REGISTRY} isActive={props.page === NavPage.REGISTRY} to="/registry">
                                Registry
                            </NavItem>
                        </NavGroup>
                    </NavList>
                </Nav>
            </PageSidebarBody>
        </PageSidebar>
    );
};
