from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database path
DB_PATH = 'DatosBase/museo.db'

def get_db_connection():
    """Create a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with contact form table"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create contacts table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT,
            asunto TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            museo TEXT DEFAULT 'MuseoCiudad'
        )
    ''')

    # Add telefono column if it doesn't exist (for existing databases)
    try:
        cursor.execute('ALTER TABLE contactos ADD COLUMN telefono TEXT')
    except sqlite3.OperationalError:
        pass  # Column already exists

    conn.commit()
    conn.close()

@app.route('/contacto', methods=['POST'])
def submit_contact():
    """Handle contact form submission"""
    try:
        data = request.get_json()

        nombre = data.get('nombre')
        email = data.get('email')
        telefono = data.get('telefono')
        asunto = data.get('asunto')
        mensaje = data.get('mensaje')
        museo = data.get('museo', 'MuseoCiudad')  # Default to MuseoCiudad

        # Validate required fields
        if not all([nombre, email, asunto, mensaje]):
            return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'}), 400

        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO contactos (nombre, email, telefono, asunto, mensaje, museo)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nombre, email, telefono, asunto, mensaje, museo))

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Mensaje enviado correctamente'}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al procesar el mensaje'}), 500

@app.route('/contactos', methods=['GET'])
def get_contacts():
    """Get all contact messages (for admin purposes)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM contactos ORDER BY fecha DESC')
        contacts = cursor.fetchall()

        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                'id': contact['id'],
                'nombre': contact['nombre'],
                'email': contact['email'],
                'telefono': contact['telefono'],
                'asunto': contact['asunto'],
                'mensaje': contact['mensaje'],
                'fecha': contact['fecha'],
                'museo': contact['museo']
            })

        conn.close()
        return jsonify(contacts_list), 200

    except Exception as e:
        return jsonify({'error': 'Error al obtener contactos'}), 500

@app.route('/contactos', methods=['DELETE'])
def delete_all_contacts():
    """Delete all contact messages"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM contactos')
        # Reset auto-increment counter
        cursor.execute('DELETE FROM sqlite_sequence WHERE name="contactos"')

        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Todos los formularios han sido eliminados'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error al eliminar formularios'}), 500

if __name__ == '__main__':
    # Initialize database
    init_db()
    print("Base de datos inicializada. Servidor corriendo en http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
