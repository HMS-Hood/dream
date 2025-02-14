/* eslint-disable import/prefer-default-export */
export class Calendar {
  public year: number = 101;

  public month: number = 1;

  public day: number = 1;

  constructor(year?: number, month?: number, day?: number) {
    if (year) {
      this.year = year;
    }
    if (month) {
      this.month = month;
    }
    if (day) {
      this.day = day;
    }
  }

  reset(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  nextDay() {
    this.nextSomeDate(1);
  }

  nextTenDay() {
    this.nextSomeDate(10);
  }

  nextMonth() {
    this.nextSomeDate(30 - this.day);
  }

  public nextSomeDate(some: number) {
    this.day += some;
    while (this.day > 30) {
      this.month += 1;
      if (this.month > 12) {
        this.year += 1;
        this.month = 1;
      }
      this.day -= 30;
    }
  }

  public getPassedTime(comparedCalendar: Calendar): number {
    return (
      (this.year - comparedCalendar.year) * 360 +
      (this.month - comparedCalendar.month) * 30 +
      (this.day - comparedCalendar.day)
    );
  }

  public equals(calendar: Calendar) {
    return (
      this.year === calendar.year &&
      this.month === calendar.month &&
      this.day === calendar.day
    );
  }

  getDate() {
    return `公元 ${this.year}年${this.month}月${this.day}日`;
  }
}
