import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('DatosBase/museo.db')
cursor = conn.cursor()

# Consultar la estructura de la tabla contactos
cursor.execute('PRAGMA table_info(contactos)')
columns = cursor.fetchall()
print('Estructura de la tabla contactos:')
print('=' * 50)
for col in columns:
    print(f'{col[1]} ({col[2]})')
print()

# Consultar todos los mensajes de contacto
cursor.execute('SELECT id, nombre, email, telefono, asunto, mensaje, fecha, museo FROM contactos ORDER BY fecha DESC')
rows = cursor.fetchall()

print('Mensajes en la base de datos:')
print('=' * 50)

if rows:
    for row in rows:
        print(f'ID: {row[0]}')
        print(f'Nombre: {row[1]}')
        print(f'Email: {row[2]}')
        print(f'Teléfono: {row[3]}')
        print(f'Asunto: {row[4]}')
        print(f'Mensaje: {row[5]}')
        print(f'Fecha: {row[6]}')
        print(f'Museo: {row[7]}')
        print('-' * 30)
else:
    print('No hay mensajes en la base de datos.')

conn.close()
