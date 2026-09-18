import http.server
import socketserver
import webbrowser
import os

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

# Set current directory to workspace
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"==================================================")
print(f"   AETHER BANK | BANCA DIGITAL NEÓN SPEI v3.0     ")
print(f"   Servidor activo en: http://localhost:{PORT}   ")
print(f"==================================================")

webbrowser.open(f"http://localhost:{PORT}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor cerrado correctamente.")
