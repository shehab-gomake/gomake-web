import { parseISO, differenceInMinutes } from 'date-fns';

/**
 * Check if an SLA due date is approaching within the threshold
 * @param dueDate ISO date string
 * @param thresholdMinutes Number of minutes before due to consider "approaching" (default 60)
 * @returns true if the SLA is approaching but not yet breached
 */
export function isApproachingSLA(dueDate: string | undefined, thresholdMinutes = 60): boolean {
  if (!dueDate) return false;

  try {
    const due = parseISO(dueDate);
    const now = new Date();
    const minutesRemaining = differenceInMinutes(due, now);
    return minutesRemaining > 0 && minutesRemaining <= thresholdMinutes;
  } catch (error) {
    console.warn('Invalid SLA due date:', dueDate);
    return false;
  }
}

/**
 * Check if an SLA due date is overdue
 * @param dueDate ISO date string
 * @returns true if the SLA is past due
 */
export function isOverdueSLA(dueDate: string | undefined): boolean {
  if (!dueDate) return false;

  try {
    return parseISO(dueDate) < new Date();
  } catch (error) {
    console.warn('Invalid SLA due date:', dueDate);
    return false;
  }
}

/**
 * Get the SLA status based on breach state and due date
 * @param sla SLA object with breached flag and resolutionDue date
 * @returns 'breached' | 'approaching' | 'normal'
 */
export function getSLAStatus(sla: {
  breached: boolean;
  resolutionDue: string;
} | null | undefined): 'breached' | 'approaching' | 'normal' {
  if (!sla) return 'normal';

  if (sla.breached) return 'breached';
  if (isApproachingSLA(sla.resolutionDue)) return 'approaching';
  return 'normal';
}

/**
 * Get minutes remaining until SLA due date
 * @param dueDate ISO date string
 * @returns Minutes remaining (negative if overdue)
 */
export function getSLAMinutesRemaining(dueDate: string | undefined): number {
  if (!dueDate) return 0;

  try {
    const due = parseISO(dueDate);
    const now = new Date();
    return differenceInMinutes(due, now);
  } catch (error) {
    console.warn('Invalid SLA due date:', dueDate);
    return 0;
  }
}
