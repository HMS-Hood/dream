/* eslint-disable import/prefer-default-export */
export class Calendar {
  private year: number = 101;

  private month: number = 1;

  private day: number = 1;

  nextDay() {
    this.nextSomeDate(1);
  }

  nextTenDaty() {
    this.nextSomeDate(10);
  }

  nextMonth() {
    this.nextSomeDate(30 - this.day);
  }

  private nextSomeDate(some: number) {
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

  getDate() {
    return `公元 ${this.year}年${this.month}月${this.day}日`;
  }
}
