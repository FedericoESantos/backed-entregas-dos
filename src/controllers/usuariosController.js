import { usuariosService } from "../repository/usuarios.service.js";

// creamos las funciones asincronas de get y post

async function getUsers(req,res){
    try {
        let usuarios = await usuariosService.getUsuarios();
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })        
    }
}

async function getUserById(req,res){
    try {
        let usuarios = await usuariosService.getUserById(req.params.id);
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

async function getUserByEmail(req,res){
    try {
        let usuarios = await usuariosService.getUserByEmail(req.params.email);
        
        return res.status(200).json({
            usuarios
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

async function postUser(req,res){
    
    let { nombre, email } = req.body;
    if(!nombre || !email) 
        return res.status(400).json({error:"Complete todos los datos"});
    
    try {
        let existe = await usuariosService.getUserByEmail(email);
        if(existe)
            return res.status(400).json({error:`usuario con email ${email} ya existen`});

        let nuevoUsuario = await usuariosService.createUser(nombre, email);
        return res.status(201).json({nuevoUsuario});
        
    } catch (error) {
        return res.status(500).json({
            error:"Error inesperado", detalle: error.message
        })  
    }
}

export default {getUsers, postUser, getUserById, getUserByEmail};