import { ElementType } from "./ElementType";
import { Map } from "./Map";
import { DocumentData } from "@angular/fire/compat/firestore";

export class MapCollection {

    constructor(id: string, indexMap: Map[], parentId: string, parentType: ElementType) {
        id = id;
        indexMap = indexMap;
        parentType = parentType;
        parentType = parentType;
    }

    id: string | null;
    indexMap: Map[];
    parentId: string;
    parentType: ElementType;
}

export const mapConverter = {
    toFirestore(map: MapCollection): DocumentData {
        return {
            id: map.id,
            indexMap: map.indexMap,
            parentId: map.parentId,
            parentType: map.parentType
        };
    },
    fromFirestore(snapshot: any, options: any) : MapCollection {
        const data = snapshot.data(options)!;
        return new MapCollection(data['id'], data['indexMap'], data['parentId'], data['parentType']);
    }
};