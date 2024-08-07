import { Icon, LaunchProps, List } from "@raycast/api";
import { useSQL } from "@raycast/utils";
import { useState } from "react";
import { HistoryEntryListItem } from "./list";
import { getHistoryQuery, historyDatabasePath } from "./sql";
import { HistoryEntry } from "./types";
import { VersionCheck } from "./version";

function SearchHistory(props: LaunchProps) {
  const [searchText, setSearchText] = useState(props.fallbackText ?? "");
  const escapedSearchText = searchText.replace(/"/g, '""');
  const { data, isLoading, permissionView } = useSQL<HistoryEntry>(
    historyDatabasePath,
    getHistoryQuery(escapedSearchText)
  );

  if (permissionView) {
    return permissionView;
  }

  return (
    <List
      searchBarPlaceholder="Search history"
      searchText={searchText}
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
    >
      <List.EmptyView icon={Icon.MagnifyingGlass} title="Nothing found ¯\_(ツ)_/¯" />
      {data?.map((entry) => (
        <HistoryEntryListItem key={entry.id} entry={entry} searchText={searchText} />
      ))}
    </List>
  );
}

export default function Command(props: LaunchProps) {
  return (
    <VersionCheck>
      <SearchHistory {...props} />
    </VersionCheck>
  );
}
