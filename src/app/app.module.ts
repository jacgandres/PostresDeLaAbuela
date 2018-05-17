import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { HomePage, PerfilPage, ResumenPage, LoginPage, 
         TabsPage, DetalleProductoPage, RegistroUsuarioPage } from "../pages/pages.export";


//Pipes
import { ContenidoSeguroPipe } from "../pipes/pipes.module";

//Providers
import { ProductosProvider, UsuarioProvider, StorageUsuarioProvider } from "../providers/providers.export";

///plugin
import { ScreenOrientation } from '@ionic-native/screen-orientation';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';



export const firebaseConfig = {
  apiKey: "AIzaSyAYfcqRXUiO3-6AJUUJvozc8Mb2ttukdrY",
  authDomain: "postresdelaabula.firebaseapp.com",
  databaseURL: "https://postresdelaabula.firebaseio.com",
  rojectId: "postresdelaabula",
  storageBucket: "postresdelaabula.appspot.com",
  messagingSenderId: "266657007622"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage, PerfilPage, ResumenPage, LoginPage, 
    TabsPage, DetalleProductoPage, RegistroUsuarioPage,
    ///pipes
    ContenidoSeguroPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, PerfilPage, ResumenPage, LoginPage, 
    TabsPage, DetalleProductoPage, RegistroUsuarioPage
  ],
  providers: [
    StatusBar, ScreenOrientation,
    SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireDatabase, 
    Facebook,
    ProductosProvider, UsuarioProvider, StorageUsuarioProvider
  ]
})
export class AppModule { }
