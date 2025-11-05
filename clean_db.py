import sqlite3
import os

# Ruta a la base de datos
db_path = 'DatosBase/museo.db'

# Verificar que la base de datos existe
if not os.path.exists(db_path):
    print("❌ La base de datos no existe.")
    exit(1)

# Conectar a la base de datos
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Contar registros antes de limpiar
    cursor.execute("SELECT COUNT(*) FROM contactos")
    count_before = cursor.fetchone()[0]
    print(f"📊 Registros antes de limpiar: {count_before}")

    # Limpiar la tabla contactos
    cursor.execute("DELETE FROM contactos")

    # Resetear el autoincremento del ID (opcional)
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='contactos'")

    # Confirmar cambios
    conn.commit()

    # Contar registros después de limpiar
    cursor.execute("SELECT COUNT(*) FROM contactos")
    count_after = cursor.fetchone()[0]
    print(f"🧹 Registros después de limpiar: {count_after}")
    print("✅ Base de datos limpiada exitosamente!")

except sqlite3.Error as e:
    print(f"❌ Error al limpiar la base de datos: {e}")

finally:
    # Cerrar conexión
    conn.close()
