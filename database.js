const Pool = require('pg').Pool
const bcrypt = require('bcrypt');
const credentials = require('./credentials.json');
console.log('connecting...');
const pool = new Pool(credentials);
//za rjesavanja problema anketa
//dobivanje tipova pitanja iz određene ankete zbog prilagodbe pretrazivanja
var type = [];
const getSurveyTypes = (req, res) => {
    const { id } = req.body;
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
    const { id } = req.body;
    pool.query('select details as title from controls where id=' + id, (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);
    })
}
//dohvacanje imena anketa za prikaz grafikona
const getQuestionNames = (req, res) => {
    const { id } = req.body;
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
    const { idrouter } = req.body;
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
    const { key } = req.body;
    const { idcontrols } = req.body;
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

const getUser = async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;

    pool.query('select * from users where email=\'' + email + '\' and password=\'' + password + '\'', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getAuthorization = (req, res) => {
    const { iduser } = req.body;
    const { idrouter } = req.body;

    pool.query('select * from authorizations where iduser= ' + iduser + ' and idrouter=' + idrouter, (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getRouter = (req, res) => {
    const { id } = req.body;

    pool.query('select getrouter(' + id + ') as name', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getRouterType = (req, res) => {
    const { id } = req.body;

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
    getQuestionNames,
    getSurveyTitles,
    getUser,
    getAuthorization,
    getRouter,
    getRouterType
}