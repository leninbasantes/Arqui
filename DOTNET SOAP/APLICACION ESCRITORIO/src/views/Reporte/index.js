import React, { useState, useEffect } from "react";
import API from "../../services/api-service";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getUser } from "../../services/auth-service";
import "./styles.css"; // Importa el archivo de estilos

const Reporte = () => {
  const query = new URLSearchParams(useLocation().search);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState({});
  let history = useNavigate();

  useEffect(() => {
    let iduser = getUser();
    setLoading(true);
    let documento = {
      usuario: iduser,
    };
    console.log("Este es");
    console.log(documento);
    toast
      .promise(
        API.obtenerHistorial(documento).then((response) => {
          console.log(response);
          setData(response);
        }),
        {
          loading: "Cargando...",
          success: <b>Datos cargados!</b>,
          error: (err) => <b>Error al cargar datos!</b>,
        }
      )
      .then(() => {
        setLoading(false);
      });
  }, []);

  const volver = () => {
    history("/");
  };

  const toggleDetalles = (index) => {
    setMostrarDetalles((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderTable = (item, index) => {
    const total = item.localidades
      .reduce((accumulator, localidad) => accumulator + localidad.total, 0)
      .toFixed(2);

    const fechaPatido = item.verificador;
    const fecha = new Date(fechaPatido);
    // Obtener la fecha formateada
    const fechaCompra = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}:${formatNumberWithLeadingZero(
      fecha.getMinutes()
    )}`;

    return (
      <div key={index} className="table-wrapper">

        <table className="partidos-table">
          <thead>
            <tr>
              <th>Equipo local</th>
              <th>Equipo visitante</th>
              <th>Fecha Partido</th>
              <th>Fecha Compra</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.partido.equipoLocal}</td>
              <td>{item.partido.equipoVisita}</td>
              <td>
                {item.partido.fecha
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}{" "}
                {item.partido.fecha
                  .split("T")[1]
                  .split(":")
                  .slice(0, 2)
                  .join(":")}
              </td>
              <td>{fechaCompra}</td>
              <td><strong>${total}</strong></td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          <button
            className="detalle-button"
            onClick={() => toggleDetalles(index)}
          >
            {mostrarDetalles[index] ? "Ocultar detalles" : "Detalles"}
          </button>
        </div>
        {mostrarDetalles[index] && renderLocalidadesTable(item, index)}
      </div>
    );
  };

  // Función auxiliar para formatear números con un cero a la izquierda si es necesario
  const formatNumberWithLeadingZero = (number) => {
    return number.toString().padStart(2, "0");
  };

  const renderLocalidadesTable = (item, index) => {
    const total = item.localidades
      .reduce((accumulator, localidad) => accumulator + localidad.total, 0)
      .toFixed(2);

    return (
      <table key={index} className="partidos-table">
        <thead>
          <tr>
            <th>Localidad</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {item.localidades.map((localidad, localidadIndex) => (
            <tr key={localidadIndex}>
              <td>{localidad.localidad}</td>
              <td>{localidad.cantidad}</td>
              <td>${localidad.total}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>${total}</strong></td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      <h3 style={{ textAlign: 'center',margin:'15px'}}>Historial de Compras</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>{renderTable(item, index)}</div>
        ))
      ) : (
        <p>No hay datos disponibles.</p>
      )}

      <div>
        <button className="boton-crear" onClick={() => volver()}>
          Volver
        </button>
      </div>
    </>
  );
};

export default Reporte;
