import { OneSignal } from '@ionic-native/onesignal';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class PushNotificationProvider {

  constructor(private oneSignal: OneSignal,
    private platform: Platform) {
    console.log('Hello PushNotificationProvider Provider');
  }

  iniciar_notificacion() {

    if (this.platform.is('cordova')) {
      console.log("iniciando configuracion OneSignal....................");
      this.oneSignal.startInit('11962c74-553f-4190-b187-ef7ef57a01d1', '266657007622');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        console.log("notificacion recibida");
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        console.log("notificacion abierta");
      });

      this.oneSignal.endInit();
    }
    else{
      console.log("OneSignal no funciona en chrome...................");
    }

  }

}
