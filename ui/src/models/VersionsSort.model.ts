export type VersionSortDirection = "asc" | "desc";
export type VersionSortBy = "version" | "createdOn";

export interface VersionsSort {
    by: VersionSortBy;
    direction: VersionSortDirection;
}