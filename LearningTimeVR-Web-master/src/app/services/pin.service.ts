import { Injectable } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { Observable, map } from 'rxjs';
import { UserType } from './firebase/user.service';
import { GlobalService } from './globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class PinService {

  constructor(private fs: FirestoreService, private global:GlobalService
  ) { }


  // currently this code generator should have 39,070,080 possible codes. If more codes are needed, add 1 wildcard on the end
  public generateCode(): string {

    let code = '';
    const numbers = '0123456789';
    
    for(let i = 0; i < 4; i++){
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    
    // if code already exists, try again
    this.userExistsWithPin(code).subscribe(result => {
      if (result == true) {
        console.log("Code already exists in db, trying again");
        code = this.generateCode();
      }
    })


    console.log("Generated code:", code);
    return code;
  }

  public formatCode(code: string): string {
    return code;
    // return code.replace(/(.{4})(.{2})/, "$1-$2");
  }


  public userExistsWithPin(code: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.fs.firestore.collection("master").doc(this.global.outputCollection).collection("Users", ref => ref.where("baseUser.pin", "==", code))
        .snapshotChanges()
        .pipe(map(changes => changes.map(c => (
          { id: c.payload.doc.id }
        ))))
        .subscribe(data => {
          console.log(data);
          if (data.length > 0) { observer.next(true); observer.complete(); } 
          else { observer.next(false); observer.complete(); }
        });
    });
  }

}
