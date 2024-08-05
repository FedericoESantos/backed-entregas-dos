import { fileURLToPath } from "url";
import { dirname } from "path";
//import crypto from "crypto";
import bcrypt from "bcrypt";
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const SECRET = "CoderCoder123"; // con esto creamos una clave
//export const generaHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex");

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// esta configuracion es para organizar las rutas de mnera absoluta
export const validaPassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

let customLevels = { // lo podemos llamar como quisieramos pero siempre tenemos que respetar el nivel de prioridad de la tabla original
    fatal: 0, 
    error: 1, 
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

export const loggerDesarrollo = winston.createLogger(
    { // con esto asociamos los leveles que creamos en customLevels a esta variable
        levels: customLevels,
        transports: [
            new winston.transports.Console(
                {
                    format: winston.format.timestamp()
                }
            )
        ]
    }
)

export const loggerProduccion = winston.createLogger(
    { // con esto asociamos los leveles que creamos en customLevels a esta variable
        levels: customLevels,
        transports: [
            new winston.transports.File(
                {
                    level: "error",
                    filename: "./src/errors.log",
                    format: winston.format.combine(
                        winston.format.timestamp()
                    ),
                }
            )
        ]
    }
)

export const middLogger = (req, res, next) => { // creamos y exportamos un middleware
    req.loggerProd = loggerProduccion;
    req.loggerDes = loggerDesarrollo;
    next();
}