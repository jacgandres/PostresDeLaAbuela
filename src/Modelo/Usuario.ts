import { Credenciales, Pedido, Dispositivo } from './Modelo.Export'; 

export interface Usuario {
    credenciales?:Credenciales;
    pedidos?:Pedido[];
    telefonos?:string[];
    valorTotalPedidos?:number;
    dispositivo?:Dispositivo;
}