import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiComboBox, TuiDataListWrapper, TuiFilterByInputPipe } from '@taiga-ui/kit';

@Component({
  selector: 'app-calendar-inputs',
  imports: [
    FormsModule,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiTextfield,
  ],
  templateUrl: './calendar-inputs.html',
  styleUrls: ['./calendar-inputs.less'],
})
export class CalendarInputs {
  selectedMonth = input.required<number>();
  selectedYear = input.required<number>();

  monthInput = signal<string>('');
  yearInput = signal<string>('');

  monthChange = output<number>();
  yearChange = output<number>();

  constructor() {
    effect(() => {
      this.monthInput.set(this.months[this.selectedMonth() - 1]);
    });
    effect(() => {
      this.yearInput.set(this.selectedYear().toString());
    });
  }

  readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  readonly years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return year.toString();
  });

  onMonthChange(value: string) {
    const monthIndex = this.months.findIndex(
      (month) => month.toLowerCase() === value.toLowerCase()
    );
    if (monthIndex !== -1) {
      this.monthChange.emit(monthIndex + 1);
    }
  }

  onYearChange(value: string) {
    const year = parseInt(value, 10);
    if (!isNaN(year)) {
      this.yearChange.emit(year);
    }
  }
}
