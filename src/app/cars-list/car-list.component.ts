import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Car } from "../models/car.model";
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../services/car.service';
import { FormControl } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { SortingFilteringService } from '../services/sorting-filtering.service';

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
              private sortingFilteringService: SortingFilteringService,
              private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<Car>();
  }

  ngOnInit() {
    this.initializeTable();
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const { filter, sort } = params;
      if (filter !== this.sortingFilteringService.getCurrentFilter()) {
        this.filterControl.setValue(filter || '', { emitEvent: false });
        this.applyFilter(filter || '');
      }

      if (sort !== this.sortingFilteringService.getCurrentSort()) {
        this.sort.sort({ id: sort?.split(':')[0], start: sort?.split(':')[1], disableClear: true });
        this.cdr.detectChanges();
      }
    });

    this.sort.sortChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(sortState => {
      const queryParams: any = {};
      this.sortingFilteringService.applySort(sortState, queryParams);
    });
  }

  initializeTable() {
    this.carService.getCars().subscribe((data: Car[]) => {
      this.cars = data;
      this.dataSource.data = this.cars;
    });

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.make.toLowerCase().includes(filter) || data.model.toLowerCase().includes(filter) || data.numberplate.toLowerCase().includes(filter);
    };

    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      if (value !== this.sortingFilteringService.getCurrentFilter()) {
        this.applyFilter(value);
      }
    });
  }

  applySort(sortState: Sort) {
    const queryParams: any = {}; // Initialize queryParams
    this.sortingFilteringService.applySort(sortState, queryParams); // Delegate to service
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    const queryParams: any = {};

    if (filterValue) {
      queryParams.filter = filterValue;
    }

    if (this.sortingFilteringService.getCurrentSort()) {
      queryParams.sort = this.sortingFilteringService.getCurrentSort();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    }).then(() => {
      if (!filterValue) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { filter: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  navigateToCarDetail(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }
}
