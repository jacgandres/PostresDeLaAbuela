import { Component , LOCALE_ID} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Producto, Pedido } from "../../Modelo/Modelo.Export";

import { UsuarioProvider, StorageUsuarioProvider, ProductosProvider } from "../../providers/providers.export";

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { DetalleProductoPage } from '../detalle-producto/detalle-producto';
 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public Productos: Producto[] = [];
  public credencial: any = {}
  public pedidos: Pedido[] = [];
  public pedido: Pedido = {};
  public detalleProductoPage = DetalleProductoPage;

  constructor(public navCtrl: NavController,
              private usuarioStorage: StorageUsuarioProvider,
              private usuarioProv: UsuarioProvider,
              private platform: Platform,
              private productoProv: ProductosProvider,
              private screenOrientation: ScreenOrientation ) {
                
    this.iniciarHome();
    this.ObtenerProducto();

    console.log(this.screenOrientation.type);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  
  }

  iniciarHome() {
    console.log("Iniciando iniciarHome");
     
    this.usuarioStorage.obtenerUsuario().then((result) => {
      this.credencial = this.usuarioStorage.usuarioAutenticado.credenciales;
      console.log("iniciarHome obtenerUsuario: ");
    })
      
  }

  ObtenerProducto(): any {
    this.productoProv.obtenerProductos().then((result: Producto[]) => {
      console.log("Productos obtenidos: " + result.length);
      this.Productos = result;
    })
  }

}
