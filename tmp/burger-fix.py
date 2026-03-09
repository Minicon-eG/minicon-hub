import urllib.request, json, base64, os, sys

token = os.environ.get("GITHUB_TOKEN", "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")
h = {"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json"}

# Get main file
r = json.loads(urllib.request.urlopen(urllib.request.Request(
    "https://api.github.com/repos/Minicon-eG/website-tv-dahn/contents/src/app/page.tsx?ref=main",
    headers=h)).read())
code = base64.b64decode(r["content"]).decode("utf-8")
sha = r["sha"]

# Find and replace the button
old_btn = '<Menu size={26} />\n        </button>'
new_btn = '''<Menu size={26} />
        </button>
        <!-- BURGER_WRAPPER -->
'''

if old_btn in code:
    code = code.replace(old_btn, new_btn, 1)
    
    # Add the wrapper div before the button closing
    wrapper = '''<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <span style={{color:"white",fontSize:"0.7rem",fontWeight:600}}>TV DAHN 1910 e.V.</span>
            <!-- BURGER_WRAPPER -->
            <span style={{color:"white",fontSize:"0.7rem",fontWeight:600}}>TV DAHN 1910 e.V.</span>'''
    
    code = code.replace('<!-- BURGER_WRAPPER -->', wrapper)
    
    # Remove the extra closing tag we added
    code = code.replace('</button>\n        <!-- BURGER_WRAPPER -->', '</button>')
    
    enc = base64.b64encode(code.encode("utf-8")).decode()
    data = {"message": "feat: Burger menu with TV DAHN logos (mobile)", "content": enc, "sha": sha, "branch": "main"}
    req = urllib.request.Request(
        "https://api.github.com/repos/Minicon-eG/website-tv-dahn/contents/src/app/page.tsx",
        headers=h, method="PUT", data=json.dumps(data).encode())
    result = json.loads(urllib.request.urlopen(req).read())
    print("SUCCESS: " + result["commit"]["sha"][:8])
else:
    print("Pattern not found, searching...")
    # Debug
    idx = code.find("Menu size")
    if idx > 0:
        print(repr(code[idx-20:idx+50]))
