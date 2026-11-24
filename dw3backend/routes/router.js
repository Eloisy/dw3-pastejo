
const express = require("express");
const routerApp = express.Router();

// Controllers
const appPasto = require("../apps/pasto/controller/ctlPasto");
const appPiquete = require("../apps/piquete/controller/ctlPiquete");
const appAnimal = require("../apps/animal/controller/ctlAnimal");
const appAlocado = require("../apps/alocado/controller/ctlAlocado");
const appLogin = require("../apps/login/controller/ctlLogin");

// Rota inicial
routerApp.get("/", (req, res) => {
    res.send("API de Manejo de Pastagem funcionando!");
});

// Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Pasto
routerApp.get("/getAllPasto", appLogin.AutenticaJWT, appPasto.GetAllPasto);
routerApp.get("/getPasto", appLogin.AutenticaJWT, appPasto.GetPasto);
routerApp.get("/getPastoByID/:pastoid", appLogin.AutenticaJWT, appPasto.GetPastoByID);
routerApp.post("/insertPasto", appLogin.AutenticaJWT, appPasto.InsertPasto);
routerApp.put("/updatePasto/:pastoid", appLogin.AutenticaJWT, appPasto.UpdatePasto);
routerApp.delete("/deletePasto/:pastoid", appLogin.AutenticaJWT, appPasto.DeletePasto);

// Piquete
routerApp.get("/getAllPiquete", appLogin.AutenticaJWT, appPiquete.GetAllPiquete);
routerApp.get("/getPiquete", appLogin.AutenticaJWT, appPiquete.GetPiquete);
routerApp.get("/getPiqueteByID/:piqueteid", appLogin.AutenticaJWT, appPiquete.GetPiqueteByID);
routerApp.post("/insertPiquete", appLogin.AutenticaJWT, appPiquete.InsertPiquete);
routerApp.put("/updatePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.UpdatePiquete);
routerApp.delete("/deletePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.DeletePiquete);

// Animal
routerApp.get("/getAllAnimal", appLogin.AutenticaJWT, appAnimal.GetAllAnimal);
routerApp.get("/getAnimal", appLogin.AutenticaJWT, appAnimal.GetAnimal);
routerApp.get("/getAnimalByID/:animalid", appLogin.AutenticaJWT, appAnimal.GetAnimalByID);
routerApp.post("/insertAnimal", appLogin.AutenticaJWT, appAnimal.InsertAnimal);
routerApp.put("/updateAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.UpdateAnimal);
routerApp.delete("/deleteAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.DeleteAnimal);

// Alocado
routerApp.get("/getAllAlocado", appLogin.AutenticaJWT, appAlocado.GetAllAlocado);
routerApp.get("/getAlocado", appLogin.AutenticaJWT, appAlocado.GetAlocado);
routerApp.get("/getAlocadoByID/:alocadoid", appLogin.AutenticaJWT, appAlocado.GetAlocadoByID);
routerApp.post("/insertAlocado", appLogin.AutenticaJWT, appAlocado.InsertAlocado);
routerApp.put("/updateAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.UpdateAlocado);
routerApp.delete("/deleteAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.DeleteAlocado);

module.exports = routerApp;
