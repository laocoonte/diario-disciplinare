import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { navRoutes } from '../../app.routes';
import { TuiTabs } from '@taiga-ui/kit';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, TuiTabs],
  templateUrl: './nav.html',
  styleUrl: './nav.less',
})
export class NavComponent {
  router = inject(Router);
  routes = navRoutes || [];
  activeItemIndex = signal(0);

  ngOnInit() {
    const currentIndex = this.routes.findIndex((route) =>
      this.router.url.startsWith(String(route.path))
    );
    this.activeItemIndex.set(currentIndex);
  }

  onTabChange(index: number) {
    this.router.navigate([this.routes[index].path]);
    this.activeItemIndex.set(index);
  }
}
