
export const HP_SIDEBAR_OFFSETS = {
  CLOSED: 60,
  OPEN: 240,
} as const;

export const getHpSidebarOffset = (isClosed: boolean): number => {
  return isClosed ? HP_SIDEBAR_OFFSETS.CLOSED : HP_SIDEBAR_OFFSETS.OPEN;
};
