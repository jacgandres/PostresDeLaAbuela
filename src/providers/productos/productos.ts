import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import * as firebase from 'firebase';
import "rxjs/add/operator/map";

import { Producto } from "../../Modelo/Modelo";

import { Injectable } from '@angular/core';


@Injectable()
export class ProductosProvider {

  constructor(private _afDB: AngularFireDatabase) {

  }

  obtenerProductos() {
    return new Promise((assert, reject) => {
      this._afDB.list('/Productos')
        .valueChanges()
        .subscribe(productos => {
          console.log("this._afDB.list('/Productos') ") 
          assert(productos);
        })
    });
  }
}
