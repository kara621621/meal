/**
 * Date utility functions for Korea Standard Time (KST - Asia/Seoul)
 */

/**
 * Returns a Date object adjusted to Korea Standard Time (KST).
 * This ensures correct local date calculation irrespective of client system timezone.
 */
export function getTodayKST(): Date {
  const now = new Date();
  
  // Korean standard timezone is UTC+9
  const UTC_OFF = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  
  return new Date(UTC_OFF + KST_OFFSET);
}

/**
 * Transforms a Date to Korean display format: "M월 D일 요일"
 * E.g., "5월 15일 금요일"
 */
export function formatKoreanDate(date: Date): string {
  const months = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = getKoreanDayOfWeek(date);
  return `${months}월 ${day}일 ${dayOfWeek}`;
}

/**
 * Returns Korean representation of day of week: "월요일", "화요일", ..., "일요일"
 */
export function getKoreanDayOfWeek(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

/**
 * Converts a Date to YYYYMMDD style key
 * E.g., 2026-05-15 becomes "20260515"
 */
export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/**
 * Calculates Dates from Monday to Friday of the week containing the specified date.
 */
export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
  
  const dates: Date[] = [];
  
  // Calculate relative starting point (Monday of this week)
  let mondayOffset = 1 - currentDay;
  if (currentDay === 0) {
    // Sunday is grouped with the preceding week for standard view
    mondayOffset = -6;
  } else if (currentDay === 6) {
    // Saturday is grouped with the preceding week
    mondayOffset = -5;
  }
  
  // Generate Monday to Friday
  for (let i = 0; i < 5; i++) {
    const tempDate = new Date(date);
    tempDate.setDate(date.getDate() + mondayOffset + i);
    dates.push(tempDate);
  }
  
  return dates;
}

/**
 * Calculates month and week index for custom title "M월 N주차"
 * Follows Korean school week numbering convention based on day index.
 */
export function getWeekOfMonth(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = Math.ceil(day / 7);
  return `${month}월 ${week}주차`;
}

/**
 * Decides the active fallback date for the current selection.
 * If today is a weekday (Mon-Fri), returns today.
 * If it is Saturday or Sunday (Weekend), returns the following Monday.
 */
export function getDefaultSelectedDate(today: Date): Date {
  const dayOfWeek = today.getDay(); // 0: Sunday, 6: Saturday
  const fallbackDate = new Date(today);
  
  if (dayOfWeek === 6) {
    // Saturday -> Go to next Monday (add 2 days)
    fallbackDate.setDate(today.getDate() + 2);
    return fallbackDate;
  } else if (dayOfWeek === 0) {
    // Sunday -> Go to next Monday (add 1 day)
    fallbackDate.setDate(today.getDate() + 1);
    return fallbackDate;
  }
  
  return today;
}

/**
 * Checks if a given Date represents a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
