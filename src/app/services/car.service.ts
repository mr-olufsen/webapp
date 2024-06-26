import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {map} from "rxjs/operators";
import { User } from '../models/user.model';
import { dev } from '../../environments/dev';
import {HttpClient} from "@angular/common/http";
import {Car} from "../models/car.model";

import demoData from '../assets/demo-data.json';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private baseUrl = `${dev.apiBaseUrl}/cars`;

  private cars: Car[] = demoData.flatMap(user => user.cars);

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return of(this.cars);
  }

  getCarById(id: number): Observable<Car> {
    const car = this.cars.find(car => car.id === id);
    if (car) {
      return of(car);
    } else {
      return throwError(() => new Error(`Car with id ${id} not found`));
    }
  }

  // getCars(): Observable<Car[]> {
  //   return this.http.get<Car[]>(this.baseUrl);
  // }
  //
  // getCarById(id : number): Observable<Car> {
  //   return this.http.get<Car>(this.baseUrl + '/' + id);
  //
  // }

}
