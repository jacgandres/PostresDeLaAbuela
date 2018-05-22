import {AngularFireDatabase, snapshotChanges, AngularFireAction  }from 'angularfire2/database'; 
import * as firebase from 'firebase'; 
import "rxjs/add/operator/map"; 
 
import {Injectable }from '@angular/core'; 
import {Usuario, Pedido }from '../../Modelo/Modelo.Export'; 


@Injectable()
export class UsuarioProvider {

  public usuario:Usuario =  {}; 
  public pedidosActivos:Pedido[]; 
  

  constructor(private _afDB:AngularFireDatabase) {

  }
 
  cargarUsuario(nombre:string, 
                email:string, 
                imagen:string, 
                uid:string, 
                provider:string, 
                estaLogueado:boolean, 
                numeroTelefonico?:string) {

    console.log("cargarUsuario")
    this.usuario.credenciales =  {}; 

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

      this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid)
        .valueChanges()
        .subscribe(snapshot =>  {
       
          console.log("this._afDB.list " + this.usuario.credenciales.uid)
          console.log(JSON.stringify(snapshot)); 
          if ( ! snapshot) {
            console.log("Insertara nuevo registro " + this.usuario.credenciales.uid)
            this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).update(this.usuario); 
          }
          else{
            this.usuario = snapshot;
          }
          assert(true); 
        })
    }); 
  }

  adicionarPedidos(pedido:Pedido) {
    return new Promise((assert, reject) =>  {
      console.log("adicionarPedidos"); 
      this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/' + pedido.id)
        .update(pedido).then(() =>  {
          console.log("promesa adicionarPedidos"); 
          assert(); 
        })
    }); 
  }

  
  obtenerProductosActivos() {
    return new Promise((assert, reject) =>  {
      console.log("Entrando a promesa obtenerProductosActivos"); 
        this._afDB.list('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/')
            .valueChanges()
            .subscribe((pedidosResultado:Pedido[]) =>  {
              console.log("Promesa busqueda activos: " + pedidosResultado.length); 
              console.log(JSON.stringify(pedidosResultado)); 
              let filtroPedidos = pedidosResultado.filter(item => item.esConfirmado === false)
              this.pedidosActivos = filtroPedidos; 
              assert(); 
            }); 
    }); 
  }
}

