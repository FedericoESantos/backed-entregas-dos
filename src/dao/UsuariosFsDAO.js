import { usuarioModel } from "./models/usuarioModels.js";

export class UsuariosFsDAO{
    
    async get(){
        return await usuarioModel.find().lean();
    }

    async getBy(filtro={}){
        return await usuarioModel.findOne(filtro).lean();
    }

    async create(usuario){
        let nuevoUsuario = await usuarioModel.create(usuario);
        return nuevoUsuario.toJSON();
    }

}