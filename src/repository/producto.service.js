import { ProductManagerDAO } from "../dao/ProductManagerDAO.js";

class ProductoService{
    constructor(dao){
        this.productosDAO = dao
    }

    async getProductos(){
        let productos = await this.productosDAO.getAll();
        return productos;
    }

    async getProductosBy(filtro){
        let productos = await this.productosDAO.getProductosBy(filtro);
        return productos;
    }

    async CreateProductos(){
        let productos = await this.productosDAO.createProducts();
        return productos;
    }

}
export const productosService = new ProductoService(new ProductManagerDAO());