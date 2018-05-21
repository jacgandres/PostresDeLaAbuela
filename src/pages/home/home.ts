import { Component, LOCALE_ID } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Producto, Pedido, Usuario } from "../../Modelo/Modelo.Export";

import { UsuarioProvider, StorageUsuarioProvider, ProductosProvider } from "../../providers/providers.export";

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { DetalleProductoPage } from '../detalle-producto/detalle-producto';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private Evento: any;
  public Productos: Producto[] = [];
  public Usuario: Usuario = {};
  public pedidos: Pedido[] = [];
  public detalleProductoPage = DetalleProductoPage;

  constructor(public navCtrl: NavController,
    private usuarioStorage: StorageUsuarioProvider,
    private usuarioProv: UsuarioProvider,
    private platform: Platform,
    private productoProv: ProductosProvider,
    private screenOrientation: ScreenOrientation) {

    this.iniciarHome();
    this.ObtenerProducto();

    console.log(this.screenOrientation.type);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }

  iniciarHome() {
    console.log("Iniciando iniciarHome");

    this.usuarioStorage.obtenerUsuario().then((result) => {
      this.Usuario = this.usuarioStorage.usuarioAutenticado;
      if (this.Usuario.pedidos == null) {
        this.pedidos = [];
      }
      else {
        this.pedidos = this.Usuario.pedidos;
        console.log("Pedidos: " + this.Usuario.pedidos.length);
      }
      console.log("iniciarHome obtenerUsuario: ");
    })

  }

  ObtenerProducto(): any {
    this.productoProv.obtenerProductos().then((result: Producto[]) => {
      console.log("Productos obtenidos: " + result.length);
      this.Productos = result;
      if (this.Evento) {
        this.Evento.complete();
      }
    })
  }

  actualizarProductos(event) {
    this.Evento = event;
    this.iniciarHome();
    this.ObtenerProducto();
  }
}
