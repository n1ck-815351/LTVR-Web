import { Component } from '@angular/core';
import { Organization } from 'app/models/Interfaces/Organization';
import { BaseUser } from 'app/models/Interfaces/userTypes/BaseUser';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UserService, UserType } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';

@Component({
  selector: 'app-admin-user-page',
  templateUrl: './admin-user-page.component.html',
  styleUrls: ['./admin-user-page.component.scss']
})
export class AdminUserPageComponent {
  currentView: string = 'list';
  userFilter: number = -1;
  searchText: string = '';
  org: Organization;

  constructor(public userService: UserService, public orgService: OrganizationService, private fs: FirestoreService, public global: GlobalService) {

    this.queryOrg(userService.user?.baseUser?.organizationId)?.subscribe(data => {
      this.org = { ...data.data() } as Organization;
      console.log(this.org);
    });


  }


  public queryOrg(id: string | undefined | null) {
    if (!id) return null;
    return this.fs.firestore.collection<Organization>(this.orgService.DbCollection).doc(id).get();
  }

  getFilteredList() {
    let filteredUsers = [] as UserType[];
    for (let i = 0; i < this.userService.usersInOrganization?.length; i++) {
      if (this.filter(this.userService.usersInOrganization[i]!))
        filteredUsers.push(this.userService.usersInOrganization[i]);
    }
    return filteredUsers;
  }

  filter(user: UserType) {
    let searchFound: boolean = false;


    if (this.searchText.length > 0) {
      searchFound = (
        (user.baseUser!.firstName!.toLowerCase().startsWith(this.searchText.toLowerCase())) ||
        (user.baseUser!.lastName!.toLowerCase().startsWith(this.searchText.toLowerCase())) ||
        (user.baseUser!.displayName!.toLowerCase().startsWith(this.searchText.toLowerCase()))
      );
    } else searchFound = true;

    if (this.userFilter == -1) return searchFound;
    if (this.userFilter == user.baseUser?.userType) return searchFound;
    return false;
  }

  editUser(user: UserType) {
    // Implement edit user functionality
  }

  deleteUser(user: UserType) {
    // Implement delete user functionality
  }
}
