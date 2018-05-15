import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'

import { HomePage } from '../pages/home/home';
import { StorageUsuarioProvider } from '../providers/storage-usuario/storage-usuario';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storageProv: StorageUsuarioProvider) {
    platform.ready().then(() => {

      storageProv.obtenerUsuario().then(result => {
        console.log("storageProv.obtenerUsuario: "+JSON.stringify(result));
        statusBar.styleDefault();
        splashScreen.hide();
        if (result) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }
      }); 

    });
  }
}

