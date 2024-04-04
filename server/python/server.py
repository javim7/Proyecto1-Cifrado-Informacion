from pymongo            import MongoClient
from flask              import Flask, jsonify, request
from bson               import ObjectId
from libreria_simetrica import AESCipher
from datetime           import datetime

import certifi
import json
import requests
import base64

# Importamos CORS para permitir peticiones desde cualquier origen y lo configuramos

from flask_cors import CORS


app = Flask(__name__)

# Permitir peticiones desde cualquier origen

CORS(app)

mongo_uri = "mongodb+srv://mom20067:proyecto1Cifrados@cluster0.sgobhpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(mongo_uri, tlsCAFile=certifi.where())

db = client['test']

# Función auxiliar para convertir ObjectId a string
def ObjectIdToStr(item):
    if isinstance(item, list):
        return [ObjectIdToStr(element) for element in item]
    elif isinstance(item, dict):
        for key in item:
            item[key] = ObjectIdToStr(item[key])
    elif isinstance(item, ObjectId):
        return str(item)
    elif isinstance(item, bytes):
        return base64.b64encode(item).decode('utf-8')  # Codificar bytes a base64
    return item













"""
/list_collections
[ GET ] This endpoint returns a list of all the collections in the database.
Usage: http://localhost:3500/list_collections
"""
@app.route('/list_collections')
def list_collections():
    try:
        collections = db.list_collection_names()
        return jsonify(collections)
    except Exception as e:
        # Retornamos un codigo de error 500
        return jsonify({'error': str(e)}), 500

"""
/list_all_entries_in_collection/<collection_name>
[ GET ] This endpoint returns all the entries in the specified collection.
Usage: http://localhost:3500/list_all_entries_in_collection/<collection_name>
"""
@app.route('/list_all_entries_in_collection/<collection_name>')
def list_all_entries_in_collection(collection_name):
    try:
        collection = db[collection_name]
        entries = list(collection.find({}))

        # Convertir ObjectId a string
        entries = ObjectIdToStr(entries)

        return jsonify(entries)
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500






"""
/groups/get_all_groups/
[ GET ] This endpoint returns all the groups in the database, specifically in the 'groups' collection.
Usage: http://localhost:3500/groups/get_all_groups/
"""
@app.route('/groups/get_all_groups/')
def get_all_groups():
    try:
        group_db = db['groups']
        groups = list(group_db.find({}))

        # Convertir ObjectId a string
        groups = ObjectIdToStr(groups)

        return jsonify(groups)
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500
    


"""
/groups/get_all_groups_by_user/<username>
[ GET ] This endpoint returns all the groups in the database where the specified user is a member.
Usage: http://localhost:3500/groups/get_all_groups_by_user/<username>
"""
@app.route('/groups/get_all_groups_by_user/<username>')
def get_all_groups_by_user(username):
    try:
        group_db = db['groups']
        groups = list(group_db.find({"usuarios.username": username}))

        # Convertir ObjectId a string
        groups = ObjectIdToStr(groups)

        return jsonify(groups)
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500


