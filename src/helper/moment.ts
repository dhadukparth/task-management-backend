import moment from 'moment';

class DateTimeUtils {
  private defaultTimezoneOffset: number;

  // REVIEW: Default timezone offset for IST (UTC+05:30)
  constructor(defaultTimezoneOffset: number = 5.5) {
    this.defaultTimezoneOffset = defaultTimezoneOffset * 60;
  }

  // REVIEW: Helper method to get timezone offset or use default
  private getTimezoneOffset(timezoneOffset?: number): number {
    return (timezoneOffset ?? this.defaultTimezoneOffset) * 60;
  }

  // TODO: 1. Get today's date and time with a dynamic format
  getToday(format: string = 'YYYY-MM-DD hh:mm:ss.ss'): string {
    return moment().utcOffset(this.defaultTimezoneOffset).format(format);
  }

  // TODO: 2. Get past or future dates dynamically
  getPastOrPreview(type: 'past' | 'preview', days: number, format: string): string {
    if (type === 'past') {
      return moment().utcOffset(this.defaultTimezoneOffset).subtract(days, 'days').format(format);
    } else if (type === 'preview') {
      return moment().utcOffset(this.defaultTimezoneOffset).add(days, 'days').format(format);
    }
    return '';
  }

  // TODO: 3. Convert a date to UTC or formatted DateTime with timezone
  // NOTE: date only accept YYYY/MM/DD formats
  convertToUTC(date: string | number | Date, format: 'UTC' | 'DateTime'): any {
    if (format === 'UTC') {
      return moment(date).utc().valueOf();
    } else if (format === 'DateTime') {
      return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  // TODO: 4 Function to get the current UTC time in a specific format
  getCurrentUTCTime(): number {
    return moment().utc().valueOf();
  }
}

export default new DateTimeUtils();
