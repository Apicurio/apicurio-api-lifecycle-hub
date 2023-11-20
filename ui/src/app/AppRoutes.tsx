import { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@app/pages";
import { ApisPage } from "@app/pages/ApisPage.tsx";
import { ApiDetailsPage } from "@app/pages/ApiDetails.tsx";

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
        </Routes>
    );
};
