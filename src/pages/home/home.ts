import { Component } from '@angular/core';
import { NavController, Platform, Tabs } from 'ionic-angular';

import { Producto, Pedido, Usuario } from "../../Modelo/Modelo.Export";

import { UsuarioProvider, StorageUsuarioProvider, ProductosProvider, CommunUtilidadesProvider } from "../../providers/providers.export";

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { DetalleProductoPage } from '../detalle-producto/detalle-producto';
 
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

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
              private funcionesComunes:CommunUtilidadesProvider,
              private screenOrientation: ScreenOrientation,
              private firebaseAnalytics: FirebaseAnalytics,
              private tabs: Tabs) {

  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");


    this.iniciarHome();
    this.ObtenerProducto();

    if (this.platform.is('cordova')) {
      console.log(this.screenOrientation.type);
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad");
  }
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  }

  iniciarHome() {
    console.log("Iniciando iniciarHome");
    this.funcionesComunes.presentarLoadingDefault();
    this.usuarioStorage.obtenerUsuario().then((result) => {
      this.Usuario = this.usuarioStorage.usuarioAutenticado;
      this.usuarioProv.usuario = this.Usuario;
      
      this.firebaseAnalytics.setUserId(this.Usuario.credenciales.uid); 
      this.firebaseAnalytics.setCurrentScreen("home");

      /*this.usuarioProv.obtenerProductosActivos().then(() => {
        if (this.usuarioProv.pedidosActivos == null) {
          this.pedidos = [];
        }
        else {
          this.pedidos = this.usuarioProv.pedidosActivos;
          console.log("Pedidos: " + this.pedidos.length);
        }
        this.funcionesComunes.LoadingView.dismiss();
      })*/
      
      this.usuarioStorage.ObtenerProductosCarrito().then((result:Pedido[])=>{
          if (result != null && result.length > 0 ) {
            this.pedidos = result;
            console.log("Pedidos: " + this.pedidos.length);
          }
          else{
            this.pedidos=[];
          }
          
          this.funcionesComunes.LoadingView.dismiss();
      });

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

  IrResume() {
    this.tabs.select(1); 
  }
}
