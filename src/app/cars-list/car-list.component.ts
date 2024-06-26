import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
export class CarListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'make', 'model', 'numberplate'];
  dataSource: MatTableDataSource<Car>;
  cars: Car[] = [];
  filterControl: FormControl = new FormControl('');
  private ngUnsubscribe = new Subject<void>();
  private currentSort: string | null = null;  // Added this line

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private carService: CarService,
              private sortingFilteringService: SortingFilteringService,
              private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<Car>();
  }

  ngOnInit() {
    this.loadData();
    this.initializeFilters();
  }

  ngAfterViewInit() {
    this.initializeTable();
  }

  loadData() {
    this.carService.getCars().subscribe((data: Car[]) => {
      this.cars = data;
      this.dataSource.data = this.cars;
    });
  }

  initializeFilters() {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      if (value !== this.sortingFilteringService.getCurrentFilter()) {
        this.applyFilter(value);
      }
    });

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const { filter, sort } = params;
      if (filter !== this.sortingFilteringService.getCurrentFilter()) {
        this.filterControl.setValue(filter || '', { emitEvent: false });
        this.applyFilter(filter || '');
      }

      if (sort !== this.sortingFilteringService.getCurrentSort()) {
        this.currentSort = sort;
        if (sort) {
          const [active, direction] = sort.split(':');
          if (this.sort) {
            this.sort.sort({ id: active, start: direction, disableClear: true });
            this.cdr.detectChanges();
          }
        } else {
          if (this.sort) {
            this.sort.sort({ id: '', start: '', disableClear: false });
          }
        }
      }
    });
  }

  initializeTable() {
    if (!this.sort) {
      console.error('MatSort is not initialized.');
      return;
    }

    this.dataSource.sort = this.sort;

    this.sort.sortChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe((sortState: Sort) => {
      this.applySort(sortState);
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
