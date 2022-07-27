const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'nova',
    password: 'Academica2022dev',
    port: 5432
})

const insertSurvey = (req, res) => {
    pool.query('insert into survey(name,json) values($1,$2) returning *', [req.query["name"], "{}"], (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        console.log(results.rows);

        res.status(201).json(results.rows);

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

const getResults = (req, res) => {
    const { key } = req.body;
    console.log(key);
    pool.query('select count(1), json_array_elements_text(json#>\'{'+key+'}\') as colors from results group by json_array_elements_text(json#>\'{'+key+'}\')', (error, results) => {
        if (error) {
            res.status(504);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

module.exports = {
    getResults,
    insertResults,
    insertSurvey
}