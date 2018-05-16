import {Injectable }from '@angular/core'; 
import {Platform }from 'ionic-angular'; 
import {Storage }from '@ionic/storage'; 


import { Usuario} from '../../Modelo/Modelo';


@Injectable()
export class StorageUsuarioProvider {

  UsuarioAutenticado:Usuario =  {}

  constructor(private platform:Platform, 
    private storage:Storage) {
    console.log('Hello StorageUsuarioProvider Provider'); 
  }


  guardarUsuario(usuario:Usuario) {
    if (this.platform.is('cordova')) {
      console.log("this.storage: " + JSON.stringify(usuario)); 
      this.storage.set("usuario", usuario); 
    }else {
      localStorage.setItem("usuario", JSON.stringify(usuario)); 
    }
  }

  obtenerUsuario():Promise < any >  {
    console.log("obtenerUsuario")
    return new Promise((resolve, reject) =>  {
      if (this.platform.is('cordova')) {

        this.storage.get('usuario').then(val =>  {
          console.log("this.storage.get: "); 
          if (val) {
            this.UsuarioAutenticado = val; 
            
            resolve(true); 
          }else {
            resolve(false); 
          }

        }); 

      }else {
        localStorage.getItem("usuario"); 
      }
    })
  }
}
