import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class SortingFilteringService {
  private currentSort: string | null = null;
  private currentFilter: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) { }

  getCurrentSort(): string | null {
    return this.currentSort;
  }

  getCurrentFilter(): string | null {
    return this.currentFilter;
  }

  applySort(sortState: Sort, queryParams: any) {
    const { active, direction } = sortState;

    if (active && direction) {
      this.currentSort = `${active}:${direction}`;
    } else {
      this.currentSort = null;
    }

    if (this.currentSort) {
      queryParams.sort = this.currentSort;
    } else {
      delete queryParams.sort;
    }

    this.updateRoute(queryParams);
  }


  applyFilter(filterValue: string, queryParams: any) {
    this.currentFilter = filterValue.trim().toLowerCase();

    if (this.currentFilter) {
      queryParams.filter = this.currentFilter;
    } else {
      delete queryParams.filter;
    }

    this.updateRoute(queryParams);
  }

  private updateRoute(queryParams: any) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    };

    this.router.navigate([], navigationExtras);
  }
}
