
const mdlAlocado = require("../model/mdlAlocado");

const GetAllAlocado = (req, res) =>
  (async () => {
    let registro = await mdlAlocado.GetAllAlocado();
    res.json({ status: "ok", registro: registro });
  })();

const GetAlocado = (req, res) =>
  (async () => {
    let registro = await mdlAlocado.GetAllAlocado();
    res.json({ status: "ok", registro: registro });
  })();

const GetAlocadoByID = (req, res) =>
  (async () => {
    const alocadoID = parseInt(req.params.alocadoid);
    let registro = await mdlAlocado.GetAlocadoByID(alocadoID);
    res.json({ status: "ok", registro: registro });
  })();

const InsertAlocado = (req, res) =>
  (async () => {
    const alocadoREG = req.body;
    let { msg, linhasAfetadas } = await mdlAlocado.InsertAlocado(alocadoREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const UpdateAlocado = (req, res) =>
  (async () => {
    const alocadoID = parseInt(req.params.alocadoid);
    const alocadoREG = req.body;
    let { msg, linhasAfetadas } = await mdlAlocado.UpdateAlocado(alocadoID, alocadoREG);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

const DeleteAlocado = (req, res) =>
  (async () => {
    const alocadoID = parseInt(req.params.alocadoid);
    let { msg, linhasAfetadas } = await mdlAlocado.DeleteAlocado(alocadoID);
    res.json({ status: msg, linhasAfetadas: linhasAfetadas });
  })();

module.exports = {
  GetAllAlocado,
  GetAlocado,
  GetAlocadoByID,
  InsertAlocado,
  UpdateAlocado,
  DeleteAlocado
};
