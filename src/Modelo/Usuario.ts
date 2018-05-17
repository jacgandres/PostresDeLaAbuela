import { Credenciales } from './Credenciales';
import { Pedido } from './Pedido';

export interface Usuario {
    credenciales?:Credenciales;
    pedidos?:Pedido[];
    telefonos?:string[];
    valorTotalPedidos?:number;
}