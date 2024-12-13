import { ElementType } from "./ElementType";

export class Map {
    constructor(elementId: string, index: number, elementType: ElementType) {
        elementId = elementId;
        index = index;
        elementType = elementType;
    }
    elementId: string;
    index: number;          
    elementType: ElementType
}

export const mapConverter = {
    toFirestore: (map: Map) => {
        return {
            elementId: map.elementId,
            index: map.index,
            elementType: map.elementType
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new Map(data.elementId, data.index, data.elementType);
    }
};

