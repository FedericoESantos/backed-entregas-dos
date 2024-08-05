// lo primero que hace una clase ejecuta el constructor y nos devuelve una instancia
// El patron DTO genera transformar un modelo de usuario por ejemplo
export class UsuariosDTO{
    constructor(usuario){
        this.firstName = usuario.nombre;
        this.lastName = usuario.apellido?usuario.apellido:null;
        this.fullName = usuario.apellido?`${this.firstName} ${this.lastName}`:this.firstName;
        this.email = usuario.email;
        this.rol = "user";
    }
}

// agregar la password como dato sensible