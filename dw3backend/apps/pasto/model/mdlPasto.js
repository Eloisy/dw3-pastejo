
const db = require("../../../database/databaseconfig");

const GetAllPasto = async () => {
  return (
    await db.query(
      "SELECT * FROM pasto WHERE deleted = false ORDER BY descricao ASC"
    )
  ).rows;
};

const GetPastoByID = async (pastoIDPar) => {
  return (
    await db.query(
      "SELECT * FROM pasto WHERE pastoid = $1 AND deleted = false",
      [pastoIDPar]
    )
  ).rows;
};

const InsertPasto = async (pastoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO pasto (descricao, areatotal, ativo) VALUES ($1, $2, $3)",
        [
          pastoREGPar.descricao,
          pastoREGPar.areatotal,
          pastoREGPar.ativo
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPasto|InsertPasto] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdatePasto = async (pastoIDPar, pastoREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pasto SET descricao = $2, areatotal = $3, ativo = $4 " +
        "WHERE pastoid = $1 AND deleted = false",
        [
          pastoIDPar,
          pastoREGPar.descricao,
          pastoREGPar.areatotal,
          pastoREGPar.ativo
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPasto|UpdatePasto] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeletePasto = async (pastoIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE pasto SET deleted = true WHERE pastoid = $1 AND deleted = false",
        [pastoIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPasto|DeletePasto] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllPasto,
  GetPastoByID,
  InsertPasto,
  UpdatePasto,
  DeletePasto
};
