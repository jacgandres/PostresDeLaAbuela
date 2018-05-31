
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Usuario } from '../../Modelo/Modelo.Export'; 
import { Platform } from 'ionic-angular';
import { CommunUtilidadesProvider } from '../providers.export';

@Injectable()
export class DeviceServiceProvider { 

  public Usuario:Usuario={};

  constructor(private _device: Device,
              private plataforma:Platform,
              private funcionesComun:CommunUtilidadesProvider) {  
              console.log('Hello DeviceServiceProvider Provider'); 
  }
 
  public obtenerInformacionDispositivo(){ 
    this.funcionesComun.presentarLoadingDefault();

    return new Promise((assert,reject)=>{ 
        this.Usuario.dispositivo = {}; 
        if(this.plataforma.is("cordova"))
        {
          console.log('Device UUID is: ' + this._device.uuid);
          console.log('Device manufacturer is: ' + this._device.manufacturer);
          console.log('Device cordova is: ' + this._device.cordova);
          console.log('Device model is: ' + this._device.model);
          console.log('Device version is: ' + this._device.version);
          console.log('Device isVirtual is: ' + this._device.isVirtual);
          console.log('Device serial is: ' + this._device.serial); 

          this.Usuario.dispositivo.cordova = this._device.cordova;
          this.Usuario.dispositivo.uuid = this._device.uuid;
          this.Usuario.dispositivo.manufacturer = this._device.manufacturer;
          this.Usuario.dispositivo.model = this._device.model;
          this.Usuario.dispositivo.version = this._device.version;
          this.Usuario.dispositivo.isVirtual = this._device.isVirtual;
          this.Usuario.dispositivo.serial = this._device.serial;

          this.funcionesComun.LoadingView.dismiss();
          assert();
        } 
        else{
          console.log("Device Provider Se corre desde un navegador.");

          this.Usuario.dispositivo.cordova = "cordova";
          this.Usuario.dispositivo.uuid =  "uuid";
          this.Usuario.dispositivo.manufacturer =  "manufacturer";
          this.Usuario.dispositivo.model =  "model";
          this.Usuario.dispositivo.version =  "version";
          this.Usuario.dispositivo.isVirtual =  false;
          this.Usuario.dispositivo.serial =  "serial"; 
          setTimeout(() => {
            this.funcionesComun.LoadingView.dismiss();
            assert();
          }, 1000);
        } 
    });
  }
}
