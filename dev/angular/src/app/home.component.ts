import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sb-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Home</h2>
    <div class="row">
      <button id="compose" class="primary">New post</button>
      <!-- The target of the interactive step: the visitor clicks this and the
           router — not the tour — performs the navigation. -->
      <a id="to-settings" routerLink="/settings" class="btn">Go to settings →</a>
    </div>
  `,
})
export class HomeComponent {}
