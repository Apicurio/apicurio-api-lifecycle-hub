import React, { FunctionComponent } from "react";
import { NavLink } from "@app/components";
import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    Truncate
} from "@patternfly/react-core";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { TableVariant } from "@patternfly/react-table";
import { SearchedVersion, VersionSearchResults } from "@client/hub/models";
import { FromNow, IfNotEmpty, ResponsiveTable } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type LatestVersionsListProps = {
    apiId: string;
    versions: VersionSearchResults;
    onSelect: (version: string) => void;
    onDelete: (version: string) => void;
    onCreate: () => void;
};

export const LatestVersionsList: FunctionComponent<LatestVersionsListProps> = (props: LatestVersionsListProps) => {
    const appNav = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "version", label: "Version", width: 50, sortable: false },
        { index: 1, id: "createdOn", label: "Created", width: 50, sortable: false }
    ];

    const renderColumnData = (column: SearchedVersion, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <NavLink className="version-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        to={appNav.createLink(`/apis/${props.apiId}/versions/${column.version}`)}>
                        <Truncate content={column.version as string} tooltipPosition="top" />
                    </NavLink>
                </div>
            );
        }
        // Modified on.
        if (colIndex === 1) {
            return (
                <FromNow date={column.createdOn} />
            );
        }
        return (
            <span />
        );
    };

    const emptyVersions = (
        <EmptyState>
            <EmptyStateHeader titleText="No versions found" headingLevel="h4" />
            <EmptyStateBody>
                No versions were found for this API.  Most likely it's a new API and requires an initial version.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button variant="primary" onClick={props.onCreate}>Create new version</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    return (
        <div className="version-list">
            <IfNotEmpty collection={props.versions.versions} emptyState={emptyVersions}>
                <ResponsiveTable
                    ariaLabel="list of versions"
                    variant={TableVariant.compact}
                    columns={columns}
                    data={props.versions.versions}
                    expectedLength={props.versions.count}
                    minimumColumnWidth={150}
                    renderHeader={({ column, Th }) => (
                        <Th className="version-list-header"
                            key={`header-${column.id}`}
                            width={column.width}
                            modifier="truncate">{column.label}</Th>
                    )}
                    renderCell={({ row, colIndex, Td }) => (
                        <Td className="version-list-cell" key={`cell-${colIndex}-${row.version}`}
                            style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            children={renderColumnData(row as SearchedVersion, colIndex) as any} />
                    )}
                />
            </IfNotEmpty>
        </div>
    );
};
