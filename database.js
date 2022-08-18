const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'temelji',
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
    pool.query('select details as title from controls where id=' + id, (error, results) => {
        if (error) {
            res.status(505);
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const deleteSurvey = (req, res) => {
    const { id } = req.body;
    pool.query('delete from controls where id=' + id, (error, results) => {
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
    const {idupdated}=req.body;
    const {idcreated} = req.body;
    pool.query('insert into transactions(details,idcontrols,idupdated,idcreated) values($1,$2,$3,$4) returning *', [details,idcontrols,idupdated,idcreated], (error, results) => {
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

const getControlsID = (req, res) => {
    const { id } = req.body;
    pool.query('select ID as names from controls where id='+id, (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        res.status(201).json(results.rows);
    })
}

const updateSurvey = (req, res) => {
    const { id } = req.body;
    const { details } = req.body
    pool.query('update controls set details=$1 where id=$2', [details, id], (error, results) => {
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
    if (type[index] == "checkbox") {
        pool.query('select count(1), json_array_elements_text(details#>\'{' + key + '}\') as name from transactions group by json_array_elements_text(details#>\'{' + key + '}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            console.log(results.rows)
            res.status(201).json(results.rows);
        })
    }
    else {
        pool.query('select count(1),details->>\'' + key + '\' as name from transactions where details->>\'' + key + '\'is not null group by details->>\'' + key + '\'', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            console.log(results.rows)
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
    getSurveyTitles,
    deleteSurvey,
    updateSurvey,
    getControlsID
}