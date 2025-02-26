/* eslint-disable import/prefer-default-export */
import { ICalendar, TriggerFun } from '../../interfaces';
import { BaseTrigger } from './BaseTrigger';

export class MonthTrigger extends BaseTrigger {
  triggerKey: string = 'MONTH-TRIGGER';

  trigger = (calendar: ICalendar) => {
    this.triggerKey = '2';
  };
}
