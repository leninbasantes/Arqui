import requests
from datetime import datetime
import getpass
from tabulate import tabulate


def obtener_id_usuario(uri_login, body):
    try:
        response = requests.post(uri_login, json=body)
        if response.status_code == 200:
            return response.json()["userId"]
        else:
            print(
                f"Error al obtener el ID de usuario. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def obtener_datos_partidos(uri_partidos):
    try:
        response = requests.get(uri_partidos)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"Error al obtener los datos de partidos. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def mostrar_partidos(partidos):
    if partidos:
        headers = ["CODIGO", "EQUIPO LOCAL", "EQUIPO VISITA", "FECHA", "LUGAR"]
        table_data = []
        for partido in partidos:
            table_data.append([
                partido["CODIGO"],
                partido["EQUIPO_LOCAL"],
                partido["EQUIPO_VISITA"],
                partido["FECHA"],
                partido["LUGAR"]
            ])

        print(tabulate(table_data, headers, tablefmt="grid"))
    else:
        print("No se encontraron datos de partidos.")


def obtener_localidades(uri_localidades, partido_codigo):
    try:
        body_localidades = {
            "codigo": partido_codigo
        }
        response = requests.post(uri_localidades, json=body_localidades)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"Error al obtener las localidades del partido. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def mostrar_info_partido(info_partido):
    if info_partido:
        partido = info_partido["partido"]
        localidades = info_partido["localidades"]

        print("Información del Partido:")
        print("CODIGO:", partido["codigo"])
        print("EQUIPO LOCAL:", partido["equipo_local"])
        print("EQUIPO VISITA:", partido["equipo_visita"])
        print("FECHA:", partido["fecha"])
        print("LUGAR:", partido["lugar"])

        print("\nInformación de las Localidades:")
        headers = ["CODIGO_LOCALIDAD", "LOCALIDAD", "DISPONIBILIDAD", "PRECIO"]
        table_data = []
        for localidad in localidades:
            table_data.append([
                localidad["CODIGO_LOCALIDAD"],
                localidad["LOCALIDAD"],
                localidad["DISPONIBILIDAD"],
                localidad["PRECIO"]
            ])

        print(tabulate(table_data, headers, tablefmt="grid"))
        print("--------------------------------------")
    else:
        print("No se encontró información del partido o localidades.")


def crear_factura(uri_crear_factura, body_factura):
    try:
        response = requests.post(uri_crear_factura, json=body_factura)
        if response.status_code == 200:
            return response.text
        else:
            print(
                f"Error al crear la factura. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def crear_usuario(uri_crear_usuario, body):
    try:
        response = requests.post(uri_crear_usuario, json=body)
        if response.status_code == 200:
            return response.json()["userId"]
        else:
            print(
                f"Error al crear el usuario. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def obtener_compras(uri_historial, body_historial):
    try:
        response = requests.post(uri_historial, json=body_historial)
        if response.status_code == 200:
            return response.json()
        else:
            print(
                f"Error al obtener las compras. Código de respuesta: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
        return None


def mostrar_compras(compras):
    if compras:
        for compra in compras:
            partido = compra["partido"]
            verificador = compra["verificador"]
            localidades = compra["localidades"]

            print("Partido:")
            print("CODIGO:", partido["codigo"])
            print("EQUIPO LOCAL:", partido["equipoLocal"])
            print("EQUIPO VISITA:", partido["equipoVisita"])
            print("FECHA:", partido["fecha"])
            print("--------------------------------------")

            headers = ["LOCALIDAD", "CANTIDAD", "PRECIO", "TOTAL"]
            table_data = []
            for localidad in localidades:
                table_data.append([
                    localidad["localidad"],
                    localidad["cantidad"],
                    localidad["precio"],
                    localidad["total"]
                ])

            print(tabulate(table_data, headers, tablefmt="grid"))
            print("--------------------------------------")
            print("VERIFICADOR:", verificador)
            print("\n")
    else:
        print("No se encontraron compras.")


if __name__ == "__main__":
    uri_login = "https://iot.constecoin.com/api/shop/login"
    uri_crear_usuario = "https://iot.constecoin.com/api/shop/singin"
    uri_partidos = "https://iot.constecoin.com/api/shop/partidos"
    uri_localidades = "https://iot.constecoin.com/api/shop/obtenerLocalidades"
    uri_crear_factura = "https://iot.constecoin.com/api/shop/crearFactura"
    uri_historial = "https://iot.constecoin.com/api/shop/historial"

    # Crear nuevo usuario
    crear_usuario_opcion = input("¿Desea crear un nuevo usuario? (S/N): ")
    if crear_usuario_opcion.lower() == "s":
        nombre_usuario_nuevo = input("Ingrese el nombre de usuario: ")
        password_nuevo = getpass.getpass("Ingrese la contraseña: ")

        body_usuario_nuevo = {
            "nombre": nombre_usuario_nuevo,
            "password": password_nuevo
        }

        nuevo_usuario_id = crear_usuario(uri_crear_usuario, body_usuario_nuevo)
        if nuevo_usuario_id is not None:
            print("Usuario creado exitosamente. ID de usuario:", nuevo_usuario_id)
        else:
            print("No se pudo crear el usuario.")

    print()  # Salto de línea

    # Validación de credenciales
    user_id = None
    while user_id is None:
        nombre_usuario = input("Ingresa tu nombre de usuario: ")
        password = getpass.getpass("Ingresa tu contraseña: ")

        body_login = {
            "nombre": nombre_usuario,
            "password": password
        }

        user_id = obtener_id_usuario(uri_login, body_login)
        if user_id is None:
            print("Usuario o clave incorrecta. Inténtalo nuevamente.")

    print("ID de usuario obtenido:", user_id)

    continuar_comprando = True
    while continuar_comprando:
        print("1. Ver partidos")
        print("2. Ver compras")
        opcion_menu = input("Selecciona una opción: ")

        if opcion_menu == "1":
            partidos = obtener_datos_partidos(uri_partidos)
            mostrar_partidos(partidos)

            # Selección del partido
            partido_codigo = int(
                input("Seleccione Partido (Ingrese el CODIGO del partido): "))
            info_partido = obtener_localidades(uri_localidades, partido_codigo)
            mostrar_info_partido(info_partido)

            # Carrito de compras
            carrito = []

            while True:
                # Selección de localidad y cantidad
                codigo_localidad = int(
                    input("Ingrese el CODIGO_LOCALIDAD de la localidad que desea comprar: "))
                cantidad = int(
                    input("Ingrese la cantidad de entradas que desea comprar: "))

                localidad_seleccionada = next(
                    (localidad for localidad in info_partido["localidades"] if localidad["CODIGO_LOCALIDAD"] == codigo_localidad), None)
                if localidad_seleccionada is not None:
                    carrito.append({
                        "localidad": localidad_seleccionada,
                        "cantidad": cantidad
                    })
                    print("Localidad agregada al carrito.")

                opcion = input(
                    "Presione 1 para seguir comprando otra localidad, 2 para comprar o 3 para ver otros partidos: ")
                if opcion == "2":
                    break
                elif opcion == "3":
                    continuar_comprando = False
                    break

            if len(carrito) > 0:
                body_factura = {
                    "fecha": "2023-07-13 00:00:00",
                    "usuario": user_id,
                    "codigoPartido": partido_codigo,
                    "localidades": [
                        {
                            "CODIGO_LOCALIDAD": item["localidad"]["CODIGO_LOCALIDAD"],
                            "CANTIDAD": item["cantidad"]
                        }
                        for item in carrito
                    ]
                }

                factura_creada = crear_factura(uri_crear_factura, body_factura)

                if factura_creada is not None:
                    print("\n---------------Factura---------------")
                    print("ID del usuario:", user_id)
                    print("Nombre del usuario:", nombre_usuario)
                    partido = info_partido["partido"]
                    fecha_actual = datetime.now()
                    fecha_formateada = fecha_actual.strftime("%d/%m/%Y")
                    print("Fecha de facturación:", fecha_formateada)
                    print("-------------------------------------")
                    print("          Detalle de Factura")
                    print("CODIGO:", partido["codigo"])
                    print("EQUIPO LOCAL:", partido["equipo_local"])
                    print("EQUIPO VISITA:", partido["equipo_visita"])
                    print("FECHA:", partido["fecha"])
                    print("LUGAR:", partido["lugar"])

                    for item in carrito:
                        localidad_seleccionada = item["localidad"]
                        cantidad = item["cantidad"]
                        print("\nCODIGO_LOCALIDAD:",
                              localidad_seleccionada["CODIGO_LOCALIDAD"])
                        print("LOCALIDAD:",
                              localidad_seleccionada["LOCALIDAD"])
                        precio_por_cantidad = localidad_seleccionada["PRECIO"] * cantidad
                        impuesto = precio_por_cantidad * 0.12
                        subtotal = precio_por_cantidad + impuesto
                        print("-------------------------------------")
                        print("SUBTOTAL:", subtotal)
                        print("IVA %:", impuesto)
                        print("-------------------------------------")
                        print("TOTAL A PAGAR:", subtotal + impuesto)

                    print("\nGracias por su compra")
                else:
                    print("No se pudo crear la factura.")
            else:
                print(
                    "No hay localidades en el carrito. Volviendo a seleccionar partidos.")

        elif opcion_menu == "2":
            body_historial = {
                "usuario": user_id
            }
            compras = obtener_compras(uri_historial, body_historial)
            mostrar_compras(compras)

        else:
            print("Opción inválida. Intente nuevamente.")
