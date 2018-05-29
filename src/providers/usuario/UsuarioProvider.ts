import {AngularFireDatabase, snapshotChanges, AngularFireAction }from 'angularfire2/database'; 
import * as firebase from 'firebase'; 
import "rxjs/add/operator/map"; 

import {Injectable }from '@angular/core'; 
import {Usuario, Pedido }from '../../Modelo/Modelo.Export'; 
import {CommunUtilidadesProvider }from '../commun-utilidades/commun-utilidades'; 
import {assert }from 'ionic-angular/util/util'; 
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class UsuarioProvider {

  public usuario:Usuario =  {}; 
  public pedidosActivos:Pedido[]; 
  private suscripcionUsuarios:Subscription;
  private suscripcionClave:Subscription;
  private suscripcionProductos:Subscription;


  constructor(private _afDB:AngularFireDatabase, 
    private funcionesComunes:CommunUtilidadesProvider) {

  }

  cargarUsuario(clave:string, 
    nombre:string, 
    email:string, 
    imagen:string, 
    uid:string, 
    provider:string, 
    estaLogueado:boolean, 
    numeroTelefonico?:string) {

    console.log("cargarUsuario")
    this.usuario.credenciales =  {}; 

    this.usuario.credenciales.clave = clave; 
    this.usuario.credenciales.nombre = nombre; 
    this.usuario.credenciales.email = email; 
    this.usuario.credenciales.imagen = imagen; 
    this.usuario.credenciales.uid = uid; 
    this.usuario.credenciales.provider = provider; 
    this.usuario.credenciales.estaLogeado = estaLogueado; 
    this.usuario.credenciales.numeroTelefonico = numeroTelefonico; 
  }

  salvarCredencialEnFireBase() {
    console.log("salvarCredencialEnFireBase")
    return this.verificarSiYaSeRegistro(); 
  }

  actualizarUsuario() {
    console.log("actualizarUsuario: " + this.usuario.credenciales.uid)
    return this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).update(this.usuario); 
  }

  verificarSiYaSeRegistro() {

    return new Promise((assert, reject) =>  {
      
      console.log("verificarSiYaSeRegistro")

      this.suscripcionUsuarios =
         this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid)
            .valueChanges()
            .subscribe(snapshot =>  { 
                console.log("this._afDB.list " + this.usuario.credenciales.uid)
                if ( ! snapshot) {
                  console.log("Insertara nuevo registro " + this.usuario.credenciales.uid)
                  this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).set(this.usuario); 
                }
                else {
                  this.usuario = snapshot; 
                }
                this.suscripcionUsuarios.unsubscribe();
                assert(true); 
            });
    }); 
  }

  adicionarPedidos(pedido:Pedido[]) {
    return new Promise((assert, reject) =>  {

      console.log("adicionarPedidos"); 
      this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/')
        .set(pedido).then(() =>  {
          console.log("promesa adicionarPedidos"); 
          assert(); 
        })
    }); 
  }

  obtenerUsuarioPorClave(data) {
    return new Promise((assert) =>  {
       
      console.log("Entrando a promesa obtenerProductosActivos"); 
      this.suscripcionClave =
          this._afDB.list('/Usuarios/')
            .valueChanges()
            .subscribe((Usuarios:Usuario[]) =>  { 
                console.log("Promesa busqueda usuarios: " + Usuarios.length); 
                let claveEncriptada = this.funcionesComunes.Encriptar(data.Clave).toString(); 
                let usuarioLogeado:any = 
                  Usuarios.filter(item => item.credenciales.clave == claveEncriptada && item.credenciales.email == data.Email); 
                
                this.suscripcionClave.unsubscribe();
                
                if (usuarioLogeado != null && usuarioLogeado[0]  && usuarioLogeado[0].credenciales) {
                  this.usuario = usuarioLogeado[0]; 
                  assert(true); 
                }
                else {
                  assert(false); 
                }
            }); 
    }); 
  }


  obtenerProductosActivos() {
    return new Promise((assert, reject) =>  { 
      console.log("Entrando a promesa obtenerProductosActivos"); 
      this.suscripcionProductos =
          this._afDB.list('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/')
            .valueChanges()
            .subscribe((pedidosResultado:Pedido[]) =>  { 
                console.log("Promesa busqueda activos: " + pedidosResultado.length); 
                let filtroPedidos = pedidosResultado.filter(item => item.esConfirmado === false)
                this.pedidosActivos = filtroPedidos; 
                this.suscripcionProductos.unsubscribe();
                assert(); 
            }); 
    }); 
  }
}

