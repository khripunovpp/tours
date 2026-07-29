import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sb-settings',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Settings</h2>
    <div class="row">
      <button id="profile">Profile</button>
      <button id="danger">Danger zone</button>
      <a routerLink="/" class="btn">← Back home</a>
    </div>
  `,
})
export class SettingsComponent {}
