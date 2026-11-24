
const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const mdlLogin = require("../model/mdlLogin");

const Login = async (req, res) => {
    try {
        const username = req.body.username || req.body.UserName;
        const password = req.body.password || req.body.Password;

        if (!username || !password) {
            return res.status(400).json({
                auth: false,
                message: "Informe usuário e senha!"
            });
        }

        const credencial = await mdlLogin.GetCredencial(username);

        if (credencial.length === 0) {
            return res.status(401).json({
                auth: false,
                message: "Usuário não identificado!"
            });
        }

        if (bCrypt.compareSync(password, credencial[0].password)) {
            const token = jwt.sign(
                { username: credencial[0].username },
                process.env.SECRET_API,
                { expiresIn: 600 }
            );

            return res.json({
                auth: true,
                token: token
            });
        }

        return res.status(401).json({
            auth: false,
            message: "Login inválido!"
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({
            auth: false,
            message: "Erro ao realizar login."
        });
    }
};

function AutenticaJWT(req, res, next) {
    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) {
        return res.status(401).json({
            auth: false,
            message: "Não foi informado o token JWT."
        });
    }

    const bearer = tokenHeader.split(" ");

    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
        return res.status(401).json({
            auth: false,
            message: "Formato do token inválido."
        });
    }

    const token = bearer[1];

    jwt.verify(token, process.env.SECRET_API, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                auth: false,
                message: "JWT inválido ou expirado."
            });
        }

        req.userId = decoded.username;
        next();
    });
}

const Logout = (req, res) => {
    res.json({
        auth: false,
        token: null
    });
};

module.exports = {
    Login,
    Logout,
    AutenticaJWT
};
