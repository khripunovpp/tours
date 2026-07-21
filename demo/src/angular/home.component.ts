import { Component } from '@angular/core';
import { createPlayer } from '@tours/core';
import { playerState, makeSpaTour } from '../common';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section>
      <h1>Dashboard</h1>
      <p>An Angular SPA (@angular/router, standalone components). The nav switches views without reloading.</p>
      <div class="card">
        <h2>Getting started</h2>
        <p><button id="spa-home-cta" class="btn-primary" (click)="start()">Start SPA tour</button></p>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly tour = makeSpaTour('demo-spa-angular', 'Angular');

  start(): void {
    createPlayer(this.tour, { state: playerState }).start();
  }
}
