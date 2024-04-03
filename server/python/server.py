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









if __name__ == '__main__':
    app.run(debug=True, port=3500)
