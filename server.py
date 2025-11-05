import http.server
import socketserver
import os
import webbrowser
from urllib.parse import unquote

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_POST(self):
        if self.path == '/contacto':
            # Leer los datos del POST
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            print(f"Datos recibidos: {post_data.decode('utf-8')}")

            # Responder
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"success": true, "message": "Mensaje recibido (simulado)"}')
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=8000):
    with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
        print(f"🚀 Servidor web corriendo en http://localhost:{port}")
        print("📁 Archivos servidos desde:", os.getcwd())
        print("💡 Abre las páginas HTML desde este servidor, NO desde el explorador de archivos")
        print("🔄 Presiona Ctrl+C para detener")

        # Abrir automáticamente el navegador con la página de contacto
        webbrowser.open(f'http://localhost:{port}/contacto.MuseoCiudad.html')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Servidor detenido")

if __name__ == '__main__':
    run_server()
