import { Component } from '@angular/core';
import { AuthService } from 'app/services/firebase/auth.service';
import { UserService } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-invalid-user',
  templateUrl: './invalid-user.component.html',
  styleUrls: ['./invalid-user.component.scss']
})
export class InvalidUserComponent {
  constructor(public authService:AuthService){}
}
