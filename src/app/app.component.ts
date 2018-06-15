import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage, PerfilPage, ResumenPage, TabsPage, LoginPage } from "../pages/pages.export";

import { PushNotificationProvider, StorageUsuarioProvider } from '../providers/providers.export';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private storageProv: StorageUsuarioProvider,
              private firebaseAnalytics: FirebaseAnalytics,
              private _pushProvider: PushNotificationProvider) {

    platform.ready().then(() => {
      storageProv.obtenerUsuario().then(result => {
        
        console.log("storageProv.obtenerUsuario: " );
        statusBar.styleDefault();
        splashScreen.hide();
        let id = "Usuario No Autenticado";
        if (result) {
          
          this.firebaseAnalytics.logEvent("confirmo pedido al carrito de compras",
            { Usuario: this.storageProv.usuarioAutenticado.credenciales.uid });
          id = this.storageProv.usuarioAutenticado.credenciales.uid;
          this.rootPage = TabsPage;
        } else {
          this.rootPage = LoginPage;
        }
        this._pushProvider.iniciar_notificacion(id);
      });
    });
  }
}

