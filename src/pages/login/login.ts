import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


import { Facebook } from '@ionic-native/facebook';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    private platform: Platform,
    private usuarioProv: UsuarioProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signInGoogle() {

  }

  signInWithFacebook() {

    if (this.platform.is('cordova')) {
      console.log("antes de entrar a la primera promesa")

      try {

        this.fb.login(['email', 'public_profile']).then(res => {
          console.log("entro a la primera promesa")
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          firebase.auth().signInWithCredential(facebookCredential)
            .then(user => {
              console.log("entro a la segunda promesa")

              this.usuarioProv.cargarUsuario(
                user.displayName,
                user.email,
                user.photoURL,
                user.uid,
                'facebook'
              );

              console.log(JSON.stringify(this.usuarioProv.usuario));
              this.navCtrl.setRoot(HomePage);


            }).catch(e => console.log('Error con el login' + JSON.stringify(e)));
        })

      } catch (error) {
        console.log(JSON.stringify(error));
      }
    } else {
      // escritorio
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {

          console.log(res);
          let user = res.user;

          this.usuarioProv.cargarUsuario(
            user.displayName,
            user.email,
            user.photoURL,
            user.uid,
            'facebook'
          );

          this.navCtrl.setRoot(HomePage);

        });
    }
  }
}
