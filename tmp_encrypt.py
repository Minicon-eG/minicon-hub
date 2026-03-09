import base64, sys
from nacl.public import PublicKey, SealedBox

pk = PublicKey(base64.b64decode('rrBEKYaDeErTJibpbhoBgW6FJAZIzaCnzkONy5DJ9Ds='))
encrypted = base64.b64encode(SealedBox(pk).encrypt(b'jqemjrX5x7jADDgJF2fA6M5zrDsbYzojqDYxiOYL8cY=')).decode()
print(encrypted)
