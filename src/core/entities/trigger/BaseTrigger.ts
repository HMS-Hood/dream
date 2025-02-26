/* eslint-disable import/prefer-default-export */
import { ICalendar, IDateTrigger, TriggerFun } from '../../interfaces';

export abstract class BaseTrigger implements IDateTrigger {
  triggerFun: TriggerFun;

  constructor(triggerFun: TriggerFun) {
    this.triggerFun = triggerFun;
  }

  abstract trigger: TriggerFun;

  abstract triggerKey: string;
}
