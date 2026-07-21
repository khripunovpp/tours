import { Component } from '@angular/core';
import { playDemoTour } from '@tours/demo-shared';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section>
      <h1>Dashboard</h1>
      <p>An Angular SPA (&#64;angular/router, standalone components). The nav switches views without reloading.</p>
      <div class="card">
        <h2>Getting started</h2>
        <p><button id="spa-home-cta" class="btn-primary" (click)="start()">Start SPA tour</button></p>
      </div>
    </section>
  `,
})
export class HomeComponent {
  start(): void {
    void playDemoTour('demo-spa-angular');
  }
}
