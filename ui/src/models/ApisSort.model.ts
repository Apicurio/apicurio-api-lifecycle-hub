export type ApiSortDirection = "asc" | "desc";
export type ApiSortBy = "apiId" | "name" | "createdOn" | "type";

export interface ApisSort {
    by: ApiSortBy;
    direction: ApiSortDirection;
}