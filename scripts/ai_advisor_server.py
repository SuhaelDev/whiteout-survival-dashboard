#!/usr/bin/env python3
import argparse
import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class AdvisorHandler(SimpleHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _proxy_state(self, method, body=None):
        import urllib.request
        import urllib.error
        
        url = "https://whiteout-survival-dashboard.vercel.app/api/state"
        headers = {}
        
        for k, v in self.headers.items():
            if k.lower() == "x-dashboard-sync-key":
                headers["X-Dashboard-Sync-Key"] = v
                
        if method == "PUT":
            headers["Content-Type"] = "application/json"
            
        req = urllib.request.Request(
            url,
            data=body,
            headers=headers,
            method=method
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                res_body = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(res_body)))
                self.end_headers()
                self.wfile.write(res_body)
        except urllib.error.HTTPError as error:
            res_body = error.read()
            self.send_response(error.code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(res_body)))
            self.end_headers()
            self.wfile.write(res_body)
        except Exception as error:
            self._send_json(500, {"error": str(error)})

    def do_GET(self):
        if self.path == "/api/state":
            self._proxy_state("GET")
            return
        super().do_GET()

    def do_PUT(self):
        if self.path == "/api/state":
            try:
                length = int(self.headers.get("Content-Length", "0"))
                body = self.rfile.read(length) if length > 0 else b"{}"
                self._proxy_state("PUT", body)
            except Exception as e:
                self._send_json(500, {"error": str(e)})
            return
        self._send_json(404, {"error": "Not Found"})

    def do_POST(self):
        if self.path != "/api/advisor":
            self._send_json(404, {"error": "Unknown endpoint"})
            return

        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            self._send_json(503, {"error": "OPENAI_API_KEY is not set for the local advisor server."})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            advice = call_openai_advisor(api_key, payload)
            self._send_json(200, {"advice": advice})
        except (ValueError, json.JSONDecodeError) as error:
            self._send_json(400, {"error": str(error)})
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            self._send_json(error.code, {"error": detail})
        except Exception as error:
            self._send_json(500, {"error": str(error)})


def call_openai_advisor(api_key, payload):
    model = os.getenv("OPENAI_MODEL", "gpt-5-mini")
    system = (
        "You are a Whiteout Survival upgrade advisor. Use only the dashboard JSON. "
        "Do not infer hidden current levels, hidden research nodes, or unavailable chest conversions. "
        "Treat deterministic affordability, costs, and gaps as authoritative. "
        "Return a concise prioritized plan with risks and data gaps."
    )
    body = {
        "model": model,
        "input": [
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(payload, separators=(",", ":"))},
        ],
        "max_output_tokens": 1000,
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        result = json.loads(response.read())
    return extract_response_text(result)


def extract_response_text(result):
    if result.get("output_text"):
        return result["output_text"]
    parts = []
    for item in result.get("output", []):
        for content in item.get("content", []):
            text = content.get("text")
            if text:
                parts.append(text)
    return "\n".join(parts) or json.dumps(result, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Serve the Whiteout dashboard with an optional LLM advisor endpoint.")
    parser.add_argument("--port", type=int, default=5173)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), AdvisorHandler)
    print(f"Serving dashboard with advisor endpoint at http://127.0.0.1:{args.port}/", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
