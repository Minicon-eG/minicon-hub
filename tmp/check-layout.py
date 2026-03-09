import urllib.request, json, base64, os

token = os.environ.get("GITHUB_TOKEN", "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")
h = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}

# Get layout.tsx
r = json.loads(urllib.request.urlopen(urllib.request.Request(
    "https://api.github.com/repos/Minicon-eG/website-dachdecker-schwarz/contents/app/layout.tsx?ref=main",
    headers=h)).read())
    
content = base64.b64decode(r["content"]).decode("utf-8")
sha = r["sha"]
print(f"File size: {len(content)} chars")
print("First 1000 chars:")
print(content[:1000])
