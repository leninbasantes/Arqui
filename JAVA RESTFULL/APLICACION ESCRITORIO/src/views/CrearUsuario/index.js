import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import API from "../../services/api-service";
import { getUser,saveUser } from "../../services/auth-service";
import imagen from "../../image/crear.jpg";
import Swal from "sweetalert2";


const CrearUsuario = () => {
  const [user, setUser] = useState("");
  const [passwrd, setPasswd] = useState("");
  let navigate = useNavigate();


  const Logearse = async () => {
    let Documento = {
      nombre: user,
      password: passwrd,
    };
    try {
      const respuesta = await API.crearUsuario(Documento);
      const insertId = respuesta.userId.insertId;
      console.log(respuesta)
      // console.log(respuesta.userId)
      saveUser(insertId)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario creado con exito.!',
        showConfirmButton: false,
        timer: 1500
      }).then((resulto)=>{
        navigate('/home');

      })
      // console.log(respuesta);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Este usuario ya existe!'
      })
      console.log("Se entro aqui")
      console.log(error)
    }
  };

  return (
    <>
      <div className="contenedor-main">
        <div className="Contenedor-Login">
          <div className="Contenedor-titulo">
            <h4>Crear Usuario</h4>
          </div>
          <div className="Contenedor-Imagen">
            <img src={imagen} alt="Monster" />
          </div>
          <div className="Input-user">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="Input-password">
            <input
              type="password"
              placeholder="Contraseña"
              value={passwrd}
              onChange={(e) => setPasswd(e.target.value)}
            />
          </div>
          <div className="Iniciar-sesion">
            <button onClick={Logearse}>Crear Usuario</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrearUsuario;
