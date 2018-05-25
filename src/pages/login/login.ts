import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


import { Facebook } from '@ionic-native/facebook';

import { HomePage } from '../home/home';

import { TabsPage } from '../tabs/tabs';

import { UsuarioProvider, StorageUsuarioProvider } from "../../providers/providers.export";
import { RegistroUsuarioPage } from "../pages.export";



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
    private usuarioProv: UsuarioProvider,
    private navPar: NavParams,
    private usuarioStorage: StorageUsuarioProvider,
    private firebaseAnalytics: FirebaseAnalytics,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.firebaseAnalytics.setCurrentScreen("Detalle Producto");
  }

  IngresarPorUsuario() {
    let alert = this.alertCtrl.create({
      title: 'Bienvenido, registro en nuestra aplicación',
      message: 'Por favor ingrese los siguientes datos',
      inputs: [{
        name: 'Email',
        placeholder: 'Email',
        type: 'email'
      }, {
        name: 'Clave',
        placeholder: 'Clave',
        type: 'password'
      }
      ],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }, {
        text: 'Ingresar',
        handler: (data) => {
          this.usuarioProv.obtenerUsuarioPorClave(data).then((result) => { 
            if (result) {
              console.log("entro a la  promesa firebase");
              this.usuarioStorage.guardarUsuario(this.usuarioProv.usuario);
              this.navCtrl.setRoot(TabsPage);
            }
            else {
              let alert = this.alertCtrl.create({
                title: 'Usuario/Clave Erroneas',
                message: 'Verifique la informacion, no se encontro ningun usuario con los datos ingresados.',
                buttons: [{
                  text: 'Aceptar',
                  role: 'cancel'}]
              });
              alert.present();
            }
          });
        }
      }
      ]
    });
    alert.present();
  }

  Registrarse() {
    let alert = this.alertCtrl.create({
      title: 'Bienvenido, registro en nuestra aplicación',
      message: 'Por favor ingrese los siguientes datos',
      inputs: [{
        name: 'Email',
        placeholder: 'Email',
        type: 'email'
      }, {
        name: 'Clave',
        placeholder: 'Clave',
        type: 'password'
      }, {
        name: 'Número Telefónico',
        placeholder: 'Número Telefónico'
      }
      ],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }, {
        text: 'Registrarse',
        handler: (data) => {
          console.log(data);
          this.navCtrl.push(RegistroUsuarioPage, { Data: data })
        }
      }
      ]
    });
    alert.present();
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
                'facebook',
                true,
                user.phoneNumber);

              this.salvarCredencialEnFireBase();

            }).catch(e => console.log('Error con el login' + JSON.stringify(e)));
        })

      } catch (error) {
        console.log(JSON.stringify(error));
      }
    } else {
      // escritorio

      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(user => {

          console.log("entro a la segunda promesa")
          console.log(JSON.stringify(user));
          let credencial = user.user;
          this.usuarioProv.cargarUsuario(
            credencial.displayName,
            credencial.email,
            credencial.photoURL,
            credencial.uid,
            'facebook',
            true,
            credencial.phoneNumber);

          this.salvarCredencialEnFireBase();

        });
    }
  }

  private salvarCredencialEnFireBase() {
    console.log("antes de entrar a la promesa firebase");
    this.usuarioProv.salvarCredencialEnFireBase().then(() => {
      debugger;
      console.log("entro a la  promesa firebase");
      this.usuarioStorage.guardarUsuario(this.usuarioProv.usuario);
      this.navCtrl.setRoot(TabsPage);

    });
  }
}
