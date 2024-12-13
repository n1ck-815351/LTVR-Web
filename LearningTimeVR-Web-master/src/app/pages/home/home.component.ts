import { Component } from '@angular/core';
import { UserService } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor( 
    public userService: UserService
  ) { }

}
