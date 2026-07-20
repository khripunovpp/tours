/**
 * SPA demo on Angular (standalone component, zoneless, signals). Manual hash
 * routing; the tour crosses views with no reload. Compiled by
 * @analogjs/vite-plugin-angular.
 */
import { Component, signal, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { createPlayer, resumeTour } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, wireDemoPanel } from './common.js';

const spaTour: Tour = {
  id: 'demo-spa-angular',
  schemaVersion: 1,
  title: { default: 'SPA tour (Angular)' },
  steps: [
    {
      id: 'spa-1',
      pageUrl: { regex: '#/home' },
      selectors: ['#spa-home-cta'],
      content: { default: 'Welcome! Click Next — the tour jumps to your profile with no page reload.' },
      placement: 'bottom',
      action: { type: 'navigate', url: '#/profile' },
    },
    {
      id: 'spa-2',
      pageUrl: { regex: '#/profile' },
      selectors: ['#spa-profile-field'],
      content: { default: 'The tour continued here — Angular swapped the view, the tour followed.' },
      placement: 'right',
    },
  ],
};

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <header class="site-header">
      <a class="logo" href="index.html">Community</a>
      <nav class="site-nav">
        <a href="#/home" [class.active]="hash() === '#/home'">Home</a>
        <a href="#/profile" [class.active]="hash() === '#/profile'">Profile</a>
        <a href="spa.html">Vanilla</a>
      </nav>
    </header>
    <main>
      @if (hash() === '#/profile') {
        <section>
          <h1>Profile</h1>
          <div class="card">
            <div class="form-field">
              <label for="spa-profile-field">Display name</label>
              <input id="spa-profile-field" type="text" placeholder="Your name" />
            </div>
            <button class="btn-primary" type="button">Save</button>
          </div>
        </section>
      } @else {
        <section>
          <h1>Dashboard</h1>
          <p>An Angular SPA. The nav switches views without reloading.</p>
          <div class="card">
            <h2>Getting started</h2>
            <p><button id="spa-home-cta" class="btn-primary" (click)="start()">Start SPA tour</button></p>
          </div>
        </section>
      }
    </main>
  `,
})
class AppComponent {
  readonly hash = signal(window.location.hash || '#/home');

  constructor() {
    if (!window.location.hash) window.location.hash = '#/home';
    window.addEventListener('hashchange', () => this.hash.set(window.location.hash || '#/home'));
    queueMicrotask(() => {
      wireDemoPanel();
      resumeTour(spaTour, { state: playerState });
    });
  }

  start(): void {
    createPlayer(spaTour, { state: playerState }).start();
  }
}

void bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
