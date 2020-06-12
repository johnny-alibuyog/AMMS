import * as moment from 'moment';
import { Moment } from 'moment';

// chrome does not display the value in this format,
// chrome displays "03/10/2018",
// but internally the value is "2018-10-03".
// This is indeed confusing.
const domDateFormat = 'YYYY-MM-DD';

// https://discourse.aurelia.io/t/how-to-bind-dates-in-input-type-date/1692/3

export class DateValueConverter {
  toView(value: string | number | Date | Moment) {
    const momentValue = !moment.isMoment(value) ? moment(value) : value;
    // when feeding the DOM, there is no choice on format
    return momentValue.format(domDateFormat);
  }
  
  fromView(value: string | number | Date | Moment): Date {
    return moment(value, domDateFormat).toDate();
  }
}
// export class DateValueConverter {
//   toView(date: string | number | Date) {
//     debugger;

//     if (!(date instanceof Date)) {
//       date = new Date(date);
//     }

//     return date.toLocaleDateString();
//   }
// }

// export class TimeValueConverter {
//   toView(date: string | number | Date) {
//     if (!(date instanceof Date)) {
//       date = new Date(date);
//     }
//     return date.toLocaleTimeString();
//   }
// }

// export class DateTimeValueConverter {
//   toView(date: string | number | Date) {
//     if (!(date instanceof Date)) {
//       date = new Date(date);
//     }
//     return date.toLocaleString();
//   }
// }
