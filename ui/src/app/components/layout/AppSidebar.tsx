import { FunctionComponent } from "react";
import { Nav, NavItem, NavList, PageSidebar, PageSidebarBody } from "@patternfly/react-core";
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
                        <NavItem itemId={NavPage.DASHBOARD} isActive={props.page === NavPage.DASHBOARD} to="/dashboard">
                            Dashboard
                        </NavItem>
                        <NavItem itemId={NavPage.APIS} isActive={props.page === NavPage.APIS} to="/apis">
                            APIs
                        </NavItem>
                    </NavList>
                </Nav>
            </PageSidebarBody>
        </PageSidebar>
    );
};
