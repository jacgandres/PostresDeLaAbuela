import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/operator/map';
import { URL_DATE } from '../../Modelo/Configuracion';


@Injectable()
export class ConfiguracionServiciosProvider {

  public timeStampActual: number;

  constructor(public _http: Http) {

  }

  obtenerFecha() {
    return new Promise((resolve, reject) => {
      console.log("obtenerFecha promesa"); 
      this._http.get(URL_DATE).map((resp: any) => resp.json())
        .subscribe((data: any) => {
          console.log("obtenerFecha subscribe");
          if (data) { 
            this.timeStampActual = data.zones[0].timestamp 
          }
          resolve();
        }, (error) => {
          this.timeStampActual = 0;
          console.log("Error en el servicio de fecha.")
          console.log(JSON.stringify(error))
        })

    });
  }

}
