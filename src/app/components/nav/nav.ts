import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { navRoutes } from '../../app.routes';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  routes = navRoutes || [];
}
