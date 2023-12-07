import { FunctionComponent, useState } from "react";
import {
    Button,
    OnPerPageSelect,
    OnSetPage,
    Pagination,
    SearchInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { Paging } from "@models/Paging.model.ts";
import { VersionSearchResults } from "@client/models";


export type VersionsToolbarData = {
    filterValue: string;
    paging: Paging;
};


export type VersionsToolbarProps = {
    data: VersionsToolbarData;
    versions: VersionSearchResults | undefined;
    onCreate: () => void;
    onChange: (data: VersionsToolbarData) => void;
};

const cloneData = (data: VersionsToolbarData): VersionsToolbarData => {
    return {
        filterValue: data.filterValue,
        paging: {
            ...data.paging
        }
    };
};

export const VersionsToolbar: FunctionComponent<VersionsToolbarProps> = (props: VersionsToolbarProps) => {
    const [currentFilterValue, setCurrentFilterValue] = useState<string>(props.data.filterValue);

    const onSetPage: OnSetPage = (_event: any, newPage: number, perPage?: number): void => {
        const newData: VersionsToolbarData = cloneData(props.data);
        newData.paging.page = newPage;
        newData.paging.pageSize = perPage ? perPage : props.data.paging.pageSize;
        props.onChange(newData);
    };

    const onPerPageSelect: OnPerPageSelect = (_event: any, newPerPage: number): void => {
        const newData: VersionsToolbarData = cloneData(props.data);
        newData.paging.pageSize = newPerPage;
        props.onChange(newData);
    };

    const onFilterChange = (_: any, value: string): void => {
        setCurrentFilterValue(value);
    };

    const onSearch = (): void => {
        const newData: VersionsToolbarData = cloneData(props.data);
        newData.filterValue = currentFilterValue;
        props.onChange(newData);
    };

    const onClear = (): void => {
        setCurrentFilterValue("");
        const newData: VersionsToolbarData = cloneData(props.data);
        newData.filterValue = "";
        props.onChange(newData);
    };

    const totalCount = (): number => {
        return props.versions?.count || 0;
    };

    return (
        <Toolbar id="versions-toolbar" className="versions-toolbar" style={{ paddingLeft: "8px", paddingRight: "24px" }}>
            <ToolbarContent style={{ width: "100%" }}>
                <ToolbarItem variant="search-filter">
                    <SearchInput
                        aria-label="Filter versions"
                        data-testid="search-version-filter"
                        value={props.data.filterValue}
                        onChange={onFilterChange}
                        onSearch={onSearch}
                        onClear={onClear} />
                </ToolbarItem>
                <ToolbarItem>
                    <Button variant="primary" data-testid="btn-create-version" onClick={props.onCreate}>Create version</Button>
                </ToolbarItem>
                <ToolbarItem className="version-paging-item" align={{ default: "alignRight" }}>
                    <Pagination
                        style={{ padding: "0" }}
                        variant="bottom"
                        dropDirection="down"
                        isCompact={true}
                        itemCount={totalCount()}
                        perPage={props.data.paging.pageSize}
                        page={props.data.paging.page}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        widgetId="version-list-pagination"
                        className="version-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};