"""
/groups/create_new_group/
[ POST ] This endpoint creates a new group in the database, specifically in the 'groups' collection.
Usage: http://localhost:3500/groups/create_new_group/
Body: {
    "nombre": "group_name",
    "usuarios": ["user1", "user2", "user3"],
    "contraseña": "designated password"
}
"""
@app.route('/groups/create_new_group/', methods=['POST'])
def create_new_group():
    try:

        data = request.json

        group_db = db['groups']

        llave_simetrica, vector = AESCipher.generate_params()

        print(json.dumps(data, indent=4))

        print(f"La llave simetrica generada es: {llave_simetrica}")
        print(f"El vector generado es: {vector}")

        # Codificar en base64 y decodificar a string para poder insertar en JSON
        llave_simetrica_base64 = base64.b64encode(llave_simetrica).decode('utf-8')
        vector_base64 = base64.b64encode(vector).decode('utf-8')

        # Por cada usuario, lo buscamos en la tabla de users y su objeto lo agregamos a una lista de usuarios validos

        usuarios_validos = []

        for usuario in data['usuarios']:
            user = db['users'].find_one({"username": usuario})
            if user:
                usuarios_validos.append(user)
                print(f"El usuario {usuario} existe en la base de datos")
            else:
                print(f"El usuario {usuario} no existe en la base de datos")
        
        # Creamos el grupo y lo insertamos en la base de datos
                
        group = {
            "nombre": data['nombre'],
            "usuarios": usuarios_validos,
            "contraseña": data["contraseña"],
            "clave_simetrica": llave_simetrica,
            "vector": vector,
            "fecha_creacion": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        result = group_db.insert_one(group)

        return jsonify({'inserted_id': str(result.inserted_id)})
    
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500








"""
/groups/get_group_by_name/<group_name>
[ GET ] This endpoint returns the group _id in the database, specifically in the 'groups' collection, by the group name.
Usage: http://localhost:3500/groups/get_group_by_name/<group_name>
"""
@app.route('/groups/get_group_by_name/<group_name>')
def get_group_by_name(group_name):
    try:
        group_db = db['groups']
        group = group_db.find_one({"nombre": group_name})

        # Convertir ObjectId a string
        group = ObjectIdToStr(group)

        return jsonify(group["_id"])
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500
    

"""
/groups/insert_message_to_group/
[ POST ] This endpoint inserts a new message in the specified group in the group_messages collection.
Usage: http://localhost:3500/groups/insert_message_to_group/
Body: {
    "valid_group_id": "group_id",
    "autor": "sender_username",
    "mensaje_cifrado": "message_content"
}
"""
@app.route('/groups/insert_message_to_group/', methods=['POST'])
def insert_message_to_group():
    try:
        data = request.json

        group_db = db['groups']

        group_id = data["valid_group_id"]

        group = group_db.find_one({"_id": ObjectId(group_id)})

        if group:
            # Obtener la llave simetrica y el vector
            llave_simetrica = group["clave_simetrica"]
            
            vector = group["vector"]

            print(f"La llave simetrica es: {llave_simetrica}")
            print(f"El vector es: {vector}")

            # El mensaje no se encuentra cifrado, por lo que se procede a cifrar e insertar en la base de datos
            aes_cipher = AESCipher(llave_simetrica, vector)
            mensaje_cifrado = aes_cipher.encrypt(data["mensaje_cifrado"])

            print(f"Cifrado: {mensaje_cifrado}")

            # Insertar el mensaje descifrado en la base de datos
            group_messages_db = db['group_messages']
            message = {
                "group_id": group_id,
                "autor": data["autor"],
                "mensaje": mensaje_cifrado,
                "fecha_envio": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            result = group_messages_db.insert_one(message)

            return jsonify({'inserted_id': str(result.inserted_id)})
        else:
            return jsonify({'error': 'Group not found'}), 404
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500


"""
/groups/get_all_messages_by_group/
[ POST ] This endpoint returns all the messages in the specified group in the group_messages collection.
Usage: http://localhost:3500/groups/get_all_messages_by_group/
Body: {
    "valid_group_id": "group_id"
}
"""
@app.route('/groups/get_all_messages_by_group/', methods=['POST'])
def get_all_messages_by_group():
    try:
        data = request.json

        group_messages_db = db['group_messages']

        group_id = data["valid_group_id"]

        messages = list(group_messages_db.find({"group_id": group_id}))

        # Por cada objeto en messages, desciframos el mensaje y guardamos tanto el mensaje cifrado como el descifrado

        group_db = db['groups']
        group = group_db.find_one({"_id": ObjectId(group_id)})
        llave_simetrica = group["clave_simetrica"]
        vector = group["vector"]

        print(f"La llave simetrica es: {llave_simetrica}")
        print(f"El vector es: {vector}")

        # La llave y el vector se ven de la siguiente manera:

        # La llave simetrica es: b'\xa9\xccM 28\xbd\xfb\xac;\xb8\xbbW\x90\xf3\xd4'
        # El vector es: b'\xec`b\xe9\xcf\x84r"\xaf\x8e\x1a\xcb\xd1b\xcf%'

        for message in messages:

            try:
                # Obtener la llave simetrica y el vector

                print(f"Mensaje cifrado: {message['mensaje']}")
                
                # Descifrar el mensaje
                aes_cipher = AESCipher(llave_simetrica, vector)

                mensaje_descifrado = aes_cipher.decrypt(message["mensaje"])

                print(f"Descifrado: {mensaje_descifrado}")

                message["mensaje_descifrado"] = mensaje_descifrado

            except Exception as e:

                print(f"Error al descifrar el mensaje: {str(e)}")

                message["mensaje_descifrado"] = f"Error al descifrar el mensaje: {str(e)}"

        # Convertir ObjectId a string
        messages = ObjectIdToStr(messages)

        return jsonify(messages)
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500
    

"""
/groups/delete_group_by_name/
[ POST ] This endpoint deletes the specified group in the database, specifically in the 'groups' collection, by the group name if the password in the body equals the password of the group.
Usage: http://localhost:3500/groups/delete_group_by_name/
Body: {
    "nombre": "group_name",
    "contraseña": "designated password"
}
"""
@app.route('/groups/delete_group_by_name/', methods=['POST'])
def delete_group_by_name():
    try:
        data = request.json

        group_db = db['groups']

        group = group_db.find_one({"nombre": data["nombre"]})

        if group:
            if group["contraseña"] == data["contraseña"]:
                result = group_db.delete_one({"nombre": data["nombre"]})
                return jsonify({'deleted_count': result.deleted_count})
            else:
                return jsonify({'error': 'Invalid password'}), 403
        else:
            return jsonify({'error': 'Group not found'}), 404
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500




"""
/users/update_user_private_and_public_key/
[ PUT ] This endpoint updates the private and public key of the specified user in the database, 
specifically in the 'users' collection we update their public key and in the keys collection we update their private key.
Usage: http://localhost:3500/users/update_user_private_and_public_key/
Body: {
    "username": "username"
    "base64_public_key": "public_key"
    "base64_private_key": "private_key"
}

users collection example:
{
  "_id": {
    "$oid": "660b3f7912ccac45b627cd6d"
  },
  "public_key": "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZ3d0RRWUpLb1pJaHZjTkFRRUJCUUFEU3dBd1NBSkJBS3FOUVhyM2pOL0FyZ0NubkYyYTdaUkROOGlpNVVEOApMVWJtcnNZZFQ2OGVkTitZMWttUVY0MlFmZHJBUkdycE9XVVpFNDNhd242c2RCVmwyeDhkUXdzQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ==",
  "username": "mombius",
  "date_created": {
    "$date": "2024-04-01T23:12:57.488Z"
  },
  "__v": 0
}

keys collection example:
{
  "_id": {
    "$oid": "660b3f7912ccac45b627cd70"
  },
  "username": "mombius",
  "private_key": "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlCT3dJQkFBSkJBS3FOUVhyM2pOL0FyZ0NubkYyYTdaUkROOGlpNVVEOExVYm1yc1lkVDY4ZWROK1kxa21RClY0MlFmZHJBUkdycE9XVVpFNDNhd242c2RCVmwyeDhkUXdzQ0F3RUFBUUpCQUtWbmZ6VEp0bGNlWCtLRXEzSmcKbWI3cmZjTllyK3ZaWmZQWUwzSTE1UnpZV2tkSUNNc2tTTENNN0JIc0QxbzNXWVU1T216TGE0bnpZZ1Y2d0FFSgpFaGtDSVFENC8wVUpoSldrYzMxYjRtb3NCMjlJUFpIUk4wd2s4ZDFMbU1YVkVvQlEzUUloQUs5Wk1lZnhxYks1ClVsUmw3bE8vbmM1aWNIV2RoK0FxNXlPMjZGa2FOL0VIQWlBTHpmWlU3QzgzKzYydXhINHFGalFsWlozYklGY0EKeldLamFkdS9MVUJlRlFJZ0xGeGdaOUdYb1FPSmRKaWxCc0wvWldzNkVFZGVUTFFON2Rja1NRWjlDSmtDSVFDQQpmaEFLemFFMFRNUXJBZVpNeE9jTDZtSUZENC9XVXA3ZG9RdklEZEJNdEE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQ==",
  "createdAt": {
    "$date": "2024-04-01T23:12:57.636Z"
  },
  "updatedAt": {
    "$date": "2024-04-01T23:12:57.636Z"
  },
  "__v": 0
}
"""

@app.route('/users/update_user_private_and_public_key/', methods=['PUT'])
def update_user_private_and_public_key():
    try:
        data = request.json

        print(json.dumps(data, indent=4))

        user_db = db['users']
        keys_db = db['keys']

        user = user_db.find_one({"username": data["username"]})
        keys = keys_db.find_one({"username": data["username"]})

        if user and keys:
            user_db.update_one({"username": data["username"]}, {"$set": {"public_key": data["base64_public_key"]}})
            keys_db.update_one({"username": data["username"]}, {"$set": {"private_key": data["base64_private_key"]}})
            return jsonify({'message': 'Keys updated successfully'})
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # Retornamos un código de error 500
        return jsonify({'error': str(e)}), 500
    






if __name__ == '__main__':
    app.run(debug=True, port=3500)
