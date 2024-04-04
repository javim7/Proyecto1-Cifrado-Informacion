# Quehubo 2.0

Este proyecto consiste en un chat seguro que permite tanto conversaciones individuales como grupales, implementando robustos mecanismos de cifrado para garantizar la seguridad y privacidad de las comunicaciones. A continuación, se detalla la arquitectura del sistema, así como los procesos de manejo de llaves y cifrado/descifrado implementados.

## Arquitectura del Sistema

El sistema de chat seguro se compone de tres partes principales: el frontend, el backend y la base de datos.

### Frontend

En el frontend se genera y maneja la generación de pares de llaves (pública y privada) para cada usuario. Las llaves se codifican en base64 y se envían al servidor durante la creación de un nuevo usuario. Además, se implementan los algoritmos de cifrado asimétrico (RSA) y simétrico (AES-128 CBC) para cifrar mensajes antes de ser enviados al servidor.

### Backend

El backend recibe las llaves públicas de los usuarios durante el proceso de registro y las almacena en la base de datos. Para los chats privados, gestiona el cifrado y descifrado de mensajes utilizando las llaves públicas y privadas de los usuarios respectivos. Para los chats grupales, gestiona la generación y distribución de la clave simétrica y el vector de inicialización entre los miembros del grupo.

### Base de Datos

En la base de datos se almacenan las llaves públicas de los usuarios en una tabla llamada `usuarios`, mientras que las llaves privadas se almacenan en una tabla separada llamada `llaves`. Además, los mensajes de chats privados se almacenan ya cifrados en la tabla de `messages`, mientras que los mensajes grupales se almacenan ya cifrados en la tabla de `group_messages`.

### group_messages.js
Endpoints:
GET /messages/groups/:id: Obtiene todos los mensajes de un grupo específico por su ID.
POST /messages/groups/:nombre: Crea un mensaje en un grupo específico por el nombre del grupo.
### groups.js
Endpoints:
GET /groups: Obtiene todos los grupos.
POST /groups: Crea un nuevo grupo.
PATCH /groups/:id: Actualiza un grupo añadiendo un usuario por el ID del grupo.
DELETE /groups/:nombre: Elimina un grupo específico por su nombre.
### messages.js
Endpoints:
GET /messages/users/:username_origen/:username_destino: Obtiene todos los mensajes entre dos usuarios.
GET /messages/all_chats/:username: Obtiene todos los usuarios con los que se ha tenido una conversación.
POST /messages/:username_destino: Envia un mensaje a un usuario destino.
### users.js
Endpoints:
GET /users: Obtiene todos los usuarios.
GET /users/:username: Obtiene un usuario específico por su nombre de usuario.
GET /users/:username/key: Obtiene la llave pública del usuario en base 64 por su nombre de usuario.
POST /users: Crea un nuevo usuario.
PATCH /users/:username: Actualiza la llave pública de un usuario.
DELETE /users/:username: Elimina un usuario por su nombre de usuario.
DELETE /users/key/:username: Elimina la llave de un usuario por su nombre de usuario.
### keys.js
Endpoints:
GET /keys/:username: Obtiene la llave privada de un usuario.
POST /keys: Coloca la llave privada en la tabla keys si el usuario existe.
GET /keys/key_pair/:username: Obtiene tanto la llave privada como la llave pública de un usuario.
GET /keys/private_key/:username: Obtiene la llave privada de un usuario.
GET /keys/public_key/:username: Obtiene la llave pública de un usuario.
Para cada uno de estos endpoints, se espera cierta información en la solicitud (como parámetros en la URL, datos en el cuerpo de la solicitud para POST y PATCH, etc.) y devuelven datos en formato JSON junto con códigos de estado HTTP apropiados que indican el resultado de la solicitud.

## Manejo de Llaves y Cifrado

### Creación de Usuarios

Al crear un nuevo usuario, se genera un par de llaves (pública y privada) en el frontend, que se codifican en base64 y se envían al servidor. La llave pública se almacena en la tabla de usuarios, mientras que la llave privada se guarda en la tabla de llaves junto con el nombre de usuario correspondiente.

### Mensajes en Chats Privados (Cifrado RSA)

Cuando se envía un mensaje en un chat privado, se recopilan las llaves públicas y privadas necesarias. El mensaje se cifra en el frontend con la llave pública del destinatario y se envía al servidor cifrado. Para leer los mensajes, se descifran en el frontend utilizando la llave privada del usuario.

### Creación de Grupos

Al crear un grupo, se genera una clave simétrica y un vector de inicialización de manera aleatoria. Estos se codifican en base64 y se envían al servidor para su almacenamiento en la tabla de grupos.

### Mensajes en Chats Grupales (Cifrado AES-128 CBC)

Los mensajes en chats grupales se cifran utilizando AES-128 CBC. La clave simétrica y el vector de inicialización se utilizan para cifrar y descifrar los mensajes. Cualquier miembro del grupo puede obtener estos datos del servidor y utilizarlos para cifrar y descifrar mensajes en su frontend.

## Desafíos

Durante el desarrollo de este proyecto, uno de los principales desafíos fue adaptarnos al uso de JavaScript para el manejo de llaves y cifrados, ya que estábamos más familiarizados con Python. Se nos dificulto esta parte, ya que tuvimos que probar varias librerias para ver cual servia y se adaptaba a nuestras necesidades (hubo unas que no funcionaban de manera optima y otras que estaban deprecadas). Esto implicó un proceso de aprendizaje para comprender cómo implementar los algoritmos de cifrado en el entorno de JavaScript. Además, para manejar la encriptación y el cifrado/descifrado de mensajes grupales con AES128 CBC, optamos por desarrollar un servidor adicional en Python para facilitar estas operaciones.

Otro desafío importante fue decidir dónde almacenar las llaves privadas de los usuarios. Nos encontramos ante la difícil elección entre el almacenamiento local y el almacenamiento en base de datos. Optamos por almacenarlas en la base de datos debido a nuestra intención de permitir que los usuarios inicien sesión desde varios dispositivos. Esta decisión nos permitió tener una opción más segura y escalable, ya que las llaves se guardan en su propia tabla separada, proporcionando una capa adicional de seguridad.

## Recomendaciones

Una posible mejora para el sistema sería implementar un mecanismo de intercambio de claves como Diffie-Hellman para garantizar que tanto el emisor como el receptor puedan descifrar los mensajes en chats privados. Esto evitaría la limitación actual donde solo el destinatario puede descifrar los mensajes cifrados con su clave pública. Además, consideramos que desarrollar un servidor con Python para la encriptación y conectarlo con un API hecho en Flask podría simplificar la implementación de la seguridad del sistema.