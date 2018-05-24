import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { Usuario } from '../../Modelo/Modelo.Export';
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
    this.actualizarUsuario();
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
}
