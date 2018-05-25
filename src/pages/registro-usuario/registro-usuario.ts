import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../../providers/commun-utilidades/commun-utilidades';

 

@IonicPage()
@Component({
  selector: 'page-registro-usuario',
  templateUrl: 'registro-usuario.html',
})
export class RegistroUsuarioPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private funcionesComunes:CommunUtilidadesProvider) {
                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroUsuarioPage');
    debugger;
    let data = this.navParams.get('Data')
    console.log(JSON.stringify(data));

    var result1= this.funcionesComunes.Encriptar(data.Clave)
 
    console.log(JSON.stringify(result1.toString()));
    var result2= this.funcionesComunes.Encriptar(result1.toString());
    console.log(JSON.stringify(result2.toString()));


  }

}
