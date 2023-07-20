import Partidos from "./views/Partidos/index.js";
import Localidades from "./views/Localidades/index.js";
import Reporte from "./views/Reporte/index.js";
import Login from "./views/Login/index.js";


const routes = [
  {
    path: "/home",
    component: Partidos
  },
  {
    path: "/",
    component: Partidos
  },
  {
    path: "/login",
    component: Login // Ruta de acceso público
  },
  {
    path: "/localidades",
    component: Localidades // Ruta que requiere inicio de sesión
  },
  {
    path: "/reporte",
    component: Reporte // Ruta que requiere inicio de sesión
  }
];

export default routes;
