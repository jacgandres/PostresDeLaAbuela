import {AngularFireDatabase, snapshotChanges }from 'angularfire2/database'; 
import * as firebase from 'firebase'; 
import  "rxjs/add/operator/map"; 

import {Injectable }from '@angular/core'; 


@Injectable()
export class UsuarioProvider {

  usuario:Credenciales =  {}; 

  constructor(private _afDB:AngularFireDatabase) {
 
  }


  cargarUsuario(nombre:string, 
                 email:string, 
                 imagen:string, 
                 uid:string, 
                 provider:string, 
                 estaLogueado:boolean ) {

    this.usuario.nombre = nombre; 
    this.usuario.email = email; 
    this.usuario.imagen = imagen; 
    this.usuario.uid = uid; 
    this.usuario.provider = provider; 
    this.usuario.estaLogeado = estaLogueado; 
  }

  salvarCredencialEnFireBase() {
    console.log("salvarCredencialEnFireBase")
    return this.verificarSiYaSeRegistro(); 
  }

  verificarSiYaSeRegistro() {

    return new Promise((assert, reject) =>  {
      console.log("verificarSiYaSeRegistro")
 
            this._afDB.object('/Usuarios/' + this.usuario.uid)
                .valueChanges()
                .subscribe(snapshot =>  {
                  debugger;
                  console.log("this._afDB.list " + this.usuario.uid)
                  console.log(JSON.stringify(snapshot)); 
                  if ( ! snapshot) {
                    console.log("Insertara nuevo registro " + this.usuario.uid)
                    this._afDB.object('/Usuarios/' + this.usuario.uid).update(this.usuario); 
                  }
                  assert(true); 
                })
            

       }); 
  }

}


export interface Credenciales {
  nombre?:string; 
  email?:string; 
  imagen?:string; 
  uid?:string; 
  provider?:string; 
  estaLogeado?:boolean; 
}