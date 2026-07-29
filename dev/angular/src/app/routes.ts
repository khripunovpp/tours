import type { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' },
];
