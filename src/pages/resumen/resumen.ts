import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

import { Usuario, Pedido, Producto } from "../../Modelo/Modelo.Export";
import { UsuarioProvider, StorageUsuarioProvider, CommunUtilidadesProvider } from '../../providers/providers.export';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics'; 
import { HomePage } from '../pages.export';
 


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
              private userStorage: StorageUsuarioProvider,
              private tabs: Tabs) {

  }

  ionViewWillEnter() {
    this.funcionesComunes.presentarLoadingDefault(); 
    this.IniciarPagina();
  }

  private IniciarPagina() {
    console.log("ionViewWillEnter pagina resumen");
    this.firebaseAnalytics.setCurrentScreen("Resumen");
    this.userStorage.ObtenerProductosCarrito().then((result:Pedido[]) => {
        this.usuarioAuthenticado = this.userStorage.usuarioAutenticado;
        this.firebaseAnalytics.logEvent("Usuario", { Usuario: this.usuarioAuthenticado });
        this.usuarioProv.usuario = this.usuarioAuthenticado; 
          this.pedidosActivos=result;
          this.calcularTotalPedidos().then((result: number) => {
              this.valorTotalPedidos = result;
              this.funcionesComunes.LoadingView.dismiss(); 
              if (this.Evento) {
                this.Evento.complete();
              }
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
    console.log("ionViewWillUnload Resumen"); 
  }

  actualizarResumen(evento)
  {
    this.Evento = evento;
    this.IniciarPagina();
  }

  QuitarProducto(pedido:Pedido ){

      this.funcionesComunes.MostrarMensaje("Quitar Producto!",
                                           "Esta seguro de quitar este producto?",[],
                                           [
                                             {
                                                text: 'Cancelar',
                                                role: 'cancel',
                                                handler: () => {
                                                  console.log('Cancel clicked');
                                                }
                                              }, 
                                              {
                                                text: 'Aceptar',
                                                handler: (data) => 
                                                { 
                                                    let tempPedidos= this.pedidosActivos.filter(ped => ped.id!=pedido.id);
                                                    this.pedidosActivos = tempPedidos;

                                                    this.userStorage.ActualizarCarritoCompras(this.pedidosActivos).then((result)=>
                                                    {
                                                      this.Evento = null;
                                                      this.IniciarPagina();
                                                    })
                                                }
                                            }
                                          ]) ;

  }

  ConfirmarPedidos(){ 
    this.funcionesComunes.MostrarMensaje("Confirmar Pedido!",
          "Esta apunto de confirmar el pedido, nos comunicaremos con usted.",[],
          [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                  console.log('Cancel clicked');
              }
            }, 
            {
              text: 'Aceptar',
              handler: (data) => 
              { 
                 
                 this.usuarioProv.adicionarPedidos(this.pedidosActivos).then((data)=>{
                    this.userStorage.LimpiarCarrito();
                    this.navCtrl.setPages([{
                      page: HomePage
                    }])
                 }).then(()=>{
                    
                    this.tabs.select(0); 
                 });
              }
          }
        ]);
  }
}
