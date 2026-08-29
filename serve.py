#!/usr/bin/env python3
import http.server
import socketserver
import os

# Change to the correct directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🎉 VETERINARY WELFARE APP RUNNING!")
    print(f"🌐 Open: http://localhost:{PORT}")
    print(f"📱 Works on ANY device with browser")
    print(f"✨ Hindi-First Design • Rural Focus")
    print(f"🚀 Press Ctrl+C to stop")
    print("-" * 50)
    httpd.serve_forever()
