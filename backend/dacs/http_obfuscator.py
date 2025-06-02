"""
WGSI middleware, see https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/#applying-wsgi-middleware
"""

import os, struct
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

class HttpObfuscator:
    def __init__(self, application):
        self.app = application


    def __call__(self, environ, start_response):
        def _encrypt(pt, key):
            full_nonce = key[0:16]
            cipher = Cipher(algorithms.AES(key), modes.CTR(full_nonce))
            encryptor = cipher.encryptor()
            ct = (encryptor.update(chunk) for chunk in pt)
            return ct

        def _decrypt(ct, key):
            full_nonce = key[0:16]
            cipher = Cipher(algorithms.AES(key), modes.CTR(full_nonce))
            decryptor = cipher.decryptor()
            pt = (decryptor.update(chunk) for chunk in ct)
            return pt

        print("CONTENT_LENGTH: ", conlength := environ['CONTENT_LENGTH'])
        print(environ)
        #assert environ['CONTENT_TYPE'] == 'application/octet-stream','incorrect content type for obfuscated traffic'
        #environ['CONTENT_TYPE'] = environ['HTTP_ORIGINAL_CONTENT_TYPE']
        #del environ['HTTP_ORIGINAL_CONTENT_TYPE']
        response = self.app(environ, start_response)

        key = bytes([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        #print("enc then dec: ", list(_decrypt(_encrypt(response,key),key)))

        return response
