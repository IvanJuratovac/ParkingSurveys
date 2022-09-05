const jwt = require('jsonwebtoken');

const makeToken = (req, res) => {
    const IDuser = { IDuser: req.body.IDuser }
    const accessToken = jwt.sign(IDuser, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
}

const authenticateToken = (req, res) => {
    console.log("/token");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log("token null");
        res.status(401).send("Token je prazan");
    }
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, IDuser) => {
            if (err) {
                console.log("token verification error");
                res.status(403).send("Pogrešan token");
            }
            else {
                res.status(200).json(IDuser);
            }
        });
    }
}

module.exports = {
    makeToken,
    authenticateToken
}