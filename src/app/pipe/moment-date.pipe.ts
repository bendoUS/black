import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform {

  transform(value: string): string {
    return moment(value).locale('fr').format('dddd, D MMMM YYYY');
  }

  
}