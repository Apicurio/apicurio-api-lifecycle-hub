import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import { FunctionComponent } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApplicationAuth } from "@app/components";
import { Services } from "../services";
import { AppRoutes } from "@app/AppRoutes.tsx";

export type AppProps = {
    // No props
};

/**
 * The main application class.
 */
export const App: FunctionComponent<AppProps> = () => {
    const contextPath: string | undefined = Services.getConfigService().uiContextPath();
    Services.getLoggerService().info("[App] Using app contextPath: ", contextPath);

    return (
        <ApplicationAuth>
            <Router basename={contextPath}>
                <AppRoutes />
            </Router>
        </ApplicationAuth>
    );
};
