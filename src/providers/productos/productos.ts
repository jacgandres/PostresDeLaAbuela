import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import * as firebase from 'firebase';
import "rxjs/add/operator/map";

import { Producto } from "../../Modelo/Modelo.Export";

import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ProductosProvider {

  private suscripcionProductos:Subscription;

  constructor(private _afDB: AngularFireDatabase) {

  }

  obtenerProductos() {
    return new Promise((assert, reject) => {
      this.suscripcionProductos = 
          this._afDB.list('/Productos')
            .valueChanges()
            .subscribe(productos => {
                console.log("this._afDB.list('/Productos') ") 
                this.suscripcionProductos.unsubscribe();
                assert(productos);
            });
    });
  }
}
