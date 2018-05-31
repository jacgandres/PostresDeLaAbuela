import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { DeviceServiceProvider, StorageUsuarioProvider } from '../../providers/providers.export';
import { Dispositivo, Usuario} from '../../Modelo/Modelo.Export'; 
import { Credenciales } from '../../Modelo/Credenciales';
 

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public Dispositivo:Dispositivo;
  public UsuarioAutenticado:Usuario

  public nombre?:string; 
  public email?:string;  
  public imagen?:string;  
  public provider?:string;  
  public numeroTelefonico?:string; 
  public FechaRegistro?:number;

  constructor(private navCtrl: NavController, 
              private firebaseAnalytics: FirebaseAnalytics,
              private navParams: NavParams,
              private deviceProvider: DeviceServiceProvider,
              private usuarioStorage:StorageUsuarioProvider
  ) 
  {
              this.UsuarioAutenticado={};
              this.UsuarioAutenticado.credenciales={};
  }

  ionViewWillEnter() {
    
    this.firebaseAnalytics.setCurrentScreen("Resumen");  
    this.deviceProvider.obtenerInformacionDispositivo();
    this.Dispositivo = this.deviceProvider.Usuario.dispositivo;
    this.usuarioStorage.usuarioAutenticado.dispositivo = this.Dispositivo; 
    this.UsuarioAutenticado = this.usuarioStorage.usuarioAutenticado;

    this.nombre = this.UsuarioAutenticado.credenciales.nombre;
    this.numeroTelefonico = this.UsuarioAutenticado.credenciales.numeroTelefonico;
    this.email = this.UsuarioAutenticado.credenciales.email;
    this.provider = this.UsuarioAutenticado.credenciales.provider;
    this.numeroTelefonico = this.UsuarioAutenticado.credenciales.numeroTelefonico;
    this.FechaRegistro = this.UsuarioAutenticado.credenciales.FechaRegistro; 
    this.imagen = this.UsuarioAutenticado.credenciales.imagen;
  }

}
