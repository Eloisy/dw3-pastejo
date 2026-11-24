
const db = require("../../../database/databaseconfig");

const GetAllPiquete = async () => {
  return (
    await db.query(
      "SELECT * FROM piquete WHERE deleted = false ORDER BY descricao ASC"
    )
  ).rows;
};

const GetPiqueteByID = async (piqueteIDPar) => {
  return (
    await db.query(
      "SELECT * FROM piquete WHERE piqueteid = $1 AND deleted = false",
      [piqueteIDPar]
    )
  ).rows;
};

const InsertPiquete = async (piqueteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO piquete (descricao, latitude, longitude, pastoid) " +
        "VALUES ($1, $2, $3, $4)",
        [
          piqueteREGPar.descricao,
          piqueteREGPar.latitude,
          piqueteREGPar.longitude,
          piqueteREGPar.pastoid
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPiquete|InsertPiquete] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdatePiquete = async (piqueteIDPar, piqueteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE piquete SET descricao = $2, latitude = $3, " +
        "longitude = $4, pastoid = $5 " +
        "WHERE piqueteid = $1 AND deleted = false",
        [
          piqueteIDPar,
          piqueteREGPar.descricao,
          piqueteREGPar.latitude,
          piqueteREGPar.longitude,
          piqueteREGPar.pastoid
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPiquete|UpdatePiquete] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeletePiquete = async (piqueteIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE piquete SET deleted = true " +
        "WHERE piqueteid = $1 AND deleted = false",
        [piqueteIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlPiquete|DeletePiquete] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllPiquete,
  GetPiqueteByID,
  InsertPiquete,
  UpdatePiquete,
  DeletePiquete
};
