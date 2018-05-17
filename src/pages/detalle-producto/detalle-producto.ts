import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Producto } from '../../Modelo/Modelo.Export';

 

@IonicPage()
@Component({
  selector: 'page-detalle-producto',
  templateUrl: 'detalle-producto.html',
})
export class DetalleProductoPage {
  public Producto:Producto
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleProductoPage');
  }

}
