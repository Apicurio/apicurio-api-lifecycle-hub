import { FunctionComponent, useEffect, useState } from "react";
import { ApiDescription, NavLink } from "@app/components";
import { VersionSearchResults, SearchedVersion } from "@client/models";
import { VersionSortBy, VersionsSort } from "@models/VersionsSort.model.ts";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { ThProps } from "@patternfly/react-table";
import { ObjectDropdown, ResponsiveTable, FromNow } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type VersionListProps = {
    apiId: string;
    versions: VersionSearchResults;
    sort: VersionsSort;
    onSort: (sort: VersionsSort) => void;
    onSelect: (version: SearchedVersion) => void;
    onDelete: (version: SearchedVersion) => void;
};

type VersionAction = {
    label: string;
    testId: string;
    onClick: () => void;
};

type VersionActionSeparator = {
    isSeparator: true;
};


export const VersionList: FunctionComponent<VersionListProps> = (props: VersionListProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();
    const appNav = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 25, sortable: true },
        { index: 1, id: "type", label: "Type", width: 25, sortable: false },
        { index: 2, id: "createdOn", label: "Created", width: 25, sortable: true },
        { index: 3, id: "modifiedOn", label: "Modified", width: 25, sortable: true },
    ];


    const renderColumnData = (column: SearchedVersion, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <NavLink className="version-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        to={appNav.createLink(`/apis/${props.apiId}/versions/${column.version}`)}>
                        {column.version as string}
                    </NavLink>
                    <ApiDescription className="version-description" style={{ overflow: "hidden", textOverflow: "hidden", whiteSpace: "nowrap", fontSize: "14px" }}
                        description={column.description}
                        truncate={true} />
                </div>
            );
        }
        // Type.
        if (colIndex === 1) {
            return (
                <span>{ column.contentType }</span>
            );
        }
        // Created on.
        if (colIndex === 2) {
            return (
                <FromNow date={column.createdOn} />
            );
        }
        // Modified on.
        if (colIndex === 3) {
            return (
                <FromNow date={column.modifiedOn} />
            );
        }
        return (
            <span />
        );
    };

    const actionsFor = (version: SearchedVersion): (VersionAction | VersionActionSeparator)[] => {
        return [
            { label: "View version details", testId: `view-version-${version.version}`, onClick: () => props.onSelect(version) },
            { isSeparator: true, },
            { label: "Delete version", testId: `delete-version-${version.version}`, onClick: () => props.onDelete(version) }
        ];
    };

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: props.sort.direction
            },
            onSort: (_event, index, direction) => {
                const byn: VersionSortBy[] = ["version", "version", "createdOn", "modifiedOn"];
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
        if (props.sort.by === "createdOn") {
            setSortByIndex(2);
        } else if (props.sort.by === "modifiedOn") {
            setSortByIndex(3);
        } else {
            setSortByIndex(0);
        }
    }, [props.sort]);

    return (
        <div className="version-list">
            <ResponsiveTable
                ariaLabel="list of versions"
                columns={columns}
                data={props.versions.versions}
                expectedLength={props.versions.count}
                minimumColumnWidth={350}
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
                renderActions={({ row }) => (
                    <ObjectDropdown
                        items={actionsFor(row)}
                        isKebab={true}
                        label="Actions"
                        itemToString={item => item.label}
                        itemToTestId={item => item.testId}
                        itemIsDivider={item => item.isSeparator}
                        onSelect={item => item.onClick()}
                        testId={`version-actions-${row.version}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
