import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { DeviceServiceProvider, StorageUsuarioProvider } from '../../providers/providers.export';
import { Dispositivo, Usuario} from '../../Modelo/Modelo.Export'; 
 

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  Dispositivo:Dispositivo;
  UsuarioAutenticado:Usuario

  constructor(private navCtrl: NavController, 
              private firebaseAnalytics: FirebaseAnalytics,
              private navParams: NavParams,
              private deviceProvider: DeviceServiceProvider,
              private usuarioStorage:StorageUsuarioProvider
            ) {
  }

  ionViewWillEnter() {
    this.firebaseAnalytics.setCurrentScreen("Resumen"); 

    this.deviceProvider.obtenerInformacionDispositivo();
    this.Dispositivo = this.deviceProvider.Usuario.dispositivo;
    this.usuarioStorage.usuarioAutenticado.dispositivo = this.Dispositivo;
  }

}
