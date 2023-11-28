import { FunctionComponent } from "react";
import { Brand, Masthead, MastheadBrand, MastheadContent, MastheadMain } from "@patternfly/react-core";
import { AppNavigation, useAppNavigation } from "@hooks/useAppNavigation.ts";
import { Link } from "react-router-dom";
import { AppHeaderToolbar } from "@app/components";


export type AppHeaderProps = {
    // No properties.
};


export const AppHeader: FunctionComponent<AppHeaderProps> = () => {
    const appNavigation: AppNavigation = useAppNavigation();

    return (
        <Masthead id="icon-router-link">
            <MastheadMain>
                <MastheadBrand component={props => <Link {...props} to={ appNavigation.createLink("/") } />}>
                    <Brand src="/apicurio_apilifecyclehub_logo_reverse.svg" alt="Apicurio API Lifecycle Hub" heights={{ default: "36px" }} />
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
                <AppHeaderToolbar />
            </MastheadContent>
        </Masthead>
    );
};
