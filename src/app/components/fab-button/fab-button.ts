import { Component, input, output } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.html',
  styleUrl: './fab-button.less',
  imports: [TuiButton],
})
export class FabButtonComponent {
  icon = input('');
  fabClick = output<void>();
}
