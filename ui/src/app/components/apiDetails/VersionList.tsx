import React, { FunctionComponent, useEffect, useState } from "react";
import { FromNow, NavLink } from "@app/components";
import { Truncate } from "@patternfly/react-core";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { ThProps } from "@patternfly/react-table";
import { SearchedVersion, VersionSearchResults } from "@client/models";
import { VersionSortBy, VersionsSort } from "@models/VersionsSort.model.ts";
import { ResponsiveTable } from "@apicurio/common-ui-components";

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
};

export const VersionList: FunctionComponent<VersionListProps> = (props: VersionListProps) => {
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

    return (
        <div className="version-list">
            <ResponsiveTable
                ariaLabel="list of versions"
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
        </div>
    );
};
