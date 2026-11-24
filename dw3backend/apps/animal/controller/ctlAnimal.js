
const mdlAnimal = require("../model/mdlAnimal");

const GetAllAnimal = (req, res) =>
  (async () => {
    let registro = await mdlAnimal.GetAllAnimal();
    res.json({ status: "ok", registro: registro });
  })();

const GetAnimal = (req, res) =>
  (async () => {
    let registro = await mdlAnimal.GetAllAnimal();
    res.json({ status: "ok", registro: registro });
  })();

const GetAnimalByID = (req, res) =>
  (async () => {
    const animalID = parseInt(req.params.animalid);
    let registro = await mdlAnimal.GetAnimalByID(animalID);
    res.json({ status: "ok", registro: registro });
  })();

const InsertAnimal = (req, res) =>
  (async () => {
    const animalREG = req.body;
    let { msg, linhasAfetadas } = await mdlAnimal.InsertAnimal(animalREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdateAnimal = (req, res) =>
  (async () => {
    const animalID = parseInt(req.params.animalid);
    const animalREG = req.body;
    let { msg, linhasAfetadas } = await mdlAnimal.UpdateAnimal(animalID, animalREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeleteAnimal = (req, res) =>
  (async () => {
    const animalID = parseInt(req.params.animalid);
    let { msg, linhasAfetadas } = await mdlAnimal.DeleteAnimal(animalID);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllAnimal,
  GetAnimal,
  GetAnimalByID,
  InsertAnimal,
  UpdateAnimal,
  DeleteAnimal
};
