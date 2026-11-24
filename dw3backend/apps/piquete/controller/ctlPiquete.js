
const mdlPiquete = require("../model/mdlPiquete");

const GetAllPiquete = (req, res) =>
  (async () => {
    let registro = await mdlPiquete.GetAllPiquete();
    res.json({ status: "ok", registro: registro });
  })();

const GetPiquete = (req, res) =>
  (async () => {
    let registro = await mdlPiquete.GetAllPiquete();
    res.json({ status: "ok", registro: registro });
  })();

const GetPiqueteByID = (req, res) =>
  (async () => {
    const piqueteID = parseInt(req.params.piqueteid);
    let registro = await mdlPiquete.GetPiqueteByID(piqueteID);
    res.json({ status: "ok", registro: registro });
  })();

const InsertPiquete = (req, res) =>
  (async () => {
    const piqueteREG = req.body;
    let { msg, linhasAfetadas } = await mdlPiquete.InsertPiquete(piqueteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdatePiquete = (req, res) =>
  (async () => {
    const piqueteID = parseInt(req.params.piqueteid);
    const piqueteREG = req.body;
    let { msg, linhasAfetadas } = await mdlPiquete.UpdatePiquete(piqueteID, piqueteREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeletePiquete = (req, res) =>
  (async () => {
    const piqueteID = parseInt(req.params.piqueteid);
    let { msg, linhasAfetadas } = await mdlPiquete.DeletePiquete(piqueteID);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllPiquete,
  GetPiquete,
  GetPiqueteByID,
  InsertPiquete,
  UpdatePiquete,
  DeletePiquete
};
