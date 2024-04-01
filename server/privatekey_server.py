from flask import Flask, jsonify
import rsa

app = Flask(__name__)

@app.route('/generate-keys', methods=['GET'])
def generate_keys():
    # Generar un nuevo par de claves RSA de 1024 bits
    (publicKey, privateKey) = rsa.newkeys(1024)

    # Convertir las claves a su representación en cadena
    public_key_string = publicKey.save_pkcs1().decode('utf-8')
    private_key_string = privateKey.save_pkcs1().decode('utf-8')

    # Devolver las claves como respuesta JSON
    return jsonify({
        'publicKey': public_key_string,
        'privateKey': private_key_string
    })

if __name__ == '__main__':
    app.run(debug=True)
