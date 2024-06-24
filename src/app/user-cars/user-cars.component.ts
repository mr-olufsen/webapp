import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-cars.component.html',
  styleUrls: ['./user-cars.component.css']
})
export class UserCarsComponent implements OnInit {
  user!: User;
  displayedColumns: string[] = ['id', 'make', 'model', 'numberplate'];

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
    });
  }
}
