import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";

export type DateRange = [Date, Date];

export const predefinedRanges: { label: string; value: DateRange }[] = (() => {
  const today = new Date();

  return [
    {
      label: "Today",
      value: [today, today],
    },
    {
      label: "Yesterday",
      value: [subDays(today, 1), subDays(today, 1)],
    },
    {
      label: "Last 7 Days",
      value: [subDays(today, 6), today],
    },
    {
      label: "Last 30 Days",
      value: [subDays(today, 29), today],
    },
    {
      label: "This Week",
      value: [
        startOfWeek(today, { weekStartsOn: 1 }),
        endOfWeek(today, { weekStartsOn: 1 }),
      ],
    },
    {
      label: "Last Week",
      value: [
        startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
        endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      ],
    },
    {
      label: "This Month",
      value: [startOfMonth(today), endOfMonth(today)],
    },
    {
      label: "Last Month",
      value: [
        startOfMonth(subMonths(today, 1)),
        endOfMonth(subMonths(today, 1)),
      ],
    },
  ];
})();
