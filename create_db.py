import sqlite3
import os

# Ensure the DatosBase directory exists
if not os.path.exists('DatosBase'):
    os.makedirs('DatosBase')

# Create a SQLite database in the DatosBase folder
conn = sqlite3.connect('DatosBase/museo.db')

# Create a cursor object
cursor = conn.cursor()

# Create a sample table for museums
cursor.execute('''
CREATE TABLE IF NOT EXISTS museos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    ubicacion TEXT
)
''')

# Insert some sample data
cursor.execute("INSERT INTO museos (nombre, descripcion, ubicacion) VALUES (?, ?, ?)", ('Museo de la Ciudad', 'Museo dedicado a la historia de la ciudad', 'Jesús María'))
cursor.execute("INSERT INTO museos (nombre, descripcion, ubicacion) VALUES (?, ?, ?)", ('Museo Torres Céspedes', 'Museo en la Torre Céspedes', 'Jesús María'))

# Commit the changes
conn.commit()

# Close the connection
conn.close()

print("Base de datos SQLite creada en DatosBase/museo.db con tabla de museos y datos de ejemplo.")
