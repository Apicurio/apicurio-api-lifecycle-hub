import { FunctionComponent, useEffect, useState } from "react";
import { Nav, NavItem, NavList, Page, PageSidebar, PageSidebarBody } from "@patternfly/react-core";
import { Location, useLocation } from "react-router-dom";
import { AppHeader } from "@app/components";
import { Services } from "../services";
import { AppNavigation, useAppNavigation } from "@hooks/useAppNavigation.ts";
import { AppRoutes } from "@app/AppRoutes.tsx";

export type LayoutProps = {
    // No props
};

enum NavPage {
    DASHBOARD, APIS
}

/**
 * The main application class.
 */
export const Layout: FunctionComponent<LayoutProps> = () => {
    const [navPage, setNavPage] = useState<NavPage>(NavPage.DASHBOARD);
    const location: Location<any> = useLocation();
    const appNav: AppNavigation = useAppNavigation();

    useEffect(() => {
        Services.getLoggerService().debug("[Layout] Navigation happened to: ", location);
        if (location.pathname.startsWith("/apis")) {
            setNavPage(NavPage.APIS);
        } else {
            setNavPage(NavPage.DASHBOARD);
        }
    }, [location]);

    const onNavSelect = (_event: React.FormEvent<HTMLInputElement>, selectedItem: any) => {
        appNav.navigateTo(selectedItem.to);
        _event.preventDefault();
        _event.stopPropagation();
    };

    const pageNav = (
        <Nav onSelect={onNavSelect}>
            <NavList>
                <NavItem itemId={NavPage.DASHBOARD} isActive={navPage === NavPage.DASHBOARD} to="/dashboard">
                    Dashboard
                </NavItem>
                <NavItem itemId={NavPage.APIS} isActive={navPage === NavPage.APIS} to="/apis">
                    APIs
                </NavItem>
            </NavList>
        </Nav>
    );

    const sidebar = (
        <PageSidebar isSidebarOpen={true} id="vertical-sidebar">
            <PageSidebarBody>{pageNav}</PageSidebarBody>
        </PageSidebar>
    );

    return (
        <Page
            className="pf-m-redhat-font"
            isManagedSidebar={false}
            header={<AppHeader />}
            sidebar={sidebar}
        >
            <AppRoutes />
        </Page>
    );
};
