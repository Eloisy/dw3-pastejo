
const db = require("../../../database/databaseconfig");

const GetAllAnimal = async () => {
  const banco = await db.query("SELECT current_database()");
  console.log("Banco conectado:", banco.rows);

  const resultado = await db.query(
    "SELECT * FROM animal WHERE deleted = false ORDER BY nome ASC"
  );

  console.log("Animais encontrados:", resultado.rows);

  return resultado.rows;
};
const GetAnimalByID = async (animalIDPar) => {
  return (
    await db.query(
      "SELECT * FROM animal WHERE animalid = $1 AND deleted = false",
      [animalIDPar]
    )
  ).rows;
};

const InsertAnimal = async (animalREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO animal (nome, datanascimento) VALUES ($1, $2)",
        [
          animalREGPar.nome,
          animalREGPar.datanascimento
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAnimal|InsertAnimal] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdateAnimal = async (animalIDPar, animalREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE animal SET nome = $2, datanascimento = $3 " +
        "WHERE animalid = $1 AND deleted = false",
        [
          animalIDPar,
          animalREGPar.nome,
          animalREGPar.datanascimento
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAnimal|UpdateAnimal] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeleteAnimal = async (animalIDPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE animal SET deleted = true " +
        "WHERE animalid = $1 AND deleted = false",
        [animalIDPar]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlAnimal|DeleteAnimal] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllAnimal,
  GetAnimalByID,
  InsertAnimal,
  UpdateAnimal,
  DeleteAnimal
};
