import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {map} from "rxjs/operators";
import { User } from '../models/user.model';
import { dev } from '../../environments/dev';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${dev.apiBaseUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map(users => this.addUserReferenceToCars(users))
    );
  }

  getUserById(id : number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);

  }

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
