import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.html',
  styleUrl: './fab-button.less',
  imports: [TuiButton],
})
export class FabButtonComponent {
  @Input() icon: string = '';
  @Output() fabClick = new EventEmitter<void>();
}
