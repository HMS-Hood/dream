/* eslint-disable import/prefer-default-export */
import { ICalendar } from '../../interfaces';
import { BaseTrigger } from './BaseTrigger';

export class MonthTrigger extends BaseTrigger {
  triggerKey: string = 'MONTH-TRIGGER';

  trigger(calendar: ICalendar) {
    if (calendar.month !== this.initCalendar.month) {
      if (this.triggerFun) this.triggerFun(calendar);
      const { year, month, day } = calendar;
      this.initCalendar.reset(year, month, day);
    }
    return this;
  }
}
