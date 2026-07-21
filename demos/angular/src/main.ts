/** SPA demo on Angular 19 — @angular/router (hash), zoneless. Isolated package. */
import '@tours/demo-shared/demo.css';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { seedDemoTour, spaDraft } from '@tours/demo-shared';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

void seedDemoTour(spaDraft('demo-spa-angular', 'Angular'));
void bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection(), provideRouter(routes, withHashLocation())],
});
