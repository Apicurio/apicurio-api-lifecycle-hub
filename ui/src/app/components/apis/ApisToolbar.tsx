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
import { PagingModel } from "@models/Paging.model.ts";
import { ApiSearchResults } from "@client/models";


export type ApisToolbarData = {
    filterValue: string;
    paging: PagingModel;
};


export type ApisToolbarProps = {
    data: ApisToolbarData;
    apis: ApiSearchResults | undefined;
    onCreateApi: () => void;
    onChange: (data: ApisToolbarData) => void;
};

const cloneData = (data: ApisToolbarData): ApisToolbarData => {
    return {
        filterValue: data.filterValue,
        paging: {
            ...data.paging
        }
    };
};

export const ApisToolbar: FunctionComponent<ApisToolbarProps> = (props: ApisToolbarProps) => {
    const [currentFilterValue, setCurrentFilterValue] = useState<string>(props.data.filterValue);

    const onSetPage: OnSetPage = (_event: any, newPage: number, perPage?: number): void => {
        const newData: ApisToolbarData = cloneData(props.data);
        newData.paging.page = newPage;
        newData.paging.pageSize = perPage ? perPage : props.data.paging.pageSize;
        props.onChange(newData);
    };

    const onPerPageSelect: OnPerPageSelect = (_event: any, newPerPage: number): void => {
        const newData: ApisToolbarData = cloneData(props.data);
        newData.paging.pageSize = newPerPage;
        props.onChange(newData);
    };

    const onFilterChange = (_: any, value: string): void => {
        setCurrentFilterValue(value);
    };

    const onSearch = (): void => {
        const newData: ApisToolbarData = cloneData(props.data);
        newData.filterValue = currentFilterValue;
        props.onChange(newData);
    };

    const onClear = (): void => {
        setCurrentFilterValue("");
        const newData: ApisToolbarData = cloneData(props.data);
        newData.filterValue = "";
        props.onChange(newData);
    };

    const totalCount = (): number => {
        return props.apis?.count || 0;
    };

    return (
        <Toolbar id="apis-toolbar" className="apis-toolbar" style={{ paddingLeft: "8px", paddingRight: "24px" }}>
            <ToolbarContent style={{ width: "100%" }}>
                <ToolbarItem variant="search-filter">
                    <SearchInput
                        aria-label="Filter apis"
                        data-testid="search-api-filter"
                        value={props.data.filterValue}
                        onChange={onFilterChange}
                        onSearch={onSearch}
                        onClear={onClear} />
                </ToolbarItem>
                <ToolbarItem>
                    <Button variant="primary" data-testid="btn-create-api" onClick={props.onCreateApi}>Create API</Button>
                </ToolbarItem>
                <ToolbarItem className="api-paging-item" align={{ default: "alignRight" }}>
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
                        widgetId="api-list-pagination"
                        className="api-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};
