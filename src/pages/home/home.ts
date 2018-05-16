import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StorageUsuarioProvider } from '../../providers/storage-usuario/storage-usuario';
import { LoginPage } from '../pages.export';
import { UsuarioProvider } from '../../providers/usuario/UsuarioProvider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public credencial: any = {}

  constructor(public navCtrl: NavController,
    private usuarioStorage: StorageUsuarioProvider,
    private usuarioProv: UsuarioProvider) {
    this.iniciarHome();
  }

  iniciarHome() {
    console.log("Iniciando iniciarHome");

    this.usuarioStorage.obtenerUsuario().then((result) => {
      this.credencial = this.usuarioStorage.usuarioAutenticado.credenciales;
      console.log("iniciarHome obtenerUsuario: " + JSON.stringify(this.credencial));
    })
  }



  salirAplicacion() {

    this.usuarioProv.usuario = this.usuarioStorage.usuarioAutenticado;
    this.usuarioProv.usuario.credenciales.estaLogeado = false;

    this.usuarioProv.deslogearUsuario().then(() => {
      this.usuarioStorage.salirAplicacion().then((result) => {
        this.navCtrl.setRoot(LoginPage);
      })
    })


  }
}
