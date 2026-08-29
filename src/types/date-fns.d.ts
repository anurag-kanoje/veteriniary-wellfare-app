// Type declarations for date-fns
declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: any): string;
  export function parseISO(dateString: string): Date;
  export function isAfter(date: Date | number, dateToCompare: Date | number): boolean;
  export function isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  export function isEqual(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameHour(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameMinute(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameMonth(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameSecond(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameYear(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isToday(date: Date | number): boolean;
  export function isTomorrow(date: Date | number): boolean;
  export function isYesterday(date: Date | number): boolean;
  export function isThisHour(date: Date | number): boolean;
  export function isThisMinute(date: Date | number): boolean;
  export function isThisMonth(date: Date | number): boolean;
  export function isThisQuarter(date: Date | number): boolean;
  export function isThisSecond(date: Date | number): boolean;
  export function isThisWeek(date: Date | number, options?: any): boolean;
  export function isThisYear(date: Date | number): boolean;
  
  export function addDays(date: Date | number, amount: number): Date;
  export function addHours(date: Date | number, amount: number): Date;
  export function addMilliseconds(date: Date | number, amount: number): Date;
  export function addMinutes(date: Date | number, amount: number): Date;
  export function addMonths(date: Date | number, amount: number): Date;
  export function addQuarters(date: Date | number, amount: number): Date;
  export function addSeconds(date: Date | number, amount: number): Date;
  export function addWeeks(date: Date | number, amount: number): Date;
  export function addYears(date: Date | number, amount: number): Date;
  
  export function subDays(date: Date | number, amount: number): Date;
  export function subHours(date: Date | number, amount: number): Date;
  export function subMilliseconds(date: Date | number, amount: number): Date;
  export function subMinutes(date: Date | number, amount: number): Date;
  export function subMonths(date: Date | number, amount: number): Date;
  export function subQuarters(date: Date | number, amount: number): Date;
  export function subSeconds(date: Date | number, amount: number): Date;
  export function subWeeks(date: Date | number, amount: number): Date;
  export function subYears(date: Date | number, amount: number): Date;
  
  export function getDate(date: Date | number): number;
  export function getDay(date: Date | number): number;
  export function getDayOfYear(date: Date | number): number;
  export function getDaysInMonth(date: Date | number): number;
  export function getDaysInYear(date: Date | number): number;
  export function getHours(date: Date | number): number;
  export function getISODay(date: Date | number): number;
  export function getISOWeek(date: Date | number): number;
  export function getISOWeeksInYear(date: Date | number): number;
  export function getISOWeekYear(date: Date | number): number;
  export function getMilliseconds(date: Date | number): number;
  export function getMinutes(date: Date | number): number;
  export function getMonth(date: Date | number): number;
  export function getQuarter(date: Date | number): number;
  export function getSeconds(date: Date | number): number;
  export function getTime(date: Date | number): number;
  export function getUnixTime(date: Date | number): number;
  export function getYear(date: Date | number): number;
  
  export function setDate(date: Date | number, day: number): Date;
  export function setDay(date: Date | number, day: number, options?: any): Date;
  export function setDayOfYear(date: Date | number, dayOfYear: number): Date;
  export function setHours(date: Date | number, hours: number): Date;
  export function setISODay(date: Date | number, day: number): Date;
  export function setISOWeek(date: Date | number, isoWeek: number): Date;
  export function setISOWeekYear(date: Date | number, isoWeekYear: number): Date;
  export function setMilliseconds(date: Date | number, milliseconds: number): Date;
  export function setMinutes(date: Date | number, minutes: number): Date;
  export function setMonth(date: Date | number, month: number): Date;
  export function setQuarter(date: Date | number, quarter: number): Date;
  export function setSeconds(date: Date | number, seconds: number): Date;
  export function setYear(date: Date | number, year: number): Date;
  
  export function startOfDay(date: Date | number): Date;
  export function startOfHour(date: Date | number): Date;
  export function startOfISOWeek(date: Date | number): Date;
  export function startOfISOWeekYear(date: Date | number): Date;
  export function startOfMinute(date: Date | number): Date;
  export function startOfMonth(date: Date | number): Date;
  export function startOfQuarter(date: Date | number): Date;
  export function startOfSecond(date: Date | number): Date;
  export function startOfToday(): Date;
  export function startOfTomorrow(): Date;
  export function startOfWeek(date: Date | number, options?: any): Date;
  export function startOfWeekYear(date: Date | number, options?: any): Date;
  export function startOfYear(date: Date | number): Date;
  export function startOfYesterday(): Date;
  
  export function endOfDay(date: Date | number): Date;
  export function endOfHour(date: Date | number): Date;
  export function endOfISOWeek(date: Date | number): Date;
  export function endOfISOWeekYear(date: Date | number): Date;
  export function endOfMinute(date: Date | number): Date;
  export function endOfMonth(date: Date | number): Date;
  export function endOfQuarter(date: Date | number): Date;
  export function endOfSecond(date: Date | number): Date;
  export function endOfToday(): Date;
  export function endOfTomorrow(): Date;
  export function endOfWeek(date: Date | number, options?: any): Date;
  export function endOfYear(date: Date | number): Date;
  export function endOfYesterday(): Date;
  
  export function differenceInMilliseconds(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInSeconds(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMinutes(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInHours(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInBusinessDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarISOWeeks(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarISOWeekYears(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarQuarters(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarWeeks(dateLeft: Date | number, dateRight: Date | number, options?: any): number;
  export function differenceInCalendarYears(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInHours(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInISOWeekYears(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMilliseconds(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMinutes(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInQuarters(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInSeconds(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInWeeks(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInYears(dateLeft: Date | number, dateRight: Date | number): number;
  
  export function eachDayOfInterval(interval: { start: Date | number; end: Date | number }): Date[];
  export function eachWeekOfInterval(interval: { start: Date | number; end: Date | number }, options?: any): Date[];
  export function eachWeekendOfInterval(interval: { start: Date | number; end: Date | number }): Date[];
  export function eachWeekendOfMonth(date: Date | number): Date[];
  export function eachWeekendOfYear(date: Date | number): Date[];
  export function eachWeekOfMonth(date: Date | number, options?: any): Date[];
  export function eachDayOfMonth(date: Date | number): Date[];
  
  export function formatDistance(date: Date | number, baseDate: Date | number, options?: any): string;
  export function formatDistanceToNow(date: Date | number, options?: any): string;
  export function formatDistanceStrict(date: Date | number, baseDate: Date | number, options?: any): string;
  export function formatRelative(date: Date | number, baseDate: Date | number, options?: any): string;
  
  export function parse(dateString: string, formatString: string, referenceDate: Date | number, options?: any): Date;
  export function parseISO(argument: string, options?: any): Date;
  export function parseJSON(argument: string | number | Date): Date;
  
  export function isValid(date: any): boolean;
  export function isDate(value: any): value is Date;
  export function isAfter(date: Date | number, dateToCompare: Date | number): boolean;
  export function isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  export function isEqual(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isFuture(date: Date | number): boolean;
  export function isPast(date: Date | number): boolean;
  export function isLeapYear(date: Date | number): boolean;
  
  export function lastDayOfWeek(date: Date | number, options?: any): Date;
  export function lastDayOfISOWeek(date: Date | number): Date;
  export function lastDayOfISOWeekYear(date: Date | number): Date;
  export function lastDayOfMonth(date: Date | number): Date;
  export function lastDayOfQuarter(date: Date | number): Date;
  export function lastDayOfYear(date: Date | number): Date;
  
  export function max(dates: (Date | number)[]): Date;
  export function min(dates: (Date | number)[]): Date;
  
  export function roundToNearestMinutes(date: Date | number, options?: any): Date;
  export function setMilliseconds(date: Date | number, milliseconds: number): Date;
  export function setSeconds(date: Date | number, seconds: number): Date;
  export function setMinutes(date: Date | number, minutes: number): Date;
  export function setHours(date: Date | number, hours: number): Date;
  export function setDate(date: Date | number, day: number): Date;
  export function setMonth(date: Date | number, month: number): Date;
  export function setQuarter(date: Date | number, quarter: number): Date;
  export function setYear(date: Date | number, year: number): Date;
  
  export function toDate(argument: Date | number | string): Date;
  
  export const daysInWeek: string[];
  export const daysInWeekShort: string[];
  export const months: string[];
  export const monthsShort: string[];
  
  export interface Locale {
    code?: string;
    formatDistance?: (...args: any[]) => any;
    formatRelative?: (...args: any[]) => any;
    localize?: {
      ordinalNumber: (n: number, options?: any) => string;
      era: (n: number) => string;
      quarter: (n: number) => string;
      month: (n: number) => string;
      day: (n: number) => string;
      dayPeriod: (n: number) => string;
    };
    formatLong?: any;
    match?: any;
    options?: {
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
    };
  }
}
