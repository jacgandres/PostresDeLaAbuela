import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Usuario, Pedido, Producto } from "../../Modelo/Modelo.Export";
import { UsuarioProvider, StorageUsuarioProvider, CommunUtilidadesProvider } from '../../providers/providers.export';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics'; 
 


@IonicPage()
@Component({
  selector: 'page-resumen',
  templateUrl: 'resumen.html',
})
export class ResumenPage {
  public valorTotalPedidos = 0;
  public usuarioAuthenticado: Usuario = {};
  public pedidosActivos: Pedido[] = [];
  private Evento: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private funcionesComunes: CommunUtilidadesProvider,
              private usuarioProv: UsuarioProvider,
              private firebaseAnalytics: FirebaseAnalytics,
              private userStorage: StorageUsuarioProvider) {

  }

  ionViewWillEnter() {
    this.funcionesComunes.presentarLoadingDefault();
    this.IniciarPagina();
  }

  private IniciarPagina() {
    console.log("ionViewWillEnter pagina resumen");
    this.firebaseAnalytics.setCurrentScreen("Resumen");
    this.userStorage.obtenerUsuario().then(() => {
        this.usuarioAuthenticado = this.userStorage.usuarioAutenticado;
        this.firebaseAnalytics.logEvent("Usuario", { Usuario: this.usuarioAuthenticado });
        this.usuarioProv.usuario = this.usuarioAuthenticado;
        this.usuarioProv.obtenerProductosActivos()
          .then(() => {
              this.pedidosActivos = this.usuarioProv.pedidosActivos;
              console.log("pedidosActivos: " + this.pedidosActivos.length);
              this.calcularTotalPedidos().then((result: number) => {
                  this.valorTotalPedidos = result;
                  this.funcionesComunes.LoadingView.dismiss(); 
                  if (this.Evento) {
                    this.Evento.complete();
                  }
              });
          }, (error) => {
              console.log("pedidosActivos Error");
              this.funcionesComunes.LoadingView.dismiss();
          });
    });
  }

  calcularTotalPedidos(){
    return new Promise((assert, reject)=>{ 
      let valor=0;
      this.pedidosActivos.forEach(function (pedidoItem: Pedido )  {  
        valor += pedidoItem.valor;
      });
      assert(valor);
    });
  }

  
  ionViewWillUnload(){
    console.log("ionViewWillUnload Resumen")
  }

  actualizarResumen(evento)
  {
    this.Evento = evento;
    this.IniciarPagina();
  }
}
