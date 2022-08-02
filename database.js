const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'nova',
    password: 'Academica2022dev',
    port: 5432
})

var t = [];
var type = "";
const getSurveyTypes = (req, res) => {
    const { title } = req.body;
    pool.query('select surveyTypes as types from surveyTypes(\'' + title + '\')', (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        t = results.rows
        console.log(t)
        type = t[0].types;
        console.log(type)
        res.status(201).json(results.rows);
    })
}


const getSurveys = (req, res) => {
    const { title } = req.body;

    pool.query('select json as title from surveys where json->>\'title\'=\'' + title + '\'', (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);

    })
}

const insertResults = (req, res) => {
    const { results } = req.body;

    console.log(results)
    pool.query('insert into results(json) values($1) returning *', [results], (error, results) => {
        if (error) {
            res.status(503);
            throw error;
        }
        console.log(results.rows)
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
        console.log(results.rows)
        res.status(201).json(results.rows);
    })
}

const getQuestionNames = (req, res) => {
    const { title } = req.body;
    pool.query('select surveyNames as names from surveyNames(\'' + title + '\')', (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }

        res.status(201).json(results.rows);
    })

}

const getSurveyTitles = (req, res) => {
    
    pool.query('select json->>\'title\' as title from surveys where json->>\'title\' is not null', (error, results) => {
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
        console.log("if")

        pool.query('select count(1), json_array_elements_text(json#>\'{' + key + '}\') as name from results group by json_array_elements_text(json#>\'{' + key + '}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
            console.log("je polje", results.rows)

        })
    }
    else {

        console.log("else")
        pool.query('select count(1),json->>\'' + key + '\' as name from results where json->>\'' + key + '\'is not null group by json->>\'' + key + '\'', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
            //console.log("nije polje",results.rows)

        })
    }
    if (type.at(-1) == type[index]) {
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
    getSurveyTitles
}