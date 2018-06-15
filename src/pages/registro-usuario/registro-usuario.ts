import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';
import { Credenciales, Usuario, BASE64Image } from '../../Modelo/Modelo.Export';
import { UsuarioProvider } from '../../providers/usuario/UsuarioProvider';
import { TabsPage } from '../tabs/tabs';
import { StorageUsuarioProvider } from '../../providers/providers.export';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';



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
  public Imagen: string; 

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private usuarioProv: UsuarioProvider,
              private platform: Platform,
              private funcionesComunes: CommunUtilidadesProvider,
              private imagePicker: ImagePicker,
              private camera: Camera,
              private usuarioStorage: StorageUsuarioProvider) {

  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RegistroUsuarioPage'); 
    let data = this.navParams.get('Data') 
 
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
    usuario.email = this.Correo.toLowerCase().trim();
    usuario.photoURL = "";
    usuario.uid = this.funcionesComunes.guid();
    usuario.phoneNumber = this.getPhoneNumber();
 
    this.salvarCredencialEnFireBase(usuario, "Usuario/Clave", this.funcionesComunes.Encriptar(this.Clave.trim()).toString());
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
    this.usuarioProv.CrearUsuarioYContrasena().then((result:any)=>{ 
          this.usuarioProv.usuario.credenciales.ApiKey = result.G
          this.usuarioProv.usuario.credenciales.uid = result.uid; 
          this.usuarioProv.usuario.credenciales.AccessToken = result._lat;
          this.usuarioProv.usuario.credenciales.RefreshToken = result.refreshToken;
          this.usuarioProv.usuario.credenciales.FechaRegistro = Number.parseInt(result.metadata.b);
          this.usuarioProv.usuario.credenciales.imagen = this.Imagen;
          
          this.usuarioProv.LogInUsuarioContrasena().then((resolve) =>{  
              console.log("antes de entrar a la promesa firebase");
              
              this.usuarioProv.salvarCredencialEnFireBase().then(() => { 
                  console.log("entro a la  promesa firebase");
                  this.usuarioStorage.guardarUsuario(this.usuarioProv.usuario).then(() => { 
                        this.funcionesComunes.LoadingView.dismiss();
                        this.navCtrl.setRoot(TabsPage);
                  },(error1)=>{
                    console.log("error guardando en storage......");
                    this.funcionesComunes.LoadingView.dismiss();
                  });
              },(error2)=>{
                console.log("error salvar Credencial En FireBase......");
                this.funcionesComunes.LoadingView.dismiss();
              }); 
          },(error)=>{ 
              console.log(JSON.parse(error));
          });
    });
  }


  getPhoneNumber(): any {
    if (this.Telefono.length > 0) { return this.Telefono; }
    else { return "12344321"; }
  }

  AbrirCamara() {
    
    const options: CameraOptions = {
        quality: 75,
        correctOrientation:true,
        cameraDirection: this.camera.Direction.FRONT,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    this.EjecutarComponenteCamara(options);
  }

  private EjecutarComponenteCamara(options: CameraOptions) {
    if (this.platform.is("cordova")) {
      console.log("Capturando foto..............................");
      this.camera.getPicture(options).then((imageData) => {
        console.log("foto Capturada..............................");
        this.Imagen = imageData;
        console.log("Imagen tomada: " + this.Imagen.length);
      }, (err) => {
        console.log("Error foto ---------------------");
        console.log(JSON.stringify(err));
        this.Imagen = "";
      });
    }
    else {
      this.Imagen = BASE64Image;
    }
  }

  AbrirGaleria() {
    const options: CameraOptions = {
        quality: 75,
        correctOrientation:true, 
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY 
    }
    this.EjecutarComponenteCamara(options);
 
  }
}
