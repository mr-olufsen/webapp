import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { dev } from '../../environments/dev';
import {HttpClient} from "@angular/common/http";
import {Car} from "../models/car.model";

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private baseUrl = `${dev.apiBaseUrl}/cars`;

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl);
  }

  getCarById(id : number): Observable<Car> {
    return this.http.get<Car>(this.baseUrl + '/' + id);
  }
}
