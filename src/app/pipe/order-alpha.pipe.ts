import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderAlpha'
})
export class OrderAlphaPipe implements PipeTransform {

  transform(value: any): any {

    value.sort(function(a:any, b:any){
      if(a.nomComplet < b.nomComplet) { return -1; }
      if(a.nomComplet > b.nomComplet) { return 1; }
      return 0;
  })

    return value;
  }

}
