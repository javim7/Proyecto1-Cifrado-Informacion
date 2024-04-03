from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

class AESCipher:

    @staticmethod
    def generate_params():

        key = get_random_bytes(16)

        iv = get_random_bytes(AES.block_size)

        return key, iv

    def __init__(self, key=None, iv=None):
        """
        Inicializa una nueva instancia de AESCipher, generando una clave AES-128 y un IV.
        """
        self.key = key
        self.iv = iv

    def encrypt(self, data):
        """
        Cifra los datos proporcionados utilizando AES-128 en modo CBC.

        :param data: Los datos (string) a cifrar.
        :return: El texto cifrado (bytes).
        """
        data = data.encode('utf-8')  # Asegurar que los datos sean bytes
        cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
        ciphertext = cipher.encrypt(pad(data, AES.block_size))
        return ciphertext

    def decrypt(self, ciphertext):
        """
        Descifra los datos proporcionados utilizando AES-128 en modo CBC.

        :param ciphertext: El texto cifrado (bytes) a descifrar.
        :return: El texto descifrado (string).
        """
        cipher_decrypt = AES.new(self.key, AES.MODE_CBC, self.iv)
        plaintext = unpad(cipher_decrypt.decrypt(ciphertext), AES.block_size)
        return plaintext.decode('utf-8')

    def get_key_iv(self):
        """
        Devuelve la clave y el vector de inicialización utilizados para el cifrado/descifrado.

        :return: Una tupla que contiene la clave (bytes) y el IV (bytes).
        """
        return self.key, self.iv

if __name__ == '__main__':

    temp_key, temp_iv = AESCipher.generate_params()

    aes_cipher = AESCipher(temp_key, temp_iv)

    data = "Incluyendo puntos y caracteres especiales: !@#$%^&*()_+{}[]|\\:;\"'<>,.?/"
    ciphertext = aes_cipher.encrypt(data)
    print("Mensaje cifrado:", ciphertext)

    decrypted_data = aes_cipher.decrypt(ciphertext)
    print("Mensaje descifrado:", decrypted_data)

    key, iv = aes_cipher.get_key_iv()
    print("Clave:", key)
    print("IV:", iv)


