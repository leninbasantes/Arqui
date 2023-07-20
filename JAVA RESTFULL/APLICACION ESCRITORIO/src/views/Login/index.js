import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import API from "../../services/api-service";
import { getUser, saveUser } from "../../services/auth-service";
import imagen from "../../image/images.jpg";
import Swal from "sweetalert2";

const Login = () => {
  const [user, setUser] = useState("");
  const [passwrd, setPasswd] = useState("");
  let navigate = useNavigate();

  const Logearse = async () => {
    let Documento = {
      nombre: user,
      password: passwrd,
    };
    try {
      const respuesta = await API.Logeo(Documento);
      console.log(respuesta.userId);
      saveUser(respuesta.userId);
      console.log(respuesta);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Bienvenido.!',
        showConfirmButton: false,
        timer: 1500
      }).then((resulto)=>{
        navigate('/home');

      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario o Contrasena Incorrectas!',
        footer: '<a>Si no puede acceder creese una nueva cuenta</a>'
      })
      console.log("Aqui esperemos que tengamos error")
    }
  };

  const CrearUsuario = async () => {
    navigate("/crearUsuario");
  };

  return (
    <>
      <div className="contenedor-main">
        <div className="Contenedor-Login">
          <div className="Contenedor-titulo">
            <h4>Login</h4>
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
            <button onClick={Logearse}>Iniciar sesión</button>
          </div>
          <div className="Crear-usuario">
            <span onClick={CrearUsuario}>Crear Usuario</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
