import React, { useEffect, useState } from "react";
import API from "../../services/api-service";
import { useNavigate } from "react-router-dom";
import "./Index.css"; // Archivo CSS para los estilos

const Index = () => {
  const [data, setData] = useState([]);
  let history = useNavigate();

  useEffect(() => {
    API.obtenerPartidos().then(
      (respuesta) => {
        setData(respuesta);
        console.log(respuesta);
        console.log("Todo ok");
      },
      (error) => {
        console.log("Todo mal");
      }
    );
  }, []);

  const adquirirLocalidad = (codigo) => {

    history(
      `/localidades?id=${codigo}`
    );
    // history(`/localidades?id=${codigo}&equipO_LOCAL=${equipO_LOCAL}&equipO_VISITA=${equipO_VISITA}&fecha=${fecha}&hora=${hora}&lugar=${lugar}`);
  };

  const NextReporte = (id) => {
    history(
      `/reporte?id=${id}`
    );
  }

  return (
    <>
      {data.length > 0 ? (
        <>
          <h2 className="titulo-partidos">Partidos</h2>
          <table className="partidos-table">
            <thead>
              <tr>
                <th>Equipo Local</th>
                <th></th>
                <th></th>
                <th></th>
                <th>Equipo Visitante</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.EQUIPO_LOCAL}</td>
                  <td>
                    <img src={`https://aiot.constecoin.com/repositorio/images/${item.EQUIPO_LOCAL}.png`} alt="Monster" className="small-image" />
                  </td>
                  <td>vs</td>
                  <td>
                    <img src={`https://aiot.constecoin.com/repositorio/images/${item.EQUIPO_VISITA}.png`} alt="Monster" className="small-image" />
                  </td>
                  <td>{item.EQUIPO_VISITA}</td>
                  <td>
                    {item.FECHA.split("T")[0].split("-").reverse().join("/")}
                  </td>
                  <td>{item.FECHA.split("T")[1].split(":").slice(0, 2).join(":")}</td>
                  <td>{item.LUGAR}</td>
                  <td>
                    <button
                      className="adquirir-button"
                      onClick={() =>
                        adquirirLocalidad(item.CODIGO)
                      }
                    >
                      Adquirir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Cargando ...</p>
      )}
    </>
  );
};

export default Index;
