import jwt, time

with open(r"C:\working\atlas\tmp_runner.pem", "r") as f:
    key = f.read()

now = int(time.time())
payload = {
    "iat": now - 30,
    "exp": now + 540,
    "iss": "2973586"
}

token = jwt.encode(payload, key, algorithm="RS256")
print(token)
