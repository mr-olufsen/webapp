import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Car } from "../models/car.model";
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../services/car.service';
import { FormControl } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cars',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'make', 'model', 'numberplate'];
  dataSource: MatTableDataSource<Car>;
  cars: Car[] = [];
  filterControl: FormControl = new FormControl('');
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private carService: CarService,
              private route: ActivatedRoute,
              private router: Router) {
    this.dataSource = new MatTableDataSource<Car>();
  }

  ngOnInit() {
    this.initializeTable();
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const { find } = params;
      this.filterControl.setValue(find || '');
      this.applyFilter(find || '');
    });
  }

  initializeTable() {
    // Fetch cars from service
    this.carService.getCars().subscribe((data: Car[]) => {
      this.cars = data;
      this.dataSource.data = this.cars;
    });

    // Set filter predicate
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.make.toLowerCase().includes(filter) || data.model.toLowerCase().includes(filter) || data.numberplate.toLowerCase().includes(filter);
    };

    // Subscribe to changes in the filter control with debounce
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      this.applyFilter(value);
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    // Update the URL with the new filter value or remove the parameter if the filter is empty
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filterValue ? { find: filterValue } : {},
      queryParamsHandling: filterValue ? 'merge' : ''
    });
  }

  applySort(sortState: Sort) {
    const sortField = sortState.active;
    const sortDirection = sortState.direction as 'asc' | 'desc';

    // Update the URL with the new sort value
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: `${sortField}:${sortDirection}` },
      queryParamsHandling: 'merge'
    });
  }

  navigateToCarDetail(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }
}
