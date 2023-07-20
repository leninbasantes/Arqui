const URL_BASE = "https://localhost:7095";
const URL_BASE_PRO = "https://iot.constecoin.com/api/shop";

/////////////////////////////////////////////////////AUTNTICACION DE CUENTAS ///////////////////////////////////
function obtenerPartidos() {
  // let url = `https://aiot.constecoin.com/api/landingpage/partidos`;
  let url = `${URL_BASE_PRO}/partidos`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}

function obtenerLocalidades(id) {
  let url = `${URL_BASE_PRO}/obtenerLocalidades`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id)
  };
  console.log(url)
  console.log(requestOptions)

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}
function obtenerReporte(id) {
  let url = `https://aiot.constecoin.com/api/landingpage/reporte?codigo=${id}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}

function guardarFactura(data) {
  let url = `https://aiot.constecoin.com/api/landingpage/factura?partidos=${data.id}&localidades=${data.codigO_LOCALIDAD}&cantidad=${data.cantidad}`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify(body)
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        resolve(); // Resuelve la promesa sin pasar ningún valor
      })
      .catch((error) => reject(error));
  });
}

function Logeo(data) {
  let url = `${URL_BASE_PRO}/login`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}


function generarFactura(documento) {
  let url = `${URL_BASE_PRO}/crearFactura`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documento)
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.text()) // Obtener el cuerpo de la respuesta como texto
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}

function obtenerHistorial(id) {
  let url = `${URL_BASE_PRO}/historial`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id)
  };
  console.log(url)
  console.log(requestOptions)

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}

function crearUsuario(id) {
  let url = `${URL_BASE_PRO}/singin`;
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id)
  };
  console.log(url)
  console.log(requestOptions)

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.text(); // Obtener la respuesta como texto en caso de error
        }
      })
      .then(
        (respuesta) => {
          resolve(respuesta);
        },
        (error) => reject(error)
      );
  });
}


export default {
  obtenerPartidos,
  obtenerLocalidades,
  guardarFactura,
  obtenerReporte,
  Logeo,
  generarFactura,
  obtenerHistorial,
  crearUsuario
}