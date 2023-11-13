import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import { FunctionComponent } from "react";
import { Page } from "@patternfly/react-core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppHeader, ApplicationAuth } from "@app/components";
import { Services } from "../services";
import { HomePage } from "@app/pages";

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
                <Page
                    className="pf-m-redhat-font"
                    isManagedSidebar={false}
                    header={<AppHeader />}
                >
                    <Routes>
                        <Route path="/" element={ <HomePage /> } />
                    </Routes>
                </Page>
            </Router>
        </ApplicationAuth>
    );
};
