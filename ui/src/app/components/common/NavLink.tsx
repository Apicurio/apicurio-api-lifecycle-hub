import React, { CSSProperties, FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";

export type NavLinkProps = {
    to: string;
    title?: string;
    className?: string;
    style?: CSSProperties;
    testId?: string;
    children?: React.ReactNode;
}

export const NavLink: FunctionComponent<NavLinkProps> = ({ testId, to, title, className, style, children }: NavLinkProps) => {
    const appNav = useAppNavigation();
    const navTo: string = appNav.createLink(to);

    return (
        <Link data-testid={testId} className={className} style={style} title={title} to={navTo} children={children as any} />
    );
};