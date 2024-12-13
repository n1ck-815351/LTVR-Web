import { Component } from '@angular/core';
import { Organization } from 'app/models/Interfaces/Organization';
import { School } from 'app/models/Interfaces/School';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { SchoolService } from 'app/services/schoolService/school.service';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss']
})
export class OrganizationEditorComponent {
  constructor(private orgService:OrganizationService, private schoolService:SchoolService) { }
  
  orgTitle:string;
  orgDesc:string;
  schools: { name: string }[] = [];
  school:School;
  

  addSchool() {
    this.schools.push({ name: "" });
  }

  removeSchool(index: number) {
    try {
      this.schools.splice(index, 1);
    }
    catch (error) {
      console.error("error with remove school\n", error);
    }
  }

  updateSchoolName(index: number, event: any) {
    try {
      this.schools[index].name = event.target.value;
    }
    catch (error) {
      console.error("error with update school name\n", error);
    }
  }

  async pushOrgToDB() {
    try {
      let _schools: string[] = [];
      for (let i = 0; i < this.schools.length; i++) {
        _schools.push(this.schools[i].name);
      }

      let element: Organization = {
        title: this.orgTitle,
        description: this.orgDesc,
        schools: _schools

      } as Organization;

      let _org = await this.orgService.CreateElement(element);

      let _sids: string[] = [] as string[];

      for (let i = 0; i < this.schools.length; i++) {
        let e = { title: this.schools[i].name, description: "Default description", organizationId: _org.id };
        let r = await this.schoolService.CreateElement(e);
        _sids.push(r.id);
      }

      element.schools = _sids;

      this.schools = [];
      this.addSchool();
      this.orgTitle = "";
      this.orgDesc = "";
    }
    catch (error) {
      console.error("error with push org to db\n", error);
    }
  }



  validateOrgCreator() {
    try {
      if (this.orgTitle == "" || this.orgDesc == "") return true;
      for (let i = 0; i < this.schools.length; i++) {
        if (this.schools[i].name == "") return true;
      }
    }
    catch (error) {
      console.error("error with org validator\n", error);
    }
    return false;
  }
}
