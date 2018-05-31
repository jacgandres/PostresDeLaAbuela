import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


import { Facebook } from '@ionic-native/facebook'; 

import { HomePage, TabsPage, RegistroUsuarioPage } from '../pages.export';

import { UsuarioProvider, StorageUsuarioProvider, CommunUtilidadesProvider } from "../../providers/providers.export";
import { Credenciales } from '../../Modelo/Modelo.Export';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  TouchIdDisponible:boolean;

  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private fb: Facebook,
              private platform: Platform,
              private usuarioProv: UsuarioProvider,
              private navPar: NavParams,
              private funcionesComunes: CommunUtilidadesProvider,
              private usuarioStorage: StorageUsuarioProvider,
              private firebaseAnalytics: FirebaseAnalytics, 
              private alertCtrl: AlertController) {
        
     this.TouchIdDisponible=false; 

  }
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.firebaseAnalytics.setCurrentScreen("Detalle Producto");
  }

  IngresarPorUsuario() {
    let inputs: any[] =
      [{
        name: 'Email',
        placeholder: 'Email o Nombre de Usuario'
      }, {
        name: 'Clave',
        placeholder: 'Clave',
        type: 'password'
      }
      ];

    let botones: any[] =
      [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }, {
        text: 'Ingresar',
        handler: (data) => {
          this.funcionesComunes.presentarLoadingDefault();
           
          this.usuarioProv.obtenerUsuarioPorClave(data).then((result) => {

            if (result) {
              console.log("entro a la  promesa firebase");
              this.usuarioStorage.guardarUsuario(this.usuarioProv.usuario).then(()=>{ 
                  this.navCtrl.setRoot(TabsPage);
              });
            }
            else {
              this.funcionesComunes.MostrarMensaje('Usuario/Clave Erroneas',
                'Verifique la informacion, no se encontro ningun usuario con los datos ingresados.',
                [],
                [{
                  text: 'Aceptar',
                  role: 'cancel'
                }]);
            }
            this.funcionesComunes.LoadingView.dismiss();
          });
        }
      }
      ]


    this.funcionesComunes.MostrarMensaje('Bienvenido, registro en nuestra aplicación',
      'Por favor ingrese los siguientes datos',
      inputs,
      botones);

  }

  Registrarse() {
    let inputs: any[] =
      [{
        name: 'Email',
        placeholder: 'Email o Nombre de Usuario'
      }, {
        name: 'Clave',
        placeholder: 'Clave',
        type: 'password'
      }, {
        name: 'Telefono',
        placeholder: 'Número Telefónico',
        type: 'tel'
      }
      ];
    let buttons: any[] =
      [{
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
    this.funcionesComunes.MostrarMensaje(
      'Bienvenido, registro en nuestra aplicación',
      'Por favor ingrese los siguientes datos',
      inputs,
      buttons);

  }

  signInWithFacebook() {

    console.log("antes de entrar a la primera promesa")
    if (this.platform.is('cordova')) {
      try { 
        this.fb.login(['email', 'public_profile'/*,'user_friends'*/])
          .then(res => {
              console.log("entro a la primera promesa..........................................")
              console.log(JSON.stringify(res));
              this.funcionesComunes.MostrarMensaje("contactos facebook",JSON.stringify(res),[],[]);
              const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
              firebase.auth().signInWithCredential(facebookCredential)
                .then(user => {
                  console.log("entro a la segunda promesa................................................")
                  this.salvarCredencialEnFireBase(user, "facebook", "");
                }).catch(e => console.log('Error con el login' + JSON.stringify(e)));
            },(error1)=>{
               console.log("Error pidiendo credenciales en facebook....");
               console.log(JSON.stringify(error1));
            });
 
      } catch (error2) {
        console.log(JSON.stringify(error2));
      }
    } else {
      // escritorio

      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(userFace => {

          console.log("entro a la segunda promesa")
          console.log(JSON.stringify(userFace));
          let user = userFace.user;
          this.salvarCredencialEnFireBase(user, "facebook", "");
        });
    }
  }

  private salvarCredencialEnFireBase(user: any, provider: string, clave: string) {
    this.usuarioProv.cargarUsuario(clave,
      user.displayName,
      user.email,
      user.photoURL,
      user.uid,
      provider,
      true,
      user.phoneNumber);

    console.log("antes de entrar a la promesa firebase");
    let storage = this.usuarioStorage;
    this.usuarioProv.salvarCredencialEnFireBase().then(() => {
      console.log("entro a la  promesa firebase");
      storage.guardarUsuario(this.usuarioProv.usuario).then(() => { 
        this.navCtrl.setRoot(TabsPage);
      });
    });
  }
}
