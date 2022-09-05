const Pool = require('pg').Pool
const credentials = require('./credentials.json');
console.log('connecting...');
const pool = new Pool(credentials);
const Jimp = require('jimp');
//za rjesavanja problema anketa
//dobivanje tipova pitanja iz određene ankete zbog prilagodbe pretrazivanja
var type = [];
const getSurveyTypes = (req, res) => {
    const { id } = req.query;
    pool.query('select surveyTypes as types from surveyTypes(' + id + ')', (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        type = results.rows[0].types;
        res.status(201).json(results.rows);
    })
}

//dohvacanje određene ankete 
const getSurveys = (req, res) => {
    const { id } = req.query;
    pool.query('select details as title from controls where id=' + id, (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const insertResults = (req, res) => {
    const { details } = req.body;
    const { idcontrols } = req.body;
    const { idupdated } = req.body;
    const { idcreated } = req.body;

    var tmp = JSON.parse(details);
    if (tmp.file !== undefined) {
        var base64;
        switch (tmp.file[0].name.split('.')[1]) {
            case 'jpg':
                base64 = tmp.file[0].content.substring(23);
                tmp.file = './pictures/' + Date.now() + '.jpg';
                break;

            case 'png':
                base64 = tmp.file[0].content.substring(21);
                tmp.file = './pictures/' + Date.now() + '.png';
                break;

            case 'bmp':
                base64 = tmp.file[0].content.substring(21);
                tmp.file = './pictures/' + Date.now() + '.bmp';
                break;

            default:

        }
        const buffer = Buffer.from(base64, 'base64');
        Jimp.read(buffer, (err, res1) => {
            if (err) {
                throw new Error(err);
            }
            res1.write(tmp.file)
        })

        pool.query('insert into transactions(details,idcontrols,idupdated,idcreated) values($1,$2,$3,$4) returning *', [JSON.stringify(tmp), idcontrols, idupdated, idcreated], (error, results) => {
            if (error) {
                console.log('greska')
                res.status(503);
                throw error;
            }
            res.status(201).json(results.rows);
        })
    }
    else {
        pool.query('insert into transactions(details,idcontrols,idupdated,idcreated) values($1,$2,$3,$4) returning *', [details, idcontrols, idupdated, idcreated], (error, results) => {
            if (error) {
                res.status(503);
                throw error;
            }
            res.status(201).json(results.rows);
        })
    }
}

//dohvacanje imena anketa za prikaz grafikona
const getSurveyNames = (req, res) => {
    const { id } = req.query;
    pool.query('select surveyNames as names from surveyNames(' + id + ')', (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}
//dohvacanje titles za anketu kako bi se iscrto grafikon
const getSurveyTitles = (req, res) => {
    const { idrouter } = req.query;
    pool.query('select c.id, details->>\'title\' as title from authorizations as a, controls as c where a.idapplication = c.idapplication and idrouter = ' + idrouter, (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}
//po određenom pitanju ide određeni query 
var index = 0;
const getResults = (req, res) => {
    const { key } = req.query;
    const { idcontrols } = req.query;
    if (type[index] == "checkbox") {
        pool.query('select count(1), json_array_elements_text(details#>\'{' + key + '}\') as name from transactions where idcontrols=' + idcontrols + ' group by json_array_elements_text(details#>\'{' + key + '}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
        })
    }
    else {
        pool.query('select count(1), details->>\'' + key + '\' as name from transactions where details->>\'' + key + '\' is not null and idcontrols=' + idcontrols + ' group by details->>\'' + key + '\'', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
        })
    }
    if (type.length - 1 == index) {
        index = 0;
    }
    else {
        index++;
    }
}
//prijavljivanje korisnika

var hashedPassword1;
const hashingF = (req, res) => {
    const { password } = req.query;
    pool.query('SELECT hashing($1)', [password], (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        hashedPassword1 = results.rows[0].hashing;
        res.status(201).json(results.rows);
    })
}
const getUser = (req, res) => {
    const { email } = req.query;

    pool.query('select * from users where email=\'' + email + '\' and password=\'' + hashedPassword1 + '\'', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getAuthorization = (req, res) => {
    const { iduser } = req.query;
    const { idrouter } = req.query;

    pool.query('select * from authorizations where iduser= ' + iduser + ' and idrouter=' + idrouter, (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getRouter = (req, res) => {
    const { id } = req.query;

    pool.query('select getrouter(' + id + ') as name', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getRouterType = (req, res) => {
    const { id } = req.query;

    pool.query('select getroutertype(' + id + ') as name', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

module.exports = {
    getResults,
    getSurveyTypes,
    getSurveys,
    getSurveyNames,
    getSurveyTitles,
    getUser,
    getAuthorization,
    getRouter,
    getRouterType,
    insertResults,
    hashingF
}