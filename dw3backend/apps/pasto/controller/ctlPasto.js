
const mdlPasto = require("../model/mdlPasto");

const GetAllPasto = (req, res) =>
  (async () => {
    let registro = await mdlPasto.GetAllPasto();
    res.json({ status: "ok", registro: registro });
  })();

const GetPasto = (req, res) =>
  (async () => {
    let registro = await mdlPasto.GetAllPasto();
    res.json({ status: "ok", registro: registro });
  })();

const GetPastoByID = (req, res) =>
  (async () => {
    const pastoID = parseInt(req.params.pastoid);
    let registro = await mdlPasto.GetPastoByID(pastoID);
    res.json({ status: "ok", registro: registro });
  })();

const InsertPasto = (req, res) =>
  (async () => {
    const pastoREG = req.body;
    let { msg, linhasAfetadas } = await mdlPasto.InsertPasto(pastoREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdatePasto = (req, res) =>
  (async () => {
    const pastoID = parseInt(req.params.pastoid);
    const pastoREG = req.body;
    let { msg, linhasAfetadas } = await mdlPasto.UpdatePasto(pastoID, pastoREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeletePasto = (req, res) =>
  (async () => {
    const pastoID = parseInt(req.params.pastoid);
    let { msg, linhasAfetadas } = await mdlPasto.DeletePasto(pastoID);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllPasto,
  GetPasto,
  GetPastoByID,
  InsertPasto,
  UpdatePasto,
  DeletePasto
};
