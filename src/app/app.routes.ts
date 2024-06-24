import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import {UserCarsComponent} from "./user-cars/user-cars.component";
import { CarListComponent } from './cars-list/car-list.component';
import { CarComponent } from './car/car.component';
import {UserComponent} from "./user/user.component";

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'cars', component: CarListComponent },
  { path: 'cars/:id', component: CarComponent },
  { path: 'users/:id/cars', component: UserCarsComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' }
];
