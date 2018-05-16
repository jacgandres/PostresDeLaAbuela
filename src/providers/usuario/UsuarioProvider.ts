import {AngularFireDatabase, snapshotChanges }from 'angularfire2/database'; 
import * as firebase from 'firebase'; 
import  "rxjs/add/operator/map"; 
import { Credenciales } from '../../Modelo/Credenciales';



import {Injectable }from '@angular/core'; 

import { Usuario} from '../../Modelo/Modelo';


@Injectable()
export class UsuarioProvider {

  usuario:Usuario =  {}; 

  constructor(private _afDB:AngularFireDatabase) {
 
  }


  cargarUsuario(nombre:string, 
                 email:string, 
                 imagen:string, 
                 uid:string, 
                 provider:string, 
                 estaLogueado:boolean ) {

    this.usuario.credenciales.nombre = nombre; 
    this.usuario.credenciales.email = email; 
    this.usuario.credenciales.imagen = imagen; 
    this.usuario.credenciales.uid = uid; 
    this.usuario.credenciales.provider = provider; 
    this.usuario.credenciales.estaLogeado = estaLogueado; 
  }

  salvarCredencialEnFireBase() {
    console.log("salvarCredencialEnFireBase")
    return this.verificarSiYaSeRegistro(); 
  }

  verificarSiYaSeRegistro() {

    return new Promise((assert, reject) =>  {
      console.log("verificarSiYaSeRegistro")
 
            this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid)
                .valueChanges()
                .subscribe(snapshot =>  {
                  debugger;
                  console.log("this._afDB.list " + this.usuario.credenciales.uid)
                  console.log(JSON.stringify(snapshot)); 
                  if ( ! snapshot) {
                    console.log("Insertara nuevo registro " + this.usuario.credenciales.uid)
                    this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).update(this.usuario); 
                  }
                  assert(true); 
                })
            

       }); 
  }

}

