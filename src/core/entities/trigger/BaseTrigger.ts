/* eslint-disable import/prefer-default-export */
import { ICalendar, IDateTrigger, TriggerFun } from '../../interfaces';

export abstract class BaseTrigger implements IDateTrigger {
  triggerFun: TriggerFun;

  initCalendar: ICalendar;

  constructor(calendar: ICalendar, triggerFun: TriggerFun) {
    this.triggerFun = triggerFun;
    this.initCalendar = calendar;
  }

  abstract trigger: (calendar: ICalendar) => IDateTrigger | undefined;

  abstract triggerKey: string;
}
