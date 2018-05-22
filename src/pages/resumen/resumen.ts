import {Component }from '@angular/core'; 
import {IonicPage, NavController, NavParams }from 'ionic-angular'; 

import {Usuario, Pedido, Producto }from "../../Modelo/Modelo.Export"; 
import {UsuarioProvider }from '../../providers/providers.export'; 


@IonicPage()
@Component( {
  selector:'page-resumen', 
  templateUrl:'resumen.html', 
})
export class ResumenPage {

  public usuarioAuthenticado:Usuario =  {}; 
  public pedidosActivos:Pedido[] = []; 

  constructor(public navCtrl:NavController, 
              public navParams:NavParams, 
              private usuarioProv:UsuarioProvider ) {
      
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad pagina resumen");
    this.usuarioAuthenticado = this.navParams.get('usuario'); 
    this.usuarioProv.usuario = this.usuarioAuthenticado; 
    this.usuarioProv.obtenerProductosActivos()
         .then(() =>  {
               this.pedidosActivos = this.usuarioProv.pedidosActivos; 
               console.log("pedidosActivos: "+ this.pedidosActivos.length);
         },
        (error)=>{
          console.log("pedidosActivos Error");
        }); 
  }

  eliminarPedido() {

  }
}
