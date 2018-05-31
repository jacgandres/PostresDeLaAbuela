import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'validacionUrl',
})
export class ValidacionUrlPipe implements PipeTransform {

  
  transform(value: string ) { 
    if(value!= null && value.length>1)
      return value;

    return "./assets/imgs/nophoto.PNG";
  }
}
