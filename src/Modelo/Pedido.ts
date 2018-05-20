import { Producto } from './Producto';

export interface Pedido { 
    id?:string;
    estadoPedido?:boolean;
    fechaPedido?:number;
    fechaEntrega?:number;
    observacion?:string;
    valor?:number;
    producto?:Producto[];
}