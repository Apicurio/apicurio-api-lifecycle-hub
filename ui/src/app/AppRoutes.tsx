import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { ApiDetailsPage, ApisPage, DashboardPage, VersionDetailsPage, VersionsPage } from "@app/pages";

export type AppRoutesProps = {
    // No props
};

/**
 * The main application class.
 */
export const AppRoutes: FunctionComponent<AppRoutesProps> = () => {

    return (
        <Routes>
            <Route path="/" element={ <DashboardPage /> } />
            <Route path="/dashboard" element={ <DashboardPage /> } />
            <Route path="/apis" element={ <ApisPage /> } />
            <Route path="/apis/:apiId" element={ <ApiDetailsPage /> } />
            <Route path="/apis/:apiId/versions" element={ <VersionsPage /> } />
            <Route path="/apis/:apiId/versions/:version" element={ <VersionDetailsPage /> } />
        </Routes>
    );
};
