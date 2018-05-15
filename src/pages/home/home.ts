import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Credenciales } from '../../providers/usuario/usuario';
import { StorageUsuarioProvider } from '../../providers/storage-usuario/storage-usuario';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  UsuarioAutenticado: Credenciales={}

  constructor(public navCtrl: NavController,
    private usuarioStorage: StorageUsuarioProvider) {


  }

  ionViewDidLoad() {
    console.log("Iniciando ionViewDidLoad");

    this.usuarioStorage.obtenerUsuario().then((result) => {
      this.UsuarioAutenticado = this.usuarioStorage.UsuarioAutenticado;
      console.log("usuarioStorage.obtenerUsuario2: " + JSON.stringify(this.UsuarioAutenticado));
    })
  }
}
