/* eslint-disable import/prefer-default-export */
import { ICalendar, IDateTrigger } from '../../interfaces';

export class DateTrigger implements IDateTrigger {
  triggerKey: string = '1';

  trigger = (calendar: ICalendar) => {
    this.triggerKey = '2';
  };
}
