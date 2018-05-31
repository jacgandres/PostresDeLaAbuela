import { Producto } from './Modelo.Export'; 

export interface Pedido { 
    id?:string;
    estadoPedido?:string;
    fechaPedido?:number;
    fechaEntrega?:number;
    observacion?:string;
    esConfirmado?:boolean;
    valor?:number;
    producto?:Producto[];
}