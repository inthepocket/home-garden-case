import { Routes } from '@angular/router';
import { GardensComponent } from '../gardens/gardens.component';
import { PlantsComponent } from '../plants/plants.component';
import { UsersComponent } from '../users/users.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'gardens', component: GardensComponent },
  { path: 'plants', component: PlantsComponent },
  { path: '**', redirectTo: 'users' },
];
