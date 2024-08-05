import mongoose from "mongoose";
import { loggerDesarrollo } from "../utils.js";
// con esto creamos el patron Singleton
export class ConnDB{
    static #conexion;
    constructor(url, db){
        mongoose.connect(url,{dbName:db})
    }

    static conectar(url,db){
        // si alguien ya paso por esta conexion
        if(this.#conexion){ 
            loggerDesarrollo.info('Conexion previamente establecida');
            return this.#conexion;
        }
        // si no paso la creo - creo un flag
        this.#conexion = new ConnDB(url,db)
        loggerDesarrollo.info('DB conectada');
        return this.#conexion;
    }
}