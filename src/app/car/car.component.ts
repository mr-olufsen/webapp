import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CarService } from '../services/car.service';
import { Car } from "../models/car.model";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent implements OnInit {
  car!: Car;
  displayedColumns: string[] = ['id', 'make', 'model', 'numberplate'];

  constructor(private carService: CarService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    this.carService.getCarById(carId).subscribe(car => {
      this.car = car;
      console.log(car);
    });
  }
}
