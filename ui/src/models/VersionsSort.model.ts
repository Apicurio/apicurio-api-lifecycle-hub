export type VersionSortDirection = "asc" | "desc";
export type VersionSortBy = "version" | "createdOn" | "modifiedOn";

export interface VersionsSort {
    by: VersionSortBy;
    direction: VersionSortDirection;
}