import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';
import { Credenciales } from '../../Modelo/Credenciales';

 

@IonicPage()
@Component({
  selector: 'page-registro-usuario',
  templateUrl: 'registro-usuario.html',
})
export class RegistroUsuarioPage {

  public Nombre="";
  public Apellido="";
  public Telefono="";
  public Clave="";
  public VerificarClave="";
  public Correo="";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private funcionesComunes:CommunUtilidadesProvider) {
                
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RegistroUsuarioPage');
   
    let data = this.navParams.get('Data')
    console.log(JSON.stringify(data));

    var result1= this.funcionesComunes.Encriptar(data.Clave)
 
    console.log(JSON.stringify(result1.toString()));
    
    this.Clave = data.Clave;
    this.Correo = data.Email;
    this.Telefono = data.Telefono;
  }

  Registrarse(){
    if(this.Clave != this.VerificarClave)
    {
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
    if( this.Apellido.length<1 ||
        this.Nombre.length<1 ||
        this.Correo.length<1 || 
        this.Clave.length<1  )
    { 
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


  }

}
