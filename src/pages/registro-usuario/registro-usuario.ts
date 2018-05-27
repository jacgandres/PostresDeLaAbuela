import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';
import { Credenciales, Usuario } from '../../Modelo/Modelo.Export';
import { UsuarioProvider } from '../../providers/usuario/UsuarioProvider';
import { TabsPage } from '../tabs/tabs';
import { StorageUsuarioProvider } from '../../providers/providers.export';



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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private usuarioProv: UsuarioProvider,
    private funcionesComunes: CommunUtilidadesProvider,
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
}
