import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderQuantite'
})
export class OrderQuantitePipe implements PipeTransform {

  transform(value: any): any {
    value = value.sort((a :any, b:any) => b.quantite - a.quantite);
    return value;
  }

}
