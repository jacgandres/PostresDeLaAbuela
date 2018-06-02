import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { Usuario, Pedido } from '../../Modelo/Modelo.Export';
import { assert } from 'ionic-angular/util/util'; 


@Injectable()
export class StorageUsuarioProvider {

  public usuarioAutenticado: Usuario = {}

  constructor(private platform: Platform,
    private storage: Storage) {
    console.log('Hello StorageUsuarioProvider Provider');
  }

  salirAplicacion() {
    console.log("salirAplicacion ");
    if (this.platform.is('cordova')) {
      return this.storage.remove('usuario');
    }
    else {
      return new Promise((assert) => {
        localStorage.clear();
        assert();
      });
    }
  }

  guardarUsuario(usuario: Usuario) { 
    this.usuarioAutenticado = usuario;
    return this.actualizarUsuario();
  }

  actualizarUsuario() {
    return new Promise((assert) => {
       
      console.log("actualizarUsuario")
      if (this.platform.is('cordova')) {
        this.storage.remove('usuario');
        this.storage.set("usuario", this.usuarioAutenticado);
      } else {
        localStorage.removeItem("usuario");
        localStorage.setItem("usuario", JSON.stringify(this.usuarioAutenticado));
      }
      assert();
    });
  }

  obtenerUsuario(): Promise<any> {
    console.log("Inicio metodo obtenerUsuario")

    return new Promise((resolve, reject) => {

      if (this.platform.is('cordova')) {
          this.storage.get('usuario').then(val => {
            console.log("obtenerUsuario this.storage.get");
            if (val) {
              this.usuarioAutenticado = val;
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } else { 
          let json = localStorage.getItem("usuario");
          if (json) {
          this.usuarioAutenticado = JSON.parse(json);
            resolve(true);
          }
          else {
            this.usuarioAutenticado = {};
            resolve(false);
          }
      }
    })
  }

  
  GuardarCarritoCompras(pedido:Pedido):Promise<boolean> {
     return new Promise((resolve, reject)=>{ 
          let pedidosCarrito:Pedido[]=[];
          if(this.platform.is("cordova"))
          {
              this.storage.get('CarritoCompras').then(val  => {
                  if(val){
                      pedidosCarrito.push(...val);
                  }

                  pedidosCarrito.push(pedido);
                  this.storage.remove('CarritoCompras');
                  this.storage.set("CarritoCompras", pedidosCarrito);
                  resolve(true);
              });
          }
          else
          {
              let val = JSON.parse(localStorage.getItem("CarritoCompras"));
              if(val){
                  pedidosCarrito.push(...val);
              }

              pedidosCarrito.push(pedido);
              localStorage.removeItem("CarritoCompras");
              localStorage.setItem("CarritoCompras", JSON.stringify(pedidosCarrito));
              resolve(true);
          }

     });
  }

  
  ActualizarCarritoCompras(pedidos:Pedido[]):Promise<boolean> {
    return new Promise((resolve, reject)=>{ 
         
         let pedidosCarrito:Pedido[]=[];
         if(this.platform.is("cordova"))
         {
             this.storage.get('CarritoCompras').then(val  => {
                 
                 pedidosCarrito.push(...pedidos);
                 this.storage.remove('CarritoCompras');
                 this.storage.set("CarritoCompras", pedidosCarrito);
                 resolve(true);
             });
         }
         else
         {
             let val = JSON.parse(localStorage.getItem("CarritoCompras"));
              
             pedidosCarrito.push(...pedidos);
             localStorage.removeItem("CarritoCompras");
             localStorage.setItem("CarritoCompras", JSON.stringify(pedidosCarrito));
             resolve(true);
         }

    });
 }
  
  ObtenerProductosCarrito() {
    return new Promise((resolve,reject)=>{
      let pedidosCarrito:Pedido[]=[];
      if(this.platform.is("cordova"))
      {
          this.storage.get('CarritoCompras').then(val  => {
              if(val){
                  pedidosCarrito.push(...val);
              } 
              resolve(pedidosCarrito);
          });
      }
      else
      {
          let val = JSON.parse(localStorage.getItem("CarritoCompras"));
          if(val){
              pedidosCarrito.push(...val);
          }  
          resolve(pedidosCarrito);
      }
    })
  }
  
  LimpiarCarrito()  
  {
      if(this.platform.is("cordova"))
      {
          this.storage.remove('CarritoCompras'); 
      }
      else
      {
          localStorage.removeItem("CarritoCompras");
      }
  }
}
