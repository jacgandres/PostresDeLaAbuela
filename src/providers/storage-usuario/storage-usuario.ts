import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { Usuario } from '../../Modelo/Usuario';


@Injectable()
export class StorageUsuarioProvider {

  public usuarioAutenticado: Usuario = {}

  constructor(private platform: Platform,
    private storage: Storage) {
    console.log('Hello StorageUsuarioProvider Provider');
  }

  salirAplicacion() {
    console.log("salirAplicacion ");
    return this.storage.remove('usuario'); 
  }

  guardarUsuario(usuario: Usuario) {
    if (this.platform.is('cordova')) { 
      this.storage.set("usuario", usuario);
    } else {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
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
        localStorage.getItem("usuario");
      }
    })
  }
}
