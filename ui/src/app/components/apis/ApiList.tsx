import { FunctionComponent, useEffect, useState } from "react";
import { ApiDescription, NavLink } from "@app/components";
import { ApiSearchResults, SearchedApi } from "@client/models";
import { ApiSortBy, ApisSort } from "@models/ApisSort.model.ts";
import { Truncate } from "@patternfly/react-core";
import { useAppNavigation } from "@hooks/useAppNavigation.ts";
import { ThProps } from "@patternfly/react-table";
import { ObjectDropdown, ResponsiveTable, FromNow } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type ApiListProps = {
    apis: ApiSearchResults;
    sort: ApisSort;
    onSort: (sort: ApisSort) => void;
    onSelect: (apiId: string) => void;
    onDelete: (apiId: string) => void;
};

type ApiAction = {
    label: string;
    testId: string;
    onClick: () => void;
};

type ApiActionSeparator = {
    isSeparator: true;
};


export const ApiList: FunctionComponent<ApiListProps> = (props: ApiListProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();
    const appNav = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 50, sortable: true },
        { index: 1, id: "type", label: "Type", width: 25, sortable: true },
        { index: 2, id: "createdOn", label: "Created", width: 25, sortable: true }
    ];


    const renderColumnData = (column: SearchedApi, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <NavLink className="api-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        to={appNav.createLink(`/apis/${column.apiId}`)}>
                        <Truncate content={column.name as string} tooltipPosition="top" />
                    </NavLink>
                    <ApiDescription className="api-description" style={{ overflow: "hidden", textOverflow: "hidden", whiteSpace: "nowrap", fontSize: "14px" }}
                        description={column.description}
                        truncate={true} />
                </div>
            );
        }
        // Type.
        if (colIndex === 1) {
            return (
                <span>{ column.type }</span>
                // <ArtifactTypeIcon type={column.type} isShowIcon={true} isShowLabel={true} />
            );
        }
        // Modified on.
        if (colIndex === 2) {
            return (
                <FromNow date={column.createdOn} />
            );
        }
        return (
            <span />
        );
    };

    const actionsFor = (api: SearchedApi): (ApiAction | ApiActionSeparator)[] => {
        return [
            { label: "View API details", testId: `view-api-${api.apiId}`, onClick: () => props.onSelect(api.apiId as string) },
            { isSeparator: true, },
            { label: "Delete api", testId: `delete-api-${api.apiId}`, onClick: () => props.onDelete(api.apiId as string) }
        ];
    };

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: props.sort.direction
            },
            onSort: (_event, index, direction) => {
                const byn: ApiSortBy[] = ["name", "type", "createdOn"];
                const sort: ApisSort = {
                    by: byn[index],
                    direction
                };
                props.onSort(sort);
            },
            columnIndex: column.index
        } : undefined;
    };

    useEffect(() => {
        setSortByIndex(props.sort.by === "name" ? 0 : 2);
    }, [props.sort]);

    return (
        <div className="api-list">
            <ResponsiveTable
                ariaLabel="list of apis"
                columns={columns}
                data={props.apis.apis}
                expectedLength={props.apis.count}
                minimumColumnWidth={350}
                renderHeader={({ column, Th }) => (
                    <Th sort={sortParams(column)}
                        className="api-list-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="api-list-cell" key={`cell-${colIndex}-${row.apiId}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as SearchedApi, colIndex) as any} />
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
                        testId={`api-actions-${row.apiId}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
