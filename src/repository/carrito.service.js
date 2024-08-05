import { CartManagerDAO } from "../dao/CartManagerDAO.js";

class CarritoService{
    constructor(dao){
        this.cartsDAO = dao
    }

    async getAll(){
        let carrito = await this.cartsDAO.getAll();
        return carrito;
    }

    async getOneBy(filtro){
        let carrito = await this.cartsDAO.getOneBy(filtro);
        return carrito;
    }

    async createCarrito(){
        let carrito = await this.cartsDAO.create();
        return carrito;
    }

}
export const carritoService = new CarritoService(new CartManagerDAO());