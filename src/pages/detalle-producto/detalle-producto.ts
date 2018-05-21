import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Producto, Pedido } from '../../Modelo/Modelo.Export';
import { DatePicker } from '@ionic-native/date-picker';
import { ConfiguracionServiciosProvider, StorageUsuarioProvider, UsuarioProvider } from "../../providers/providers.export";
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';
import { ResumenPage } from "../resumen/resumen";

@IonicPage()
@Component({
  selector: 'page-detalle-producto',
  templateUrl: 'detalle-producto.html',
})
export class DetalleProductoPage {

  public Producto: Producto = {}
  public Pedido: Pedido = {};
  public fechaActual = new Date();
  public Cantidad: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public configProv: ConfiguracionServiciosProvider,
    private datePicker: DatePicker,
    private utilidades: CommunUtilidadesProvider,
    private storage: StorageUsuarioProvider,
    private usuarioProv: UsuarioProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleProductoPage');
    this.Producto = this.navParams.get("producto");
    this.Pedido.fechaPedido = Date.now();

    this.configProv.obtenerFecha().then(() => {
      this.Pedido.fechaPedido = this.configProv.timeStampActual;
      if (this.Pedido.fechaPedido < Date.now()) {
        this.Pedido.fechaPedido = Date.now();
      }
      this.Pedido.fechaEntrega = this.Pedido.fechaPedido + (1000 * 60 * 60 * 24);
    })

  }

  abrirModalFecha() {

    this.datePicker.show({
      date: new Date(),
      minDate: new Date(),
      maxDate: new Date(this.Pedido.fechaPedido + (1000 * 30 * 60 * 60 * 24)),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then((result) => {
      this.Pedido.fechaEntrega = result.getTime();
    },
      (error) => {
        console.log("Error control date picker")
        console.log(JSON.stringify(error));
      });
  }

  ConfirmarPedido() {
    this.Pedido.estadoPedido = true;
    this.Pedido.producto = [];
    this.Pedido.valor = 0;
    if (this.Cantidad) {
      for (let index = 0; index < this.Cantidad; index++) {
        this.AgregarPedido();
      }
    }
    else {
      this.AgregarPedido();
    }
    this.Pedido.id = this.utilidades.guid();
    this.usuarioProv.usuario = this.storage.usuarioAutenticado;

    if (this.usuarioProv.usuario.pedidos == null) {
      this.usuarioProv.usuario.pedidos = [];
    }

    console.log("Push Usuarios")
    this.usuarioProv.usuario.pedidos.push(this.Pedido);

    this.usuarioProv.adicionarPedidos(this.Pedido)
      .then(() => {
        console.log("Agregar pedido a firebase")
        this.storage.usuarioAutenticado = this.usuarioProv.usuario;
        this.storage.actualizarUsuario();

        this.navCtrl.push(ResumenPage, { usuario: this.usuarioProv.usuario })
      })
  }

  AgregarPedido(): any {
    this.Pedido.producto.push(this.Producto);
    this.Pedido.valor += this.Producto.Valor;
  }

}
