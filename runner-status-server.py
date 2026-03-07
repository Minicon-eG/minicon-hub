import http.server
import urllib.request
import json

GH_TOKEN = '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'
EXPECTED = ['docker-runner-1','docker-runner-2','windows-runner-1','windows-runner-2']

class RunnerHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass
    def do_GET(self):
        try:
            req = urllib.request.Request(
                'https://api.github.com/orgs/Minicon-eG/actions/runners?per_page=10',
                headers={'Authorization': 'token ' + GH_TOKEN, 'Accept': 'application/vnd.github+json'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
            runners = {r['name']: r['status'] for r in data.get('runners', [])}
            all_ok = all(runners.get(r) == 'online' for r in EXPECTED)
            status = 200 if all_ok else 503
            body = json.dumps({'status': 'ok' if all_ok else 'degraded', 'runners': runners}).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', 3099), RunnerHandler)
    print('Runner status server on :3099')
    server.serve_forever()
