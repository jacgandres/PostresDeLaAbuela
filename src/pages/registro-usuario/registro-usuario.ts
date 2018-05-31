import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';
import { Credenciales, Usuario, BASE64Image } from '../../Modelo/Modelo.Export';
import { UsuarioProvider } from '../../providers/usuario/UsuarioProvider';
import { TabsPage } from '../tabs/tabs';
import { StorageUsuarioProvider } from '../../providers/providers.export';
import { Camera, CameraOptions } from '@ionic-native/camera';



@IonicPage()
@Component({
  selector: 'page-registro-usuario',
  templateUrl: 'registro-usuario.html',
})
export class RegistroUsuarioPage {

  public Nombre = "";
  public Apellido = "";
  public Telefono = "";
  public Clave = "";
  public VerificarClave = "";
  public Correo = "";
  public Imagen:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private usuarioProv: UsuarioProvider,
              private platform:Platform,
              private funcionesComunes: CommunUtilidadesProvider,
              private camera: Camera,
              private usuarioStorage: StorageUsuarioProvider) {

  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RegistroUsuarioPage');

    let data = this.navParams.get('Data')
    console.log(JSON.stringify(data));

    var result1 = this.funcionesComunes.Encriptar(data.Clave)

    console.log(JSON.stringify(result1.toString()));

    this.Clave = data.Clave;
    this.Correo = data.Email;
    this.Telefono = data.Telefono;
  }

  Registrarse() {

    if (this.Clave != this.VerificarClave) {
      this.funcionesComunes.MostrarMensaje(
        "Información",
        "Las claves no coinciden",
        [],
        [{
          text: 'Aceptar',
          role: 'cancel'
        }]
      );
      return;
    }
    if (this.Apellido.length < 1 ||
      this.Nombre.length < 1 ||
      this.Correo.length < 1 ||
      this.Clave.length < 1) {
      this.funcionesComunes.MostrarMensaje(
        "Información",
        "Todos los campos deben estar diligenciados",
        [],
        [{
          text: 'Aceptar',
          role: 'cancel'
        }]
      );
      return;
    }

    this.funcionesComunes.presentarLoadingDefault();
     
    let usuario: any = {};
    usuario.displayName = this.Nombre + " " + this.Apellido;
    usuario.email = this.Correo;
    usuario.photoURL = "";
    usuario.uid = this.funcionesComunes.guid();
    usuario.phoneNumber = this.getPhoneNumber();

     
    this.salvarCredencialEnFireBase(usuario, "Usuario/Clave", this.funcionesComunes.Encriptar(this.Clave).toString());

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
    this.usuarioProv.salvarCredencialEnFireBase().then(() => { 
      console.log("entro a la  promesa firebase");
      this.usuarioStorage.guardarUsuario(this.usuarioProv.usuario).then(() => {
        this.funcionesComunes.LoadingView.dismiss();
        this.navCtrl.setRoot(TabsPage);
      });
    });
  }


  getPhoneNumber(): any {
    if (this.Telefono.length > 0) { return this.Telefono; }
    else {
      return "12344321";
    }
  }

  AbrirCamara(){
        debugger;
    if(this.platform.is("cordova")){
        const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        console.log("Capturando foto..............................")
        
        this.camera.getPicture(options).then((imageData) => {
          console.log("foto Capturada..............................")
          this.Imagen =  'data:image/jpeg;base64,' + imageData;
          console.log(JSON.stringify(this.Imagen));
        }, (err) => {
          console.log("Error foto ---------------------")
          console.log(JSON.stringify(err));
          this.Imagen ="";
        });
    }
    else{
      this.Imagen =  'data:image/jpeg;base64,'+ BASE64Image;
    }
  }

  AbrirGaleria()
  {
    debugger;
    if(this.platform.is("cordova"))
    {
        const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        console.log("Capturando Galeria..............................")
        this.camera.getPicture(options).then((imageData) => { 
            console.log("Galeria Capturada..............................")
            this.Imagen =  'data:image/JPEG;base64,' + imageData;
            console.log(JSON.stringify(this.Imagen));
        }, (err) => {
          console.log("Error Galeria ---------------------")
          console.log(JSON.stringify(err));
          this.Imagen ="";
        });
    }
    else{
      this.Imagen =  'data:image/JPEG;base64,'+ BASE64Image;
    }
  }
}
