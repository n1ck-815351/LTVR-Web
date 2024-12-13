import { Injectable } from '@angular/core';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { BaseCreatorComponent } from 'app/modals/creators/base-creator/base-creator.component';
import { FirestoreService } from '../firebase/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'app/modals/confirmations/confirmation-modal/confirmation-modal.component';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { EditHelperService } from 'app/services/firebase/edit-helper.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { OrderByDirection, collection, endAt, getDocs, limit, orderBy, query, startAt, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { error } from 'jquery';
import { UserService, UserType } from 'app/services/firebase/user.service';
import { getAuth } from "firebase/auth";
import { EnrolleeService } from '../enrolleeService/enrollee.service';
import { firstValueFrom } from 'rxjs';
import { GlobalService } from '../globalService/global.service';
import { SortOptions } from 'app/models/Interfaces/SortOptions';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  
  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/Classes`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  confirmDialogEvent: any;
  public deleteHelper: DeleteHelperService;
  public editHelper: EditHelperService;

  public lsDisplayRecentClassrooms = 'DisplayRecentClassrooms';
  public lsUsersClassroomsOnly = 'DisplayMyClassroomsOnly';
  public lsMyOrgOnly = 'DisplayMyOrgOnly';
  public lsUserSortOrder = 'ClassUserSortOrder';

  private defaultSortOrder = { field: 'searchTerm', direction: 'asc'} as SortOptions;
  private defaultDisplayRecentClassrooms = true;
  private defaultOptionGetMyClassroomsOnly = false;
  private defaultOptionGetMyOrgOnly = false;

  public allowedSortOptions = [
    // { value: 'dateCreated|asc', text: 'Oldest'},
    // { value: 'dateCreated|desc', text: 'Newest'},
    { value: 'searchTerm|asc', text: 'Title Ascending' },
    { value: 'searchTerm|desc', text: 'Title Descending' },
  ]

  public selectedSortOptions: SortOptions;
  public selectedOptionMyClassroomsOnly: boolean = this.defaultOptionGetMyClassroomsOnly;
  public selectedOptionMyOrgOnly: boolean = this.defaultOptionGetMyOrgOnly;
  public selectedOptionDisplayRecentClassrooms: boolean = this.defaultDisplayRecentClassrooms;


  public collection: Classroom[];
  public limitRecentCollection: number = 8;
  public recentCollection: Classroom[] | null;
  public selected: Classroom;

  constructor(private fs: FirestoreService,
    private firestore: AngularFirestore,
    private global: GlobalService,
    private userService: UserService,
    private enrolleeService: EnrolleeService,
    private navigationService: NavigationService,
    public modalService: NgbModal) {

    this.selectedSortOptions = this.getSelectedSortOptions();
    this.selectedOptionMyClassroomsOnly = this.getOptionMyClassroomsOnly();
    this.selectedOptionMyOrgOnly = this.getOptionMyOrgOnly();
    this.load();
  }

  public async load() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.getClassroomsCollection(undefined, user.uid);
        this.getRecentlyVisitedClassrooms(user.uid);
      }
    })
  }

  // Set selected sort options for this service.
  // Sort options must string must be in 'Sort Field|Sort Direction' format.
  public setSelectedSortOptions(value: string): SortOptions {
    localStorage.setItem(this.lsUserSortOrder, value);
    return this.getSelectedSortOptions();
  }

  public getSelectedSortOptions(): SortOptions {
    const _ls = localStorage.getItem(this.lsUserSortOrder)
    if (_ls) {
      const sortOptions = _ls.split('|'); 
      const result = {
        field: sortOptions[0],
        direction: sortOptions[1]
      } as SortOptions;

      this.selectedSortOptions = result;
    } else {
      this.selectedSortOptions = this.defaultSortOrder;
    }

    return this.selectedSortOptions;
  }

  public setOptionMyClassroomsOnly(value: boolean): boolean {
    localStorage.setItem(this.lsUsersClassroomsOnly, value.toString());
    return this.getOptionMyClassroomsOnly();
  }

  public getOptionMyClassroomsOnly(): boolean {
    const _ls = localStorage.getItem(this.lsUsersClassroomsOnly)
    const result = _ls ? (_ls.toLowerCase() == 'true') : this.defaultOptionGetMyClassroomsOnly;
    this.selectedOptionMyClassroomsOnly = result;
    return this.selectedOptionMyClassroomsOnly;
  }

  public setOptionMyOrgOnly(value: boolean): boolean {
    localStorage.setItem(this.lsMyOrgOnly, value.toString());
    return this.getOptionMyOrgOnly();
  }

  public getOptionMyOrgOnly(): boolean {
    const _ls = localStorage.getItem(this.lsMyOrgOnly)
    const result = _ls ? (_ls.toLowerCase() == 'true') : this.defaultOptionGetMyOrgOnly;
    this.selectedOptionMyOrgOnly = result;
    return this.selectedOptionMyOrgOnly;
  }

  public setOptionDisplayRecentClassrooms(value: boolean): boolean {
    localStorage.setItem(this.lsDisplayRecentClassrooms, value.toString());
    return this.getOptionDisplayRecentClassrooms();
  }

  public getOptionDisplayRecentClassrooms(): boolean {
    const _ls = localStorage.getItem(this.lsDisplayRecentClassrooms)
    const result = _ls ? (_ls.toLowerCase() == 'true') : this.defaultDisplayRecentClassrooms;
    this.selectedOptionDisplayRecentClassrooms = result;
    return this.selectedOptionDisplayRecentClassrooms;
  }

  setSelectedClass(element: Classroom | null) {
    if (element && element.id) {
      this.global.selectedClass = element.id;
      //// localStorage.setItem(this.nav.lsSelectedClassId, element.id);
    } else this.global.selectedClass = "";
    ////localStorage.setItem(this.nav.lsSelectedClassId, "");
  }

  async getFromLocalStorage() {
    const id = this.global.selectedClass;
    if (id) {
      this.getClassById(id);
    }
  }

  ShowCreateDialog() {
    const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
    modalRef.componentInstance.nodeType = 0; // set nodeType to class
    modalRef.result.then(async (data: any) => {
      if (data && data.title) {
        await this.CreateClass(data);
      }
    })
  }

  ShowEditDialog(element: Classroom) {
    if (element) {
      const refEl = Object.assign({}, element);
      const modalRef = this.modalService.open(BaseCreatorComponent, { centered: true });
      modalRef.componentInstance.setData(element);
      modalRef.componentInstance.modalType = 'Update';
      modalRef.componentInstance.nodeType = 0; // set nodeType to class
      modalRef.result.then(
        (data: any) => {
          if (data && data.title) {
            let _c: Classroom = {
              id: data.id,
              ...data
            };
            this.updateClass(_c)
            // await this.editHelper.editClassById(data.id, data);
          } else element = refEl;
        }
      )
    }
  }

  async ShowDeleteDialog(element: Classroom) {
    if (element && element.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true, backdrop: false });
      modalRef.componentInstance.id = element.id;
      modalRef.componentInstance.title = element.title;
      modalRef.result.then(async (id: any) => {
        if (id) {
          await this.deleteHelper.deleteClass(element.id);
          this.load();
        }
      })
    }
  }

  private getSearchTerm(title: string) {
    if (!title) {
      return '';
    }
    // Remove all non alpha-numeric values except spaces.
    let searchTerm = title.replace(/[^\w\s]/gi, '');
    return searchTerm.toLowerCase();
  }

  async CreateClass(input: any, redirectOnCreate: boolean = true) {
    // let errors = [];
    // if (!input.title) {
    //   errors.push('Title was not present in input parameters.');
    // }

    // if (!input.description) {
    //   errors.push('Description was not present in input parameters.');
    // }

    // if (!this.userService.user) {
    //   errors.push('User was not set.');
    // }

    // if (!this.userService.user) {
    //   errors.push('User was not set.');
    // }

    // if (errors && errors.length > 0) {
    //   this.errorUtility.throw('CreateClass', errors);
    //   return;
    // }

    let c: Classroom = {
      title: input.title,
      searchTerm: this.getSearchTerm(input.title),
      description: input.description,
      createdBy: this.userService.user?.id,
      //schoolId: this.userService.school?.id,
      organizationId: input.organizationId ? input.organizationId : this.userService.organization?.id
    } as Classroom;
    const dateCreated = Date.now().toString();
    c.dateCreated = dateCreated;
    c.dateUpdated = dateCreated;

    await this.fs.firestore.collection(this.DbCollection).add(c).then(function (docRef) {
      c.id = docRef.id;
    });

    this.load();
    this.selected = c;
    this.global.selectedClass = this.selected.id;
    this.global.selectedSubject = '';
    this.global.selectedLesson = '';
    if (redirectOnCreate) {
      this.navigationService.redirectToClass();
    } 
    return this.selected;
  }

  public async deleteClass(id: string | null) {
    // if (!id) {
    //   console.log("Cannot delete class: id was null."); return;
    // }
    // await this.fs.firestore.collection(this.DbCollection).doc(id).delete();
  }

  async updateClass(_c: Classroom, updated: boolean = true, visited: boolean = false) {
    if (_c && _c.id) {
      if (updated) {
        _c.searchTerm = this.getSearchTerm(_c.title ?? ''),
          _c.dateUpdated = Date.now().toString();
        _c.lastUpdatedBy = this.userService.user!.id
      }
      if (visited) {
        _c.dateVisited = Date.now().toString();
      }
      try {
        await this.fs.firestore.collection(this.DbCollection).doc(_c.id).update(_c);
        this.userService.setRecentlyVisitedClass(this.userService.user?.baseUser?.uid ?? "", _c);
      } catch {
        this.userService.removeRecentlyVisitedClass(this.userService.user?.baseUser?.uid ?? "", _c);
      } finally {
        this.load();
      }
    }
  }

  private async getOrgIdByUserId(userId: string) {
    const orgs: any = await this.userService.getUsersOrganization(userId);
    if (!orgs) {
      return;
    }

    let sharedOrgs: string[] = [];
    for (let i = 0; i < orgs.length; i++) {
      sharedOrgs.push(orgs[i].baseUser.organizationId);
    }
    return sharedOrgs;
  }

  searchResultsMax: number = 10;
  public async getClassroomsCollection(searchTerm: string = '', userId: string = '') {

    this.getOptionMyClassroomsOnly();

    if (this.selectedOptionMyClassroomsOnly && this.userService.user?.id) {
      if (!userId) {
        throw error('Class.Service | No owner id is present.');
      }
    }

    const orgIds = await this.getOrgIdByUserId(userId);

    this.getOptionMyOrgOnly();

    if (!this.selectedOptionMyOrgOnly) {
      orgIds?.push(this.global.demoOrgId);
    }

    if (orgIds) {
      this.getSelectedSortOptions();
      const orderDirection: OrderByDirection = this.selectedSortOptions.direction as OrderByDirection;
      
      let q = query(this.fsRef,
        where('organizationId', 'in', orgIds),
        orderBy(this.selectedSortOptions.field, orderDirection),
      );
      
      this.getOptionMyClassroomsOnly();
      if (this.selectedOptionMyClassroomsOnly && this.userService.user?.id) {
        q = query(q, where('createdBy', '==', this.userService.user?.id));
      }

      if (searchTerm) {
        q = query(q, startAt(searchTerm), endAt(searchTerm + '\uf8ff'), limit(this.searchResultsMax));
      }

      const querySnapshot = (await getDocs(q));
      if (querySnapshot.empty) {
        this.collection = [];
      } else {
        this.collection = querySnapshot.docs.map(s => {
          const _class = JSON.parse(JSON.stringify(s.data())) as Classroom;
          _class.id = s.id;
          return _class;
        })
      }
    }
    return this.collection;
  }

  async getRecentlyVisitedClassrooms(userId: string) {
    const orgId = await this.getOrgIdByUserId(userId);
    this.enrolleeService.getStudentsByOrgId(orgId ?? []);

    const q = query(this.userService.fsRef,
      where('baseUser.organizationId', 'in', orgId),
      where('baseUser.uid', '==', userId),
    );

    const querySnapshot = (await getDocs(q));
    if (querySnapshot.empty) {
      this.recentCollection = null;
    } else {
      querySnapshot.docs.map(s => {
        const _user = { id: s.id, ...s.data() } as UserType;
        this.recentCollection = _user.baseUser?.recentlyVisitedClasses ?? null;
      })
    }
    return false;
  }

  async getClassById(id: string) {

    const docRef = this.fs.firestore.collection<Classroom>(this.DbCollection);
    let cDoc: Classroom | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: Classroom = doc.data() as Classroom;
      if (_class) {
        _class.id = doc.id;
        cDoc = _class;
      }
    });
    if (cDoc) {
      this.selected = cDoc;
    }
    else {
      this.setSelectedClass(null);
    }
    return this.selected;
  }

  async getClassListFromArrayOfIDs(classrooms: string[]) {
    const collection = this.fs.firestore.collection<Classroom>(this.DbCollection);
    const docs = [];
    for (let i = 0; i < classrooms.length; i++) {
      const doc = collection.doc(classrooms[i]);
      const _d = await firstValueFrom(doc.get());
      docs.push(_d);
    }

    return docs;
  }
}  