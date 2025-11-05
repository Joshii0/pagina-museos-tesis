import json
import urllib.request
import urllib.error

def test_api():
    url = 'http://localhost:5000/contacto'
    data = {
        'nombre': 'Test Usuario',
        'email': 'test@example.com',
        'telefono': '123-456-7890',
        'asunto': 'Prueba de conexión',
        'mensaje': 'Este es un mensaje de prueba para verificar que la API funciona correctamente.',
        'museo': 'TestMuseo'
    }

    try:
        # Convertir datos a JSON
        json_data = json.dumps(data).encode('utf-8')

        # Crear la petición
        req = urllib.request.Request(
            url,
            data=json_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        # Enviar la petición
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ API Response:", result)

            if result.get('success'):
                print("✅ Mensaje enviado correctamente!")
            else:
                print("❌ Error:", result.get('message'))

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        try:
            error_data = json.loads(e.read().decode('utf-8'))
            print("Error details:", error_data)
        except:
            print("No se pudo leer el detalle del error")

    except urllib.error.URLError as e:
        print(f"❌ URL Error: {e.reason}")
        print("💡 Asegúrate de que el servidor Flask esté corriendo con 'py app.py'")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == '__main__':
    test_api()
