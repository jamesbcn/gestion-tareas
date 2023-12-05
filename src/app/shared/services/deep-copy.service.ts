import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeepCopyService {

  deepCopy = (obj: any) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (obj instanceof Array) {
      const copyArr = [];
      for (const item of obj) {
        copyArr.push(this.deepCopy(item));
      }
      return copyArr;
    }
  
    const copyObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copyObj[key] = this.deepCopy(obj[key]);
      }
    }
  
    return copyObj;
  }
}
