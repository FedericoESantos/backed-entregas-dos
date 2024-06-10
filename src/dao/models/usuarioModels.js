import mongoose from "mongoose";

export const usuarioModel = mongoose.model("usuarios",
    new mongoose.Schema({
        nombre: String,
        email:{
            type: String, unique:true
        },
        password: String,
        rol:{
            type: String, default:"user"
        }
    },
{
    timestamps: true, strict: false
    // strict en false me permite agregar campos que no estan en el esquema
}))