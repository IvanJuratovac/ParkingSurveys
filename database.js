const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'nova',
    password: 'Academica2022dev',
    port: 5432
})

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
    pool.query('select json as title from surveys where id=' + id, (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const deleteSurvey = (req, res) => {
    const { id } = req.body;
    pool.query('delete from surveys where id=' + id, (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const insertResults = (req, res) => {
    const { results } = req.body;
    pool.query('insert into results(json) values($1) returning *', [results], (error, results) => {
        if (error) {
            res.status(503);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const insertSurvey = (req, res) => {
    const { survey } = req.body;
    pool.query('insert into surveys(json) values($1) returning *', [survey], (error, results) => {
        if (error) {
            res.status(503);
            throw error;
        }
        res.status(201).json(results.rows);
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

const updateSurvey = (req, res) => {
    const { id } = req.body;
    const { json } = req.body
    pool.query('update surveys set json=$1 where id=$2', [json, id], (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const getSurveyTitles = (req, res) => {
    pool.query('select id, json->>\'title\' as title from surveys where json->>\'title\' is not null', (error, results) => {
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
    if (type[index] == "checkbox") {
        pool.query('select count(1), json_array_elements_text(json#>\'{' + key + '}\') as name from results group by json_array_elements_text(json#>\'{' + key + '}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
        })
    }
    else {
        pool.query('select count(1),json->>\'' + key + '\' as name from results where json->>\'' + key + '\'is not null group by json->>\'' + key + '\'', (error, results) => {
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

module.exports = {
    getResults,
    insertResults,
    getSurveyTypes,
    getSurveys,
    getQuestionNames,
    insertSurvey,
    getSurveyTitles,
    deleteSurvey,
    updateSurvey
}