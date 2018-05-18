import {Component }from '@angular/core'; 
import {IonicPage, NavController, NavParams }from 'ionic-angular'; 

import {Producto }from '../../Modelo/Modelo.Export'; 

 

@IonicPage()
@Component( {
  selector:'page-detalle-producto', 
  templateUrl:'detalle-producto.html', 
})
export class DetalleProductoPage {
  public Producto:Producto={}
  constructor(public navCtrl:NavController, 
              public navParams:NavParams) {
  }

  ionViewDidLoad() {
    this.Producto = this.navParams.get("producto"); 
    console.log('ionViewDidLoad DetalleProductoPage'); 
    console.log(JSON.stringify(this.Producto)); 
  }

}
