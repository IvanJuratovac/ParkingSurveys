const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'temelji',
    password: 'Academica2022dev',
    port: 5432
})
//za rjesavanja problema anketa
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

const getSurveyTitles = (req, res) => {
    pool.query('select id, details->>\'title\' as title from controls where details->>\'title\' is not null', (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

var index = 0;
const getResults = (req, res) => {
    const { key } = req.body;
    const {idcontrols}=req.body;
    if (type[index] == "checkbox") {
        pool.query('select count(1), json_array_elements_text(details#>\'{' + key + '}\') as name from transactions where idcontrols='+idcontrols+' group by json_array_elements_text(details#>\'{' + key + '}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
           
            res.status(201).json(results.rows);
        })
    }
    else {
        pool.query('select count(1), details->>\'' + key + '\' as name from transactions where details->>\'' + key + '\' is not null and idcontrols='+idcontrols+' group by details->>\'' + key + '\'', (error, results) => {
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

const getUser=(req,res)=>{
    const {email}=req.body;
    const {password}=req.body;

    pool.query('select * from users where email='+email+'and password='+password, (error, results) => {
        if (error) {
            res.status(508);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getAuthorization=(req,res)=>{
    const {iduser}=req.body;
    const {idrouter}=req.body;

    pool.query('select * from authorizations where iduser= '+iduser+' and idrouter='+idrouter, (error, results) => {
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
    getAuthorization
}