import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import API from "../../services/api-service";
import "./styles.css";
import Swal from "sweetalert2";
import Imagen from "../../image/monster.gif";
import { getUser } from "../../services/auth-service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Localidades = () => {
  const [datos, setDatos] = useState({});
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMensaje(""); // Reiniciar el mensaje de error al cerrar el modal
  };
  const [localidades, setLocalidades] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");
  const query = new URLSearchParams(useLocation().search);
  let history = useNavigate();
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [itemsComprados, setItemsComprados] = useState([]);
  const [metodoPago, setMetodoPago] = useState("");
  const [numeroTransferencia, setNumeroTransferencia] = useState("");
  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    codigoSeguridad: "",
  });

  const handleLocalidadChange = (event) => {
    const localidadId = parseInt(event.target.value);
    const localidad = localidades.find(
      (loc) => loc.CODIGO_LOCALIDAD === localidadId
    );
    setLocalidadSeleccionada(localidad);
    setCantidad(1); // Reiniciar la cantidad al cambiar la localidad
  };

  const handleCantidadChange = (event) => {
    const newCantidad = parseInt(event.target.value);
    setCantidad(
      newCantidad > localidadSeleccionada.DISPONIBILIDAD
        ? localidadSeleccionada.DISPONIBILIDAD
        : newCantidad
    );
  };

  const handleCompraClick = () => {
    if (localidadSeleccionada) {
      const itemExistente = itemsComprados.find(
        (item) => item.localidad === localidadSeleccionada.LOCALIDAD
      );
      if (itemExistente) {
        if (
          itemExistente.cantidad + cantidad >
          localidadSeleccionada.DISPONIBILIDAD
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No puedes agregar más cantidad. Excede la disponibilidad.",
          });
          return;
        }
        itemExistente.cantidad += cantidad;
      } else {
        const itemComprado = {
          localidad: localidadSeleccionada.LOCALIDAD,
          precio: localidadSeleccionada.PRECIO,
          id: localidadSeleccionada.CODIGO_LOCALIDAD,
          cantidad: cantidad,
        };
        setItemsComprados([...itemsComprados, itemComprado]);
      }
      setLocalidadSeleccionada(null);
      setCantidad(1);
    }
  };

  const handleIncrementarCantidad = (localidad) => {
    const itemExistente = itemsComprados.find(
      (item) => item.localidad === localidad
    );
    const localidadSeleccionada = localidades.find(
      (loc) => loc.LOCALIDAD === localidad
    );
    if (itemExistente && localidadSeleccionada) {
      if (itemExistente.cantidad + 1 > localidadSeleccionada.DISPONIBILIDAD) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No puedes agregar más cantidad. Excede la disponibilidad.",
        });
        return;
      }
      itemExistente.cantidad += 1;
      setItemsComprados([...itemsComprados]);
    }
  };

  const handleDecrementarCantidad = (localidad) => {
    const itemExistente = itemsComprados.find(
      (item) => item.localidad === localidad
    );
    if (itemExistente && itemExistente.cantidad > 1) {
      itemExistente.cantidad -= 1;
      setItemsComprados([...itemsComprados]);
    }
  };

  const handleEliminarCantidad = (localidad) => {
    const nuevosItems = itemsComprados.filter(
      (item) => item.localidad !== localidad
    );
    setItemsComprados(nuevosItems);
  };

  const handleAdquirirClick = () => {
    setOpen(true);
  };

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
  };

  const handleNumeroTransferenciaChange = (event) => {
    setNumeroTransferencia(event.target.value);
  };

  const handleDatosTarjetaChange = (event) => {
    const { name, value } = event.target;
    setDatosTarjeta((prevDatosTarjeta) => ({
      ...prevDatosTarjeta,
      [name]: value,
    }));
  };

  const handleRealizarPagoClick = () => {
    if (!metodoPago) {
      setErrorMensaje("Debe seleccionar un método de pago");
      return;
    }
    
    if (metodoPago === "transferencia" && !numeroTransferencia) {
      setErrorMensaje("Debe llenar todos los campos");
      return;
    }
  
    if (metodoPago === "tarjeta" && (!datosTarjeta.numeroTarjeta || !datosTarjeta.nombreTitular || !datosTarjeta.fechaExpiracion || !datosTarjeta.codigoSeguridad)) {
      setErrorMensaje("Debe llenar todos los campos");
      return;
    }
    
    setErrorMensaje(""); // Limpiar el mensaje de error si no hay problemas
    
    comprarLocalidad();
  };

  const validateTarjetaDatos = () => {
    const { numeroTarjeta, nombreTitular, fechaExpiracion, codigoSeguridad } =
      datosTarjeta;
    return (
      numeroTarjeta !== "" &&
      nombreTitular !== "" &&
      fechaExpiracion !== "" &&
      codigoSeguridad !== ""
    );
  };



  const backup = () => {
    history("/home");
  };

  useEffect(() => {
    const id = query.get("id");
    let Documento = {
      codigo: id,
    };
    console.log(Documento);
    API.obtenerLocalidades(Documento).then(
      (respuesta) => {
        setLocalidades(respuesta.localidades);
        setDatos(respuesta.partido);
        console.log(respuesta);
        console.log("Todo ok");
      },
      (error) => {
        console.log("Todo mal");
      }
    );
  }, []);

  const comprarLocalidad = () => {

    if (!metodoPago) {
      setErrorMensaje("Debe seleccionar un método de pago");
      return;
    }
    if (metodoPago === "transferencia" && !numeroTransferencia) {
      setErrorMensaje("Debe llenar todos los campos");
      return;
    }

    if (metodoPago === "tarjeta" && (!datosTarjeta.numeroTarjeta || !datosTarjeta.nombreTitular || !datosTarjeta.fechaExpiracion || !datosTarjeta.codigoSeguridad)) {
      setErrorMensaje("Debe llenar todos los campos");
      return;
    }
    handleClose()
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const segundos = fecha.getSeconds().toString().padStart(2, "0");

    const fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
    const idUser = getUser();
    const carrito = {
      fecha: fechaFormateada,
      usuario: idUser, // Aquí debes establecer el ID del usuario actual
      codigoPartido: datos.codigo,
      localidades: itemsComprados.map((item) => ({
        CODIGO_LOCALIDAD: item.id,
        CANTIDAD: item.cantidad,
      })),
    };

    Swal.fire({
      title: "¿Desea realizar la compra.?",
      showDenyButton: true,
      confirmButtonText: "Comprar",
      denyButtonText: `Cancelar`,
      width: 600,
      padding: "3em",
      color: "#716add",
      backdrop: `
        rgba(0,0,123,0.4)
        url(${Imagen})
        center top
        no-repeat
      `,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        API.generarFactura(carrito).then(
          (respuesta) => {
            Swal.fire("Compra realizada.!", "", "success");
            history(`/home`);
          },
          (error) => {
            Swal.fire("Error al comprar", "", "error");
            // console.log("Error al enviar la solicitud:", error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Cancelacion de compra", "", "info");
      }
    });

    console.log(carrito);
  };

  const calcularSubtotal = () => {
    let subtotal = 0;
    itemsComprados.forEach((item) => {
      subtotal += item.cantidad * item.precio;
    });
    return subtotal;
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const impuesto = subtotal * 0.12;
    const total = subtotal + impuesto;
    return total.toFixed(2);
  };

  const calcularIva = () => {
    const subtotal = calcularSubtotal();
    const impuesto = subtotal * 0.12;
    return impuesto.toFixed(2);
  };

  return (
    <>
      <div className="Contenedor">
        {Object.keys(datos).length > 0 ? (
          <>
            <h3>
              {datos.equipo_local}{" "}
              <img
                src={`https://aiot.constecoin.com/repositorio/images/${datos.equipo_local}.png`}
                alt="Monster"
                className="small-image"
              />{" "}
              vs{" "}
              <img
                src={`https://aiot.constecoin.com/repositorio/images/${datos.equipo_visita}.png`}
                alt="Monster"
                className="small-image"
              />{" "}
              {datos.equipo_visita}
            </h3>
            <div>
              Fecha: {datos.fecha.split("T")[0].split("-").reverse().join("/")}
            </div>
            <div>
              Hora: {datos.fecha.split("T")[1].split(":").slice(0, 2).join(":")}
            </div>
            <div>Lugar: {datos.lugar}</div>
            <div>
              <label className="label1" htmlFor="localidad">
                Selecciona la localidad:
              </label>
              <select
                className="select1"
                id="localidad"
                onChange={handleLocalidadChange}
                value={
                  localidadSeleccionada
                    ? localidadSeleccionada.CODIGO_LOCALIDAD
                    : ""
                }
              >
                <option value="">Seleccionar</option>
                {localidades.map((localidad) => (
                  <option
                    key={localidad.CODIGO_LOCALIDAD}
                    value={localidad.CODIGO_LOCALIDAD}
                  >
                    {localidad.LOCALIDAD}
                  </option>
                ))}
              </select>
              {localidadSeleccionada && (
                <div>
                  <h4>Información de la localidad:</h4>
                  <p>Valor: ${localidadSeleccionada.PRECIO}</p>
                  <p>Disponibilidad: {localidadSeleccionada.DISPONIBILIDAD}</p>
                  <label className="label1" htmlFor="cantidad">
                    Cantidad:
                  </label>
                  <input
                    className="input1"
                    id="cantidad"
                    type="number"
                    min="0"
                    max={localidadSeleccionada.DISPONIBILIDAD}
                    value={cantidad}
                    onChange={handleCantidadChange}
                  />
                  <button className="boton1" onClick={handleCompraClick}>
                    Añadir al carrito
                  </button>
                </div>
              )}
            </div>

            {itemsComprados.length > 0 && (
              <table className="tablaL">
                <thead>
                  <tr className="cofi">
                    <th className="ths">Localidad</th>
                    <th className="ths">Precio</th>
                    <th className="ths">Cantidad</th>
                    <th className="ths">Valor</th>
                    <th className="ths">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsComprados.map((item, index) => (
                    <tr className="cofi" key={index}>
                      <td className="tds">{item.localidad}</td>
                      <td className="tds">${item.precio}</td>
                      <td className="tds">{item.cantidad}</td>
                      <td className="tds">${item.cantidad * item.precio}</td>
                      <td className="tds">
                        <button
                          className="boton1"
                          onClick={() =>
                            handleIncrementarCantidad(item.localidad)
                          }
                        >
                          +
                        </button>
                        <button
                          className="boton1"
                          onClick={() =>
                            handleDecrementarCantidad(item.localidad)
                          }
                        >
                          -
                        </button>
                        <button
                          className="boton1"
                          onClick={() => handleEliminarCantidad(item.localidad)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="cofi">
                    <td className="tds" colSpan="3">
                      Subtotal:
                    </td>
                    <td className="tds">${calcularSubtotal()}</td>
                    <td className="tds"></td>
                  </tr>
                  <tr className="cofi">
                    <td className="tds" colSpan="3">
                      Iva:
                    </td>
                    <td className="tds">${calcularIva()}</td>
                    <td className="tds"></td>
                  </tr>
                  <tr className="cofi">
                    <td className="tds" colSpan="3">
                      <strong>Total:</strong>
                    </td>
                    <td className="tds">
                      <strong>${calcularTotal()}</strong>
                    </td>
                    <td className="tds"></td>
                  </tr>
                  <tr className="cofi">
                    <td className="tds" colSpan="5">
                      <button className="boton1" onClick={handleAdquirirClick}>
                        Comprar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            <button className="boton1" onClick={backup}>
              Regresar
            </button>
          </>
        ) : null}
      </div>

   <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style} className="modal-container">
    <Typography id="modal-modal-title" variant="h6" component="h2" className="modal-title">
      Método de Pago
    </Typography>
    <div className="radio-container">
      <input
        type="radio"
        id="transferencia"
        name="metodo-pago"
        value="transferencia"
        checked={metodoPago === "transferencia"}
        onChange={handleMetodoPagoChange}
        className="radio-input"
      />
      <label htmlFor="transferencia" className="radio-label">Transferencia</label>
    </div>
    {metodoPago === "transferencia" && (
      <div className="input-container">
        <label htmlFor="numero-transferencia" className="input-label">
          Ingrese el número de transferencia:
        </label>
        <input
          type="text"
          id="numero-transferencia"
          value={numeroTransferencia}
          onChange={handleNumeroTransferenciaChange}
          className="input-text"
        />
      </div>
    )}
    <div className="radio-container">
      <input
        type="radio"
        id="tarjeta"
        name="metodo-pago"
        value="tarjeta"
        checked={metodoPago === "tarjeta"}
        onChange={handleMetodoPagoChange}
        className="radio-input"
      />
      <label htmlFor="tarjeta" className="radio-label">Tarjeta de Crédito/Débito</label>
    </div>
    {metodoPago === "tarjeta" && (
      <div className="input-container">
        <label htmlFor="numero-tarjeta" className="input-label">Número de Tarjeta:</label>
        <input
          type="text"
          id="numero-tarjeta"
          name="numeroTarjeta"
          value={datosTarjeta.numeroTarjeta}
          onChange={handleDatosTarjetaChange}
          className="input-text"
        />
        <label htmlFor="nombre-titular" className="input-label">Nombre del Titular:</label>
        <input
          type="text"
          id="nombre-titular"
          name="nombreTitular"
          value={datosTarjeta.nombreTitular}
          onChange={handleDatosTarjetaChange}
          className="input-text"
        />
        <label htmlFor="fecha-expiracion" className="input-label">Fecha de Expiración:</label>
        <input
          type="date"
          id="fecha-expiracion"
          name="fechaExpiracion"
          value={datosTarjeta.fechaExpiracion}
          onChange={handleDatosTarjetaChange}
          className="input-text"
        />
        <label htmlFor="codigo-seguridad" className="input-label">Código de Seguridad:</label>
        <input
          type="text"
          id="codigo-seguridad"
          name="codigoSeguridad"
          value={datosTarjeta.codigoSeguridad}
          onChange={handleDatosTarjetaChange}
          className="input-text"
        />
      </div>
    )}
    <Button onClick={comprarLocalidad} className="button-realizar-pago">Realizar Pago</Button>
    {errorMensaje && <p className="error-message">{errorMensaje}</p>} {/* Mostrar el mensaje de error si existe */}
  </Box>
</Modal>

    </>
  );
};

export default Localidades;
