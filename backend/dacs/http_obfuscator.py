"""
WGSI middleware, see https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/#applying-wsgi-middleware
"""

import os, struct
from io import BytesIO
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

import numpy as np
def xor_cipher(data: bytes, key: bytes) -> bytes:
    data_arr = np.frombuffer(data, dtype=np.uint8)
    key_arr = np.frombuffer(key, dtype=np.uint8)

    repeated_key = np.resize(key_arr, data_arr.shape)
    result = np.bitwise_xor(data_arr, repeated_key)
    return result.tobytes()

class HttpObfuscator:
    def __init__(self, application):
        self.app = application


    def __call__(self, environ, start_response):
        #print('cont:',environ['CONTENT_TYPE'])
        #print('origcont:',environ['HTTP_ORIGINAL_CONTENT_TYPE'])

        key = bytes([1,2,3,4])

        content_length = int(environ.get('CONTENT_LENGTH') or 0)
        if content_length > 0:
            assert environ['CONTENT_TYPE'] is None or environ['CONTENT_TYPE'] == 'application/octet-stream','incorrect content type for obfuscated traffic'
            environ['CONTENT_TYPE'] = environ['HTTP_ORIGINAL_CONTENT_TYPE']
            del environ['HTTP_ORIGINAL_CONTENT_TYPE']
            body = environ['wsgi.input'].read(content_length)
            print("HELP")
            print(body, body, body, body)
            print("HELP")
            print("Before:", body)
            decrypted_body = xor_cipher(body, key)
            print("After:", decrypted_body)
            #environ['CONTENT_LENGTH'] = str(len(encrypted_body))
            environ['wsgi.input'] = BytesIO(decrypted_body)
            print(decrypted_body)

        response_length = 0
        def wrapped_start_response(status, headers, exc_info=None):
            print("help.")
            print("head: ", headers)
            orig_ctype = None
            for i in range(len(headers)):
                print("help")
                print(orig_ctype)
                if headers[i][0] == 'Content-Type':
                    orig_ctype = headers[i][1];
                    if orig_ctype:
                        headers[i] = ('Content-Type','application/octet-stream')
                if headers[i][0] == 'Content-Length':
                    nonlocal response_length
                    response_length = headers[i][1]
            if orig_ctype:
                headers += [('Original-Content-Type', orig_ctype)]
            print("length: ", response_length, "\norig ctype: ", orig_ctype)
            return start_response(status, headers, exc_info)

        response = self.app(environ, wrapped_start_response)

        print("Before: ", response.content)
        response.content = xor_cipher(response.content, key)
        print("After: ", response.content)
        return response
