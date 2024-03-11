#1. El tipo de imagen que se utilizara para ejecutar la aplicacion
FROM mysql:latest

#2. variables de entorno
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=mensajes_db

#3. Copiar el script de creacion de la base de datos
COPY schema.sql /docker-entrypoint-initdb.d/schema.sql
