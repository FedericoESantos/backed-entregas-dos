FROM node:20.15.0

# aca el definimos un contenedor en este caso a app
WORKDIR /app 

# copiamos el archivo package.json y lo dirigimos a ./ - el ./ es adonde escribimos en workdir
COPY package*.json ./

# aca ejecutamos un comando dentro del contenedor
RUN npm install

# luego copiamos el resto de lo que necesitemos
COPY ./src ./src

# y por ultimo necesito compartir el puerto
EXPOSE 8000

# ahora necesito indicarle cual es el comando para que esto levante
CMD ["npm", "start"]