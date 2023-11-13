import React, { FunctionComponent } from "react";
import { Services } from "@services/services.ts";
import { AuthService } from "@services/auth";

/**
 * Properties
 */
export type IfAuthProps = {
    enabled?: boolean;
    isAuthenticated?: boolean;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated authentication parameters are true.
 */
export const IfAuth: FunctionComponent<IfAuthProps> = (props: IfAuthProps) => {

    const accept = () => {
        const auth: AuthService = Services.getAuthService();
        let rval: boolean = true;
        if (props.enabled !== undefined) {
            rval = rval && (auth.isAuthenticationEnabled() === props.enabled);
        }
        if (props.isAuthenticated !== undefined) {
            rval = rval && (auth.isAuthenticated() === props.isAuthenticated);
        }
        return rval;
    };

    if (accept()) {
        return <React.Fragment children={props.children} />;
    } else {
        return <React.Fragment />;
    }

};
