import { Component, type OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { resumeTour } from '@tours/core';
import { playerState, wireDemoPanel, makeSpaTour } from '../common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <a class="logo" routerLink="/">Community</a>
      <nav class="site-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <a href="spa.html">Vanilla</a>
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    wireDemoPanel();
    // Continue if the page was reloaded mid-tour.
    resumeTour(makeSpaTour('demo-spa-angular', 'Angular'), { state: playerState });
  }
}
