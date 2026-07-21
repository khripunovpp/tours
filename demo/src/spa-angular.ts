/**
 * SPA demo on Angular 19 — standalone components + @angular/router with hash
 * location, zoneless. The tour crosses routes with no reload. Compiled by
 * @analogjs/vite-plugin-angular.
 */
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './angular/app.component';
import { routes } from './angular/routes';

void bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection(), provideRouter(routes, withHashLocation())],
});
