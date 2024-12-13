import { Injectable } from '@angular/core';
import { FirestoreService } from '../firebase/firestore.service';
import { collection, getDocs, query, where } from "firebase/firestore";  
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MapCollection } from 'app/models/Interfaces/maps/MapCollection';
import { ElementType } from 'app/models/Interfaces/maps/ElementType';
import { Map } from 'app/models/Interfaces/maps/Map';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  DbCollection = 'Maps'
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  public collection: MapCollection | null;

  constructor(private fs: FirestoreService, private firestore: AngularFirestore) { }

  public getSortedList(collection: any[], indexMap: any) {

    if (indexMap && indexMap.length) {
      let ordererCollection: any[] = [];
      indexMap.forEach((element: any) => {
        collection.forEach((c, index, object) => {
          if (c.id == element.elementId) {
            ordererCollection.push(c);
            object.splice(index, 1)
          }
        });
      })

      if (collection.length) {
        // If items exist that aren't in the map, add them at the end of our collection.
        ordererCollection.push(...collection)
      }

      return ordererCollection;
    }
    return collection;
  }

  public async Create(indexMapArr: any[], childType: ElementType, parentId: string, parentType: ElementType) {
    if (this.collection?.id) {
      return this.Update(this.collection.id ?? '', indexMapArr, childType, parentId, parentType);
    }

    if (!parentId) {
      throw new Error('Map Service | Create - parentId cannot be null.');
    }

    this.collection = this.ConstructMap('', indexMapArr, childType, parentId, parentType)

    this.fs.firestore.collection(this.DbCollection).add(this.collection);

    return this.Read(parentId, parentType);
  }

  public async Read(parentId: string, elementType: ElementType) {
    const q = query(this.fsRef, where("parentId", "==", parentId), where("parentType", "==", elementType));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      this.collection = null;
    } else {
      querySnapshot.forEach((doc) => {
        this.collection = this.ConstructMap(doc.id ?? '', doc.data()['indexMap'], ElementType.None, doc.data()['parentId'],doc.data()['parentType'])
      });
    }
    return this.collection;
  }

  public async Update(id: string, indexMapArr: any[], childType: ElementType, parentId: string, parentType: ElementType) {
    if (!id) {
      throw new Error('Map Service | Update - id cannot be null.');
    }

    this.collection = this.ConstructMap(id, indexMapArr, childType, parentId, parentType)
    await this.fs.firestore.collection(this.DbCollection).doc(id).update(this.collection).then((value) => {
      this.Read(parentId, parentType);
    });
    // const fsUpdateRef = doc(this.firestore.firestore, this.DbCollection, id);

    // await updateDoc(fsUpdateRef, {
    //   indexMap: indexMapArr
    // });
    return this.collection;
  }

  private ConstructMap(id: string, indexMapArr: any[], childType: ElementType, parentId: string, 
    parentType: ElementType) {
      const eArr: Map[] = [];
      for(let i = 0; i < indexMapArr.length; i++ ) {
        let e: Map;
        if (childType == ElementType.None) {
          e = {
            elementId: indexMapArr[i].elementId,
            index: indexMapArr[i].index,
            elementType: indexMapArr[i].elementType
          }
        } else {
          e = {
            elementId: indexMapArr[i].id,
            index: i,
            elementType: childType
          }
        }
        eArr.push(e);
      };

      const ee: MapCollection = { 
        id: id,
        indexMap: eArr,
        parentId: parentId,
        parentType: parentType,
      } as MapCollection;
      return ee;
  }
}