"""Run the local preview from this directory with caching disabled."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import json
import os
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        request_path = unquote(urlsplit(self.path).path)
        if any(
            part.startswith(".") or part in {"private", "uploads", "exports", "backups"}
            for part in request_path.split("/")
            if part
        ):
            self.send_error(403, "Hidden files are not served.")
            return
        if request_path == "/public-config.json":
            values = {}
            config = ROOT / ".env.local"
            if config.exists():
                for line in config.read_text().splitlines():
                    key, separator, value = line.partition("=")
                    if separator and key in {
                        "SUPABASE_URL",
                        "SUPABASE_PUBLISHABLE_KEY",
                    }:
                        values[key] = value.strip().strip('"').strip("'")
            url = os.environ.get("SUPABASE_URL", values.get("SUPABASE_URL", ""))
            key = os.environ.get(
                "SUPABASE_PUBLISHABLE_KEY", values.get("SUPABASE_PUBLISHABLE_KEY", "")
            )
            public = (
                {"supabaseUrl": url, "supabasePublishableKey": key}
                if key.startswith("sb_publishable_")
                else {}
            )
            data = json.dumps(public).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def send_head(self):
        parts = unquote(urlsplit(self.path).path).split("/")
        if any(
            part.startswith(".") or part in {"private", "uploads", "exports", "backups"}
            for part in parts
            if part
        ):
            self.send_error(403, "Private files are not served.")
            return None
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def list_directory(self, path):
        self.send_error(403, "Directory listing is disabled.")
        return None


class PreviewServer(ThreadingHTTPServer):
    # Each browser loads many independent modules. Keep concurrent test pages
    # from overflowing the socket server's default queue of five connections.
    request_queue_size = 128


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=5173)
    args = parser.parse_args()
    server = PreviewServer(
        ("127.0.0.1", args.port), partial(PreviewHandler, directory=str(ROOT))
    )
    print(
        f"GradApp student planner: http://127.0.0.1:{args.port}/ — 25 real programs, comparison, saved research and deadlines",
        flush=True,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
