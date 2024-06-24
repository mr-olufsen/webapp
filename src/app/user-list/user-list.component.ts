import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  filterControl: FormControl = new FormControl('');

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.dataSource = new MatTableDataSource<User>();
  }

  @ViewChild(MatSort) sort!: MatSort;

  @Input() filter!: User;

  ngOnInit() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.dataSource.data = this.users;
      this.dataSource.sort = this.sort;
    });

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.name.toLowerCase().includes(filter) || data.id.toString() === filter;
    };

    // Get the initial filter value from the query parameters
    this.route.queryParams.subscribe(params => {
      const filterValue = params['find'] || '';
      this.filterControl.setValue(filterValue);
      this.applyFilter(filterValue);
    });

    // Subscribe to changes in the filter control
    this.filterControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.applyFilter(value);
    });
  }

  getInputValue(event: Event): string {
    const target = event.target as HTMLInputElement;
    return target ? target.value : '';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    // Update the URL with the new filter value
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { find: filterValue },
      queryParamsHandling: 'merge'
    });
  }

  navigateToUserDetail(user: User): void {
    this.router.navigate(['/users', user.id]);
  }
}
