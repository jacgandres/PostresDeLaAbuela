import {AngularFireDatabase, snapshotChanges, AngularFireAction }from 'angularfire2/database'; 
import * as firebase from 'firebase'; 
import "rxjs/add/operator/map"; 

import {Injectable }from '@angular/core'; 
import {Usuario, Pedido }from '../../Modelo/Modelo.Export'; 
import {CommunUtilidadesProvider }from '../commun-utilidades/commun-utilidades'; 
import {assert }from 'ionic-angular/util/util'; 
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class UsuarioProvider {

  public usuario:Usuario =  {}; 
  public pedidosActivos:Pedido[]; 
  private suscripcionUsuarios:Subscription;
  private suscripcionClave:Subscription;
  private suscripcionProductos:Subscription;


  constructor(private _afDB:AngularFireDatabase, 
              private _aFAuth: AngularFireAuth,
              private funcionesComunes:CommunUtilidadesProvider) {

  }

  cargarUsuario(clave:string, 
                nombre:string, 
                email:string, 
                imagen:string, 
                uid:string, 
                provider:string, 
                estaLogueado:boolean, 
                numeroTelefonico?:string) {

      console.log("cargarUsuario")
      this.usuario.credenciales =  {}; 
      
      this.usuario.credenciales.clave = clave; 
      this.usuario.credenciales.nombre = nombre; 
      this.usuario.credenciales.email = email; 
      this.usuario.credenciales.imagen = imagen; 
      this.usuario.credenciales.uid = uid; 
      this.usuario.credenciales.provider = provider; 
      this.usuario.credenciales.estaLogeado = estaLogueado; 
      this.usuario.credenciales.numeroTelefonico = numeroTelefonico; 
  }

  salvarCredencialEnFireBase() {
    console.log("salvarCredencialEnFireBase")
    return this.verificarSiYaSeRegistro(); 
  }

  actualizarUsuario() {
    console.log("actualizarUsuario: " + this.usuario.credenciales.uid)
    return this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).update(this.usuario); 
  }

  verificarSiYaSeRegistro() {

    return new Promise((assert, reject) =>  { 
      console.log("verificarSiYaSeRegistro"); 
      this.suscripcionUsuarios =
         this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid)
            .valueChanges()
            .subscribe(snapshot =>  { 
                
                console.log("this._afDB.list " + this.usuario.credenciales.uid)
                if ( ! snapshot) {
                  
                  console.log("Insertara nuevo registro " + this.usuario.credenciales.uid)
                  this.usuario.credenciales.FechaRegistro = Date.now();
                  if(this.usuario.credenciales.imagen != null && this.usuario.credenciales.imagen.length>0)
                  {
                    if(this.usuario.credenciales.provider.toLocaleLowerCase() != "facebook"){
                        let archivo = {
                          img: this.usuario.credenciales.imagen,
                          titulo: "Imagen de perfil: "+this.usuario.credenciales.nombre,
                          usuario: this.usuario.credenciales.nombre
                        }
                        this.CargarImagenEnFirebase(archivo).then((result:string)=>{
                          
                          this.usuario.credenciales.imagen = result;
                          this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).set(this.usuario); 
                          this.suscripcionUsuarios.unsubscribe();
                          assert(true);  
                        },(err1)=>{
                          
                          console.log("Error en carga de imagen, resultado promesa............");
                          console.log(JSON.stringify(err1));
                          this.usuario.credenciales.imagen = "";
                          this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).set(this.usuario); 
                          this.suscripcionUsuarios.unsubscribe();
                          assert(true);   
                        });
                    }
                    else{
                      
                      this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).set(this.usuario); 
                      this.suscripcionUsuarios.unsubscribe();
                      assert(true);  
                    }
                  }
                  else{
                    this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid).set(this.usuario); 
                    this.suscripcionUsuarios.unsubscribe();
                    assert(true);  
                  } 
                }
                else {
                  
                  this.usuario = snapshot; 
                  this.suscripcionUsuarios.unsubscribe();
                  assert(true); 
                }
            });
    }); 
  }

  adicionarPedidos(pedido:Pedido[]) {
    return new Promise((assert, reject) =>  { 
      console.log("adicionarPedidos"); 
      this._afDB.object('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/')
        .set(pedido).then(() =>  {
          console.log("promesa adicionarPedidos"); 
          assert(); 
        })
    }); 
  }

  CrearUsuarioYContrasena(){
      
      return new Promise((resolve, reject)=>{
          
          this._aFAuth.auth.createUserWithEmailAndPassword(
              this.usuario.credenciales.email,this.usuario.credenciales.clave).then((data)=>{
                  
                  console.log(JSON.stringify(data));
                  resolve(data);
              },(error)=>{
                  
                  console.log(JSON.stringify(error));
                  reject(null);
              })
      })
  }

  LogInUsuarioContrasena()  {
    return new Promise((resolve, reject)=>{ 
        this._aFAuth.auth.signInWithEmailAndPassword(
            this.usuario.credenciales.email,
            this.usuario.credenciales.clave
        ).then((data)=>{ 
            console.log(JSON.stringify(data));
            resolve(data);
        },
        (error)=>{ 
            console.log(JSON.stringify(error));
            reject(null);
        })
    });
  }

  obtenerUsuarioPorClave(data) {
    return new Promise((assert) =>  {
        
      console.log("Entrando a promesa obtenerProductosActivos"); 
      this.suscripcionClave =
          this._afDB.list('/Usuarios/')
            .valueChanges()
            .subscribe((Usuarios:Usuario[]) =>  { 
                console.log("Promesa busqueda usuarios: " + Usuarios.length); 
                let claveEncriptada = this.funcionesComunes.Encriptar(data.Clave).toString(); 
                let usuarioLogeado:any = 
                  Usuarios.filter(item => item.credenciales.clave == claveEncriptada && item.credenciales.email == data.Email); 
                
                this.suscripcionClave.unsubscribe();
                
                if (usuarioLogeado != null && usuarioLogeado[0]  && usuarioLogeado[0].credenciales) {
                  this.usuario = usuarioLogeado[0]; 
                  assert(true); 
                }
                else {
                  assert(false); 
                }
            }); 
    }); 
  }


  obtenerProductosActivos() {
    return new Promise((assert, reject) =>  { 
      console.log("Entrando a promesa obtenerProductosActivos"); 
      this.suscripcionProductos =
          this._afDB.list('/Usuarios/' + this.usuario.credenciales.uid + '/pedidos/')
            .valueChanges()
            .subscribe((pedidosResultado:Pedido[]) =>  { 
                console.log("Promesa busqueda activos: " + pedidosResultado.length); 
                let filtroPedidos = pedidosResultado.filter(item => item.esConfirmado === false)
                this.pedidosActivos = filtroPedidos; 
                this.suscripcionProductos.unsubscribe();
                assert(); 
            }); 
    }); 
  }

  CargarImagenEnFirebase( archivo: any){

    let promesa = new Promise( (resolve, reject)=>{ 
      let storeRef = firebase.storage().ref();
      let nombreArchivo:string = archivo.usuario.replace(" ", "") + new Date().valueOf().toString();  
      try { 
          
          let uploadTask: firebase.storage.UploadTask =
              storeRef.child(`/ImagenesPerfil/${ nombreArchivo }`)
                      .putString( archivo.img, 'base64', { contentType: 'image/jpeg' }  );

          uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{ }, // saber el % de cuantos Mbs se han subido
                ( error ) =>{
                  
                  // manejo de error
                  console.log("ERROR EN LA CARGA");
                  console.log(JSON.stringify( error )); 
                  reject();
                },
                ()=>{
                  
                  // TODO BIEN!!
                  console.log('Archivo subido');  
                  let url = uploadTask.snapshot.downloadURL;
      
                  resolve(url);
                } 
              );  
        } catch (error) {
          
          console.log("No se pudo cargar la imagen..................");
          console.log(JSON.stringify(error));
          resolve("");
        }
    });

    return promesa;

  }
}

