import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {map} from "rxjs/operators";
import { User } from '../models/user.model';
import { dev } from '../../environments/dev';
import {HttpClient} from "@angular/common/http";

import demoData from '../assets/demo-data.json';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${dev.apiBaseUrl}/users`;

  private users: User[] = demoData;

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return of(this.users).pipe(
      map(users => this.addUserReferenceToCars(users))
    );
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find(user => user.id === id);
    if (user) {
      return of(user);
    } else {
      return throwError(() => new Error(`User with id ${id} not found`));
    }
  }

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.baseUrl).pipe(
  //     map(users => this.addUserReferenceToCars(users))
  //   );
  // }
  //
  // getUserById(id : number): Observable<User> {
  //   return this.http.get<User>(this.baseUrl + '/' + id);
  // }

  private addUserReferenceToCars(users: User[]): User[] {
    const userMap = new Map<number, User>();

    // Iterate over users and add them to the map
    users.forEach(user => {
      userMap.set(user.id, user);
      user.cars.forEach(car => {
        car.user = user;
      });
    });

    return users;
  }

}
