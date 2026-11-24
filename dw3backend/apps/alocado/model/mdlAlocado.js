
const db = require("../../../database/databaseconfig");

const GetAllAlocado = async () => {
  return (
    await db.query(
      "SELECT alocado.*, animal.nome AS nomeanimal " +
      "FROM alocado " +
      "LEFT JOIN animal ON alocado.animalid = animal.animalid " +
      "WHERE alocado.deleted = false " +
      "ORDER BY alocado.datainicio ASC"
    )
  ).rows;
};

const GetAlocadoByID = async (alocadoIDPar) => {
  return (
    await db.query(
      "SELECT * FROM alocado WHERE alocadoid = $1 AND deleted = false",
      [alocadoIDPar]
    )
  ).rows;
};

const InsertAlocado = async (alocadoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO alocado (descricao, datainicio, datafinal, animalid, piqueteid) " +
        "VALUES ($1, $2, $3, $4, $5)",
        [
          alocadoREGPar.descricao,
          alocadoREGPar.datainicio,
          alocadoREGPar.datafinal,
          alocadoREGPar.animalid,
          alocadoREGPar.piqueteid
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAlocado|InsertAlocado] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdateAlocado = async (alocadoIDPar, alocadoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE alocado SET descricao = $2, datainicio = $3, " +
        "datafinal = $4, animalid = $5, piqueteid = $6 " +
        "WHERE alocadoid = $1 AND deleted = false",
        [
          alocadoIDPar,
          alocadoREGPar.descricao,
          alocadoREGPar.datainicio,
          alocadoREGPar.datafinal,
          alocadoREGPar.animalid,
          alocadoREGPar.piqueteid
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAlocado|UpdateAlocado] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeleteAlocado = async (alocadoIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE alocado SET deleted = true WHERE alocadoid = $1 AND deleted = false",
        [alocadoIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAlocado|DeleteAlocado] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllAlocado,
  GetAlocadoByID,
  InsertAlocado,
  UpdateAlocado,
  DeleteAlocado
};
