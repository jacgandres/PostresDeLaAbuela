import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import {
  HomePage, PerfilPage, ResumenPage, LoginPage,
  TabsPage, DetalleProductoPage, RegistroUsuarioPage
} from "../pages/pages.export";


//Pipes
import { ContenidoSeguroPipe } from "../pipes/pipes.module";

//Providers
import {
  ProductosProvider, ConfiguracionServiciosProvider,
  UsuarioProvider, StorageUsuarioProvider, DeviceServiceProvider,
  CommunUtilidadesProvider, PushNotificationProvider
} from "../providers/providers.export";

///plugin
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImagePicker } from '@ionic-native/image-picker';
import { DatePicker } from '@ionic-native/date-picker';
import { Device } from '@ionic-native/device';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage'; 
import { OneSignal } from '@ionic-native/onesignal';  
import { AppVersion } from '@ionic-native/app-version';


import { HttpModule } from '@angular/http'; 
import { ValidacionUrlPipe } from '../pipes/validacion-url/validacion-url'; 

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
    ContenidoSeguroPipe,ValidacionUrlPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, 
    AngularFireAuthModule,
    //LoadingController,
    HttpModule
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
    //{ provide: LOCALE_ID, useValue: 'es' },
    AngularFireDatabase, DatePicker, Facebook, Camera,
    ProductosProvider, UsuarioProvider, StorageUsuarioProvider,
    ConfiguracionServiciosProvider,FirebaseAnalytics,OneSignal,
    CommunUtilidadesProvider, Device, AppVersion,
    PushNotificationProvider,  ImagePicker, 
    DeviceServiceProvider 
  ]
})
export class AppModule { }
