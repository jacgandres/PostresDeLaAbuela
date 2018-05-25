import { OneSignal } from '@ionic-native/onesignal';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Injectable()
export class PushNotificationProvider {

  constructor(private oneSignal: OneSignal,
              private firebaseAnalytics: FirebaseAnalytics,
              private platform: Platform) {
    console.log('Hello PushNotificationProvider Provider');
  }

  iniciar_notificacion(usuarioId:string) {

    if (this.platform.is('cordova')) {
      console.log("iniciando configuracion OneSignal....................");
      this.oneSignal.startInit('11962c74-553f-4190-b187-ef7ef57a01d1', '266657007622');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        this.firebaseAnalytics.logEvent("notificacion recibida ",  {Usuario:usuarioId}); 
        console.log("notificacion recibida");
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        this.firebaseAnalytics.logEvent("notificacion abierta ",  {Usuario:usuarioId}); 
        console.log("notificacion abierta");
      });

      this.oneSignal.endInit();
    }
    else{
      console.log("OneSignal no funciona en chrome...................");
    }

  }

}
