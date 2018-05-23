import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage, PerfilPage, ResumenPage } from "../pages.export";
import { StorageUsuarioProvider } from '../../providers/storage-usuario/storage-usuario';
import { UsuarioProvider } from '../../providers/usuario/UsuarioProvider';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  constructor(public navCtrl: NavController,
    private usuarioStorage: StorageUsuarioProvider,
    private usuarioProv: UsuarioProvider,
    private platform: Platform) {
  }

  public tabHome = HomePage;
  public tapResumen = ResumenPage;
  public tabPerfil = PerfilPage;


  salirAplicacion() {
    this.platform.exitApp();
  }

  quitarRegistroAplicacion(){
    this.usuarioProv.usuario = this.usuarioStorage.usuarioAutenticado;
    this.usuarioProv.usuario.credenciales.estaLogeado = false; 
    this.usuarioProv.actualizarUsuario ().then(() => {
      this.usuarioStorage.salirAplicacion().then((result) => {
        this.platform.exitApp();
      })
    }); 
  }
}
