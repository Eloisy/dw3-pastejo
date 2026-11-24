routerApp.get("/getAllAlocado", appAlocado.GetAllAlocado);
routerApp.get("/getAlocadoByID/:alocadoid", appLogin.AutenticaJWT, appAlocado.GetAlocadoByID);
routerApp.get("/getAlocado", appLogin.AutenticaJWT, appAlocado.GetAlocado); // Linha
adicionada.
routerApp.post("/insertAlocado", appLogin.AutenticaJWT, appAlocado.InsertAlocado);
routerApp.put("/updateAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.UpdateAlocado);
routerApp.delete("/deleteAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.DeleteAlocado);


routerApp.get("/getAllAnimal", appAnimal.GetAllAnimal);
routerApp.get("/getAnimalByID/:animalid", appLogin.AutenticaJWT, appAnimal.GetAnimalByID);
routerApp.get("/getAnimal", appLogin.AutenticaJWT, appAnimal.Getanimal); // Linha
adicionada.
routerApp.post("/insertAnimal", appLogin.AutenticaJWT, appAnimal.InsertAnimal);
routerApp.put("/updateAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.UpdateAnimal);
routerApp.delete("/deleteAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.DeleteAnimal);


routerApp.get("/getAllPasto", appPasto.GetAllPasto);
routerApp.get("/getPastoByID/:pastoid", appLogin.AutenticaJWT, appPasto.GetPastoByID);
routerApp.get("/getPasto", appLogin.AutenticaJWT, appPasto.GetPasto); // Linha
adicionada.
routerApp.post("/insertPasto", appLogin.AutenticaJWT, appPasto.InsertPasto);
routerApp.put("/updatePasto/:pastoid", appLogin.AutenticaJWT, appPasto.UpdatePasto);
routerApp.delete("/deletePasto/:pastoid", appLogin.AutenticaJWT, appAlunos.DeletePasto);

routerApp.get("/getAllPiquete", appPiquete.GetAllPiquete);
routerApp.get("/getPiqueteByID/:piqueteid", appLogin.AutenticaJWT, appPiquete.GetPiqueteByID);
routerApp.get("/getPiquete", appLogin.AutenticaJWT, appPiquete.GetPiquete); // Linha
adicionada.
routerApp.post("/insertPiquete", appLogin.AutenticaJWT, appPiquete.InsertPiquete);
routerApp.put("/updatePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.UpdatePiquete);
routerApp.delete("/deletePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.DeletePiquete);
