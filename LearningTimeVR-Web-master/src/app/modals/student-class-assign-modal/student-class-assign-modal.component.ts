import { Component } from '@angular/core';
import { Enrollee } from 'app/models/Interfaces/userTypes/Enrollee';
import { AuthService } from 'app/services/firebase/auth.service';
import { UserService } from 'app/services/firebase/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-student-class-assign-modal',
  templateUrl: './student-class-assign-modal.component.html',
  styleUrls: ['./student-class-assign-modal.component.scss']
})
export class StudentClassAssignModalComponent {
  constructor(private userService: UserService, private auth: AuthService) { this.init(); }
  async init() {

    this.auth.authStatusListener().subscribe(async a => {
      if (a) {
        console.log(a);
        this.availableStudents = await this.userService.getDefinedUsersByUserType<Enrollee>([this.userService.user!.baseUser!.organizationId!], 0);
        console.log(this.availableStudents);

        this.userService.getDefinedUsersByUserType<Enrollee>([this.userService.user!.baseUser!.organizationId!], 0).then(a => {
          this.availableStudents = a;
        })

      }
    })

  }

  selectedClassId: string;

  availableStudents: any[];
  studentsInClass: any[];

  selectedAvailableStudents: string[] = [];
  selectedStudentsInClass: string[] = [];

  async addStudent() {
    // Access selectedAvailableStudents array to add students to the class
    console.log(this.selectedAvailableStudents);
    const _selectedAvailable: string[] = [];
    const users: any[] = [];

    // Take the left side array:
    // array of IDs for user objects
    // push the new class id to their classes list

    this.selectedAvailableStudents.forEach(async a => {
      const user = await this.userService.queryUserObjectByUid<Enrollee>(a);
      if (user) {
        if (!user?.classes) user!.classes = [];
        user?.classes.push(this.selectedClassId);
        users.push({ id: user.id, data: user });
      }
    });
    this.userService.updateUsers<Enrollee>(users);

    // const usersInClasses = await this.userService.getDefinedUsersInClasses<Student>(_selectedAvailable, 0);
  }

  removeStudent() {
    // Access selectedStudentsInClass array to remove students from the class
    console.log(this.selectedStudentsInClass);
    const users: any[] = [];
    this.selectedStudentsInClass.forEach(async a => {
      const user = await this.userService.queryUserObjectByUid<Enrollee>(a);
      if (user) {
        if (!user?.classes) user!.classes = [];
        else {
          user.classes = user.classes.filter(classId => classId !== this.selectedClassId);

          users.push({ id: user.id, data: user });
        }
      }
    });
    this.userService.updateUsers<Enrollee>(users);
  }


}
