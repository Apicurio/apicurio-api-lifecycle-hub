export type SortDirection = "asc" | "desc";
export type SortBy = "apiId" | "name" | "createdOn" | "type";

export interface ApisSort {
    by: SortBy;
    direction: SortDirection;
}