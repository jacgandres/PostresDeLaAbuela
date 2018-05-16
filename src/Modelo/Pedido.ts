import { Producto } from './Producto';

export interface Pedido {
    estadoPedido?:boolean;
    fechaPedido?:Date;
    fechaEntrega?:Date;
    direccion?:string;
    valor?:number;
    producto:Producto[];
}