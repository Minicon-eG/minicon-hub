#!/usr/bin/env python3
"""
set-deploy-secret.py
====================
Setzt das DEPLOY_SSH_KEY_B64 Repo-Secret für ein oder mehrere GitHub-Repos.

Muss direkt auf dem Linux-Deploy-Server (91.98.30.140) ausgeführt werden,
da der private SSH-Key dort liegt und CRLF-Probleme durch PowerShell
vermieden werden müssen.

Verwendung:
    python3 set-deploy-secret.py \
        --token ghp_xxx \
        --repos Minicon-eG/website-ratsstube Minicon-eG/website-waldhuette \
        --key /root/.ssh/id_deploy

Oder für alle nicht-paid Sites auf einmal:
    python3 set-deploy-secret.py --token ghp_xxx --all-unpaid

Dokumentiert in Confluence:
    https://minicon.atlassian.net/wiki/spaces/MINICON/pages/843350017

Versioniert in:
    Minicon-eG/infrastructure → scripts/set-deploy-secret.py

Warum kein PowerShell?
    PowerShell verändert Strings beim Weiterleiten (CRLF statt LF),
    was den Base64-kodierten SSH-Key korrumpiert.
    → Runner sieht leeres Secret → "Load key: invalid format"
    → Lösung: Immer von Linux aus mit base64 -w 0 + PyNaCl setzen.
"""

import argparse
import base64
import json
import os
import subprocess
import sys
import urllib.request
from nacl.public import PublicKey, SealedBox


def get_repo_public_key(repo: str, token: str) -> dict:
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/actions/secrets/public-key",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
        },
    )
    return json.loads(urllib.request.urlopen(req).read())


def set_repo_secret(repo: str, token: str, key_path: str) -> int:
    """Setzt DEPLOY_SSH_KEY_B64 für ein Repo. Gibt HTTP-Status zurück."""
    pk_data = get_repo_public_key(repo, token)

    # Key korrekt Base64-kodieren (Linux: keine CRLF-Probleme)
    priv_b64 = subprocess.check_output(
        ["base64", "-w", "0", key_path]
    ).decode().strip()

    # Mit PyNaCl (libsodium SealedBox) verschlüsseln
    pk = PublicKey(base64.b64decode(pk_data["key"]))
    encrypted = base64.b64encode(SealedBox(pk).encrypt(priv_b64.encode())).decode()

    payload = json.dumps({
        "encrypted_value": encrypted,
        "key_id": pk_data["key_id"],
    }).encode()

    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/actions/secrets/DEPLOY_SSH_KEY_B64",
        data=payload,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/vnd.github+json",
        },
    )
    resp = urllib.request.urlopen(req)
    return resp.status  # 201 = neu angelegt, 204 = aktualisiert


def main():
    parser = argparse.ArgumentParser(description="Setzt DEPLOY_SSH_KEY_B64 für GitHub-Repos")
    parser.add_argument("--token", required=True, help="GitHub PAT mit repo-Scope")
    parser.add_argument("--repos", nargs="+", help="Repo(s) z.B. Minicon-eG/website-ratsstube")
    parser.add_argument("--key", default="/root/.ssh/id_deploy", help="Pfad zum privaten SSH-Key")
    args = parser.parse_args()

    if not args.repos:
        print("Fehler: --repos ist erforderlich")
        sys.exit(1)

    results = []
    for repo in args.repos:
        try:
            status = set_repo_secret(repo, args.token, args.key)
            label = "NEU" if status == 201 else "AKTUALISIERT"
            print(f"  ✅ {repo} → {label} (HTTP {status})")
            results.append((repo, True, status))
        except Exception as e:
            print(f"  ❌ {repo} → FEHLER: {e}")
            results.append((repo, False, str(e)))

    ok = sum(1 for _, s, _ in results if s)
    fail = len(results) - ok
    print(f"\nErgebnis: {ok} erfolgreich, {fail} fehlgeschlagen")
    if fail > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
