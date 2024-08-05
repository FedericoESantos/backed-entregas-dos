import dotenv from "dotenv";
// con este archivo simulo variables de entorno
dotenv.config( // aca configuramos 2 parametros
    {
        path: "./src/.env",// primer argumento la ruta del .env
        override:true // esto me permite leer una variable de .env
    }
)
export const config = { // aca exporto una variable que va a se run objeto con las variables de entorno
    PORT: process.env.PORT || 8000, // aca configuramos el puerto y si no esta definido la definimos aca como 8080
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PERSISTENCE: process.env.PERSISTENCE || "FS"
}