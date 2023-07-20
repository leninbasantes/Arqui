export function saveUser(token) {
  localStorage.setItem("token", token);
}

export function getUser() {
  let token = localStorage.getItem("token");
  console.log("Este es el token")
  if (token === "undefined" || token === "null") {
    token = false;
  }
  return token;
}
