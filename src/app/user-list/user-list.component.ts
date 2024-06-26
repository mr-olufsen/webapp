import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { SortingFilteringService } from '../services/sorting-filtering.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  filterControl: FormControl = new FormControl('');
  private ngUnsubscribe = new Subject<void>();
  private currentSort: string | null = null;
  private currentFilter: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private sortingFilteringService: SortingFilteringService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit() {
    this.loadData();
    this.initializeFilters();
  }

  ngAfterViewInit() {
    this.initializeTable();
  }

  loadData() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.dataSource.data = this.users;
    });
  }

  initializeFilters() {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      if (value !== this.currentFilter) {
        this.currentFilter = value;
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
    const queryParams: any = {};
    this.sortingFilteringService.applySort(sortState, queryParams);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    const queryParams: any = {};

    if (filterValue) {
      queryParams.filter = filterValue;
    }

    if (this.currentSort) {
      queryParams.sort = this.currentSort;
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

  navigateToUserDetail(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
