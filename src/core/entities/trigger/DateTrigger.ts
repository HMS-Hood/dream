/* eslint-disable import/prefer-default-export */
import { ICalendar, TriggerFun } from '../../interfaces';
import { BaseTrigger } from './BaseTrigger';

export class DateTrigger extends BaseTrigger {
  triggerKey: string = 'DATE-TRIGGER';

  triggerCalendar: ICalendar;

  constructor(
    triggerCalendar: ICalendar,
    initCalendar: ICalendar,
    triggerFun: TriggerFun
  ) {
    super(initCalendar, triggerFun);
    this.triggerCalendar = triggerCalendar;
  }

  trigger = (calendar: ICalendar) => {
    if (this.triggerCalendar.getPassedTime(calendar) <= 0) {
      if (this.triggerFun) this.triggerFun(calendar);
      return undefined;
    }
    return this;
  };
}
