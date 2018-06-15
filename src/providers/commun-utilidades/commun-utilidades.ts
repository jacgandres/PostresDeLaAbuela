
import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';
 
import { AlertController, LoadingController, Loading } from 'ionic-angular';

import { Device } from '@ionic-native/device';

@Injectable()
export class CommunUtilidadesProvider {

  private fraseSecreta = CryptoJS.enc.Base64.parse("#base64Key#");
  private iv = CryptoJS.enc.Base64.parse("#base64IV#");
  public LoadingView:Loading;


  constructor(private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) { }

  public guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  public Encriptar(texto: string) {
    return CryptoJS.AES.encrypt(texto, this.fraseSecreta, { iv: this.iv });
  }

  public Desencriptar(textoEncriptado: string) {
    ///https://github.com/WeslleyDeSouza/SecureAngularLogin
    let decrypted = CryptoJS.AES.decrypt(textoEncriptado, this.fraseSecreta);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  public MostrarMensaje(titulo: string, mensaje: string, inputs: any[], botones: any[]) {
    let alert = this.alertCtrl.create({
        title: titulo,
        message: mensaje,
        inputs: inputs,
        buttons: botones
    });
    alert.present();
  } 
    
  public presentarLoadingDefault() {
    this.LoadingView = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="custom-spinner-container" color='blueMenu'>
                  <img src="./assets/imgs/lazyload.gif"></img>
                </div>`
    }); 

    this.LoadingView.present();
  }




  
}
