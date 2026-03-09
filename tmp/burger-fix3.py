import urllib.request, json, base64, os

token = os.environ.get("GITHUB_TOKEN", "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")
h = {"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json"}

r = json.loads(urllib.request.urlopen(urllib.request.Request(
    "https://api.github.com/repos/Minicon-eG/website-tv-dahn/contents/src/app/page.tsx?ref=main",
    headers=h)).read())
code = base64.b64decode(r["content"]).decode("utf-8")
sha = r["sha"]

# Use exact from debug output
target = """          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}"""

replacement = """          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",justifyContent:"center"}}>
            <span style={{color:"white",fontSize:"0.7rem",fontWeight:600,whiteSpace:"nowrap"}}>TV DAHN<br/>1910 e.V.</span>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
            <span style={{color:"white",fontSize:"0.7rem",fontWeight:600,whiteSpace:"nowrap"}}>TV DAHN<br/>1910 e.V.</span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}"""

if target in code:
    code = code.replace(target, replacement, 1)
    print("Replaced!")
    enc = base64.b64encode(code.encode("utf-8")).decode()
    data = {"message": "feat: Burger menu with TV DAHN logos (mobile)", "content": enc, "sha": sha, "branch": "main"}
    req = urllib.request.Request(
        "https://api.github.com/repos/Minicon-eG/website-tv-dahn/contents/src/app/page.tsx",
        headers=h, method="PUT", data=json.dumps(data).encode())
    result = json.loads(urllib.request.urlopen(req).read())
    print("Committed: " + result["commit"]["sha"][:8])
else:
    print("Target not found")
    idx = code.find("Mobile Menu")
    print(repr(code[idx-80:idx]))
