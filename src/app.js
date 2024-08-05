import express from "express";
import cors from "cors";
import path from "path";
import { Server } from "socket.io"; // importamos la libreria de socket
import { engine } from "express-handlebars"; // importamos la libreria de express-handlebars
import mongoose from "mongoose";
import __dirname, { loggerDesarrollo, middLogger } from "./utils.js"; // con esta importacion nos aseguramos la ruta absoluta 
import sessions from "express-session"; // aca generamos la session
import passport from "passport"
import { initPassport } from "./config/passport.config.js";
import { config } from './config/config.js';
import nodemailer from "nodemailer";

import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import { router as sessionRouter } from "./routes/session.router.js";
import { router as usuariosRouter } from "./routes/usuarios.router.js";
import { router as mockingprod } from "./routes/mockingProducts.route.js";

import messageModel from "./dao/models/messagesModel.js"; // aca importamos el modelo de los mensajes del chat
import MongoStore from "connect-mongo";
import { auth } from "./middleware/auth.js";
import { usuarioModel } from "./dao/models/usuarioModels.js";
import { UsuariosDTO } from "./dto/UsuariosDTO.js";
import { ConnDB } from "./config/ConnDB.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";


import cluster from "cluster";

if (cluster.isPrimary) {
    cluster.fork();
    cluster.fork();
    cluster.fork();
}
else {
    const app = express();
    const PORT = config.PORT;

    const transporter = nodemailer.createTransport( // aca creamos un objeto con los datos el mail
        {
            service: "gmail",
            port: "587", // el numero de puerto lo provee gmail
            auth: {
                user: "boomarts47@gmail.com",
                pass: "kvbgjskjbcgnrpro"
            }
        }
    )

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname + "/public"));

    const option ={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Api Productos y Carrito",
                version: "1.0.0",
                description: "Documentacion del endpoint de Productos y de Carrito"
            },
        },
        apis: [ "./src/*.yaml" ]
    }

    const specific = swaggerJSDoc(option)
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specific));

    app.use(cors());
    // con esto permitimos que nuestro proycto 
    // se pueda abrir de distintos puertos con los datos cruzados
    // con esto podemos conectar con un frontend aparte
    app.use(middLogger);

    app.use(sessions({
        secret: "CoderCoder123",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            ttl: 3600, //time to live el tiempo que va a seguir activa la session
            mongoUrl: "mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce"
        })
    }))

    // PASO 2
    initPassport();
    app.use(passport.initialize());
    app.use(passport.session()); // solo si uso sessions

    app.engine("handlebars", engine());
    app.set("views", path.join(__dirname + "/views")); // en la carpeta views guardaremos nuestro codigo html
    app.set("view engine", "handlebars");

    app.use("/api/products", productsRoute);
    app.use("/api/carts", cartsRoute);
    app.use("/api/sessions", sessionRouter);
    app.use("/api/usuarios", usuariosRouter);
    app.use("/", viewsRoute);
    app.use("/mockingproducts", mockingprod);
    app.use("/usuarios", async (req, res) => {
        let usuarios = await usuarioModel.find().lean();
        // hacemos un mapeo para todos los usuarios para que use el patron DTO de la clase DTO
        usuarios = usuarios.map(us => new UsuariosDTO(us));

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(200).json({ payload: usuarios });
    })

    app.get("/datos", auth, (req, res) => { // importante primero creamos los datos
        // y agregamos el middleware de autenticacion, previo lo importamos
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            datos: "datos", sesson: req.session
        });

    })

    app.get("/session", (req, res) => { // lo iniciamos en la ruta que querramos
        if (req.session.contador) { // es unica por cada usuario que se conecte
            req.session.contador++ // si existe una propiedad contador le sumo 1
        } else { //y sino
            req.session.contador = 1; // la creo y la inicializo en 1 
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(`visitas al site: ${req.session.contador}`); // muestra la cantidad de visitas
    })

    app.get("/getcookies", (req, res) => { // este metodo es para leer las cookies
        let cookies = req.cookies; // aca guardamos las cookies
        let cookiesFirmadas = req.signedCookies; // con esto guardamos las cookies
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            cookies, // aca mostramos las cookies
            cookiesFirmadas // aca se guardan
        });

    })

    let usuarios = []; // guardamos los usuarios en un array

    const HTTPServer = app.listen(PORT, () => { console.log(`Corriendo aplicacion en el puerto ${PORT}`); });
    const io = new Server(HTTPServer); // aca instanciamos el servidor de http

    // CONEXION CON SOCKET.IO

    io.on("connection", (socket) => { // aca va a escuchar el socket. Como primer parametro recibe conection
        loggerDesarrollo.info("Se ha conectado un cliente");

        socket.on("agregarProducto", async () => {
            // aca tengo que agregar productos????
            let nuevoProducto = await productManager.createProduct({ title, description, code, price, stock, category });
            productos.push(nuevoProducto);
            res.status(201).json(nuevoProducto);
        })
        // ------------------ comienza la comunicacion con el chat ------------------------------

        //CUANDO ALGUIEN SE IDENTIFICA
        socket.on("id", async (nombre) => { // aca voy a recibir el nombre y lo voy a almacenar en una variable usuarios 
            usuarios.push({ id: socket.id, nombre }); // aca agrego el nombre que me manda al array incluyendo el nombre

            let mensajes = await messageModel.find(); // aca guardamos los mensajes en la base de datos 
            mensajes = mensajes.map(men => { // acua hago un mapeo para obtener los mensajes y los mails
                return { nombre: men.email, mensaje: men.mensaje }
            })
            socket.emit("mensajesPrevios", mensajes); // aca guardo el historial de los mensajes
            socket.broadcast.emit("nuevoUsuario", nombre); // aca le envio un mensaje para todos menos para el ultimo con un nuevo nombre
        })

        //ACA RESPONDO LOS MENSAJES
        socket.on("mensaje", async (nombre, mensaje) => { // aca voy a recibir 2 cosas, el nombre y el mensaje
            await messageModel.create({ email: nombre, mensaje }) // aca creamos el mensaje
            io.emit("nuevoMensaje", nombre, mensaje); // y aca vuelo a enviar a todos (io) el nombre y el mensaje
        })

        //CUANDO ALGUIEN SALE DEL CHAT
        socket.on("disconnect", () => {
            let usuario = usuarios.find(usur => usur.id === socket.id);
            // voy a buscar dentro de mis usuarios a todos cuyo id sea igual a socket.id
            if (usuario) { // si encontre al usuario
                io.emit("saleUsuario", usuario.nombre); //del usuario me detecta el id pero no el nombre
                loggerDesarrollo(usuario.nombre);
            }

        })

    })
    // ------------------ fin de la comunicacion con el chat ------------------------------

    // CONEXION CON LA BASE DE DATOS DESDE FACTORY.JS
    // instanciamos el patron Singleton
    ConnDB.conectar("mongodb+srv://boomarts:CoderCoder123@cluster0.z3sb9mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "ecommerce");

    // se debe implementar cuando se confirme una compra que le llegue al cliente un mail con la informacion de pago

    // ESTE ES EL METODO PARA ENVIAR MAIL       
    // transporter.sendMail( // es otro metodo para enviar mail
    //     {
    //         from: "E-commerce boomarts47@gmail.com",
    //         to: "boomarts@yahoo.com", // este es el mail donde se envían los mensajes
    //         subject: "prueba de mail con adjunto",
    //         //text: // mensaje de texto plano
    //         html:`<h2>Mensaje de prueba</h2>
    //         <p>mensajes con adjuntos</p>
    //         <br>
    //         <hr>
    //         <img src="imagen1"/>
    //         <hr>
    //         `,
    //         attachments: [ //es un formato de arreglo de objetos donde se indica por cada uno un path y filename
    //             {
    //                 path:"./src/public/img/fondo.jpg",
    //                 filename:"logo",
    //                 cid: "imagen1" // cid significa content id, le ponemos el nombre que querramos para llamarlo en el mensaje como incrustrado en una etiqueta
    //             },
    //         ] 
    //     }
    // ).then(console.log("Mail enviado")) // con esto atrapo la promesa
    // .catch(error=>console.log(error)) 

    // aca creamos un modelo global dentro de una constante
    // export const enviarEmail = async(de,para, asunto, mensaje, adjuntos)=>{
    //     return await transporter.sendMail(
    //         {
    //             from: de,
    //             to: para,
    //             subject: asunto,
    //             html: mensaje,
    //             attachments: adjuntos
    //         }
    //     )
    // }
    // // y aca la llamamos pasandole la información que requiera
    // let resultado = await enviarEmail(
    //     "E-Commerce boomarts47@gmail.com", //from -- desde donde se envia el mail, se puede modificar el remitente con un nombre antes del mail
    //     "boomarts@yahoo.com", // to -- hacia donde va dirigido
    //     "prueba de mail con adjunto", // subject -- el asunto del mensaje
    //     `<h2>Mensaje de prueba</h2> 
    //         <p>mensajes con adjuntos</p>
    //         <br>
    //         <hr>` // html -- el mensaje emitido en el mail
    //    )
    // // despues preguntas si salio bien devuelve mensaje por consola
    // if(resultado.accepted.length>0){
    //     console.log('Mail Enviado!!!');
    // }



}
