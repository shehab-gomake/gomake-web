import { AccountItem, NestedCheckboxGroup } from "./nested-checkbox";

export const transformAccountsToNestedGroups = (
  accounts: AccountItem[]
): NestedCheckboxGroup[] => {
  if (!accounts || accounts.length === 0) {
    return [];
  }

  // Group accounts by sortCode
  const groupsMap = new Map<string, AccountItem[]>();

  accounts.forEach((account) => {
    // Use sortCode if available, otherwise use a default group
    // If sortCode is not present, we'll group by first 2 characters of code as fallback
    const sortCode =
      account.sortCode || account.code?.substring(0, 2) || "OTHER";
    const sortName = account.sortName || "Other Accounts";

    if (!groupsMap.has(sortCode)) {
      groupsMap.set(sortCode, []);
    }
    groupsMap.get(sortCode)!.push(account);
  });

  // Convert map to array of NestedCheckboxGroup
  const groups: NestedCheckboxGroup[] = Array.from(groupsMap.entries()).map(
    ([sortCode, children]) => {
      // Get sortName from first child (they should all have the same sortName for same sortCode)
      const sortName = children[0]?.sortName || "Other Accounts";

      return {
        sortCode,
        sortName,
        children: children.sort((a, b) => {
          // Sort children by code
          return (a.code || "").localeCompare(b.code || "");
        }),
      };
    }
  );

  // Sort groups by sortCode
  return groups.sort((a, b) => a.sortCode.localeCompare(b.sortCode));
};
