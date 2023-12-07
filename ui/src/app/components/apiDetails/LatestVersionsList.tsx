import React, { FunctionComponent, useEffect, useState } from "react";
import { FromNow, NavLink } from "@app/components";
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
import { TableVariant, ThProps } from "@patternfly/react-table";
import { SearchedVersion, VersionSearchResults } from "@client/models";
import { VersionSortBy, VersionsSort } from "@models/VersionsSort.model.ts";
import { IfNotEmpty, ResponsiveTable } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type VersionListProps = {
    apiId: string;
    versions: VersionSearchResults;
    sort: VersionsSort;
    onSort: (sort: VersionsSort) => void;
    onSelect: (version: string) => void;
    onDelete: (version: string) => void;
    onCreate: () => void;
};

export const LatestVersionsList: FunctionComponent<VersionListProps> = (props: VersionListProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();

    const appNav = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "version", label: "Version", width: 50, sortable: true },
        { index: 1, id: "createdOn", label: "Created", width: 50, sortable: true }
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

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: props.sort.direction
            },
            onSort: (_event, index, direction) => {
                const byn: VersionSortBy[] = ["version", "createdOn"];
                const sort: VersionsSort = {
                    by: byn[index],
                    direction
                };
                props.onSort(sort);
            },
            columnIndex: column.index
        } : undefined;
    };

    useEffect(() => {
        setSortByIndex(props.sort.by === "version" ? 0 : 1);
    }, [props.sort]);

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
                        <Th sort={sortParams(column)}
                            className="version-list-header"
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
