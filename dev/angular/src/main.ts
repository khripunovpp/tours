/**
 * Angular sandbox — the SPA case, which is what a real host app looks like.
 *
 * Routed with the hash strategy so navigation is client-side: no reload, so the
 * location watcher inside mountTours is what has to notice, not a fresh page.
 */
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { TourBuilder } from '@tours/editor';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

// Mounts only with ?tours-edit=1. Kept out of the component so it is obvious
// this is a page-level concern, not part of the app's own lifecycle.
TourBuilder.fromUrl({
  // What this "host" can attach to a visitor. Without it the builder has
  // nothing to offer and the tag pickers stay empty — which is exactly what a
  // real host must supply, so the sandbox models it.
  tags: ['guest', 'authenticated', 'admin', 'firstVisit', 'hasPurchases', 'level:gold'],
});

void bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
  ],
});
