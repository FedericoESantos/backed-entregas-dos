import { UsuariosMongoDAO } from "../dao/UsuariosMongoDAO.js";

class UsuarioService{
    constructor(dao){
        this.usuariosDAO = dao
    }

    async getUsuarios(){
        let usuarios = await this.usuariosDAO.get();
        return usuarios;
    }
}
export const usuariosService = new UsuarioService(new UsuariosMongoDAO());