import { bindable } from 'aurelia-framework';
import { KEY_ESCAPE } from 'keycode-js'

// https://tailwindcomponents.com/component/datepicker-with-tailwindcss-and-alpinejs

export class CustomDatepicker {

  public MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  public isVisible: boolean = false;

  @bindable()
  public value: string = '';

  public month: number;

  public year: number;

  public no_of_days: number[] = [];

  public blankdays: number[] = [];

  public days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  public dateContainer: HTMLInputElement;

  public attached(): void {
    document.addEventListener('keydown', this.handleKeyInput, false);
    this.initDate();
    this.getNoOfDays();
  }

  public detached(): void {
    document.removeEventListener('keydown', this.handleKeyInput);
  }

  public handleKeyInput = (event: KeyboardEvent) => {
    if (event.keyCode == KEY_ESCAPE) {
      this.toggleVisibility('hide');
    }
    return true;
  }

  public initDate(): void {
    let today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.value = new Date(this.year, this.month, today.getDate()).toDateString();
  }

  public isToday(date: number): boolean {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  }

  public getDateValue(date: number): boolean {
    const selectedDate = new Date(this.year, this.month, date);
    this.value = selectedDate.toDateString();
    this.dateContainer.value = selectedDate.getFullYear() + "-" + ('0' + selectedDate.getMonth()).slice(-2) + "-" + ('0' + selectedDate.getDate()).slice(-2);
    console.log(this.dateContainer.value);
    this.isVisible = false;
    return true;
  }

  public getNoOfDays(): void {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    // find where to start calendar day of week
    const dayOfWeek = new Date(this.year, this.month).getDay();

    
    const blankdaysArray: number[] = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }
    const daysArray: number[] = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }

  public gotoMonth(direction: 'previous' | 'next'): void {
    this.month = (direction == 'previous'
      ? --this.month
      : ++this.month
    );
    this.getNoOfDays()
  }

  public toggleVisibility(visibility?: 'show' | 'hide'): void {
    switch (visibility) {
      case 'show':
        this.isVisible = true;
        break;
      case 'hide':
        this.isVisible = false;
        break;
      default:
        this.isVisible = !this.isVisible;
        break;
    }
  }
}
