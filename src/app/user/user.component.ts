import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent  implements OnInit {
  user!: User;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
    });
  }
}
