const Pool = require('pg').Pool
console.log('connecting...');
const pool = new Pool({
    user: 'fgaspar',
    host: 'postgres-dev',
    database: 'nova',
    password: 'Academica2022dev',
    port: 5432
})

var t=[];
var type="";
const getSurvey = (req, res) => {
    pool.query("select json->'pages'->0->'elements'->0->>'type' as name from surveys", (error, results) => {
        if (error) {
            res.status(502);
            throw error;
        }
        t=results.rows
        //console.log(t)
        
               type= t[1].name;
               console.log(type)
        
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
    
    if(type=="checkbox"){
        
        pool.query('select count(1), json_array_elements_text(json#>\'{'+key+'}\') as name from results group by json_array_elements_text(json#>\'{'+key+'}\')', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
            console.log("je polje",results.rows)
        })
    }
    else {
        pool.query('select count(1),json->>\''+key+'\' as name from results where json->>\''+key+'\'is not null group by json->>\''+key+'\'', (error, results) => {
            if (error) {
                res.status(504);
                throw error;
            }
            res.status(201).json(results.rows);
           
        })
    }
    
}

module.exports = {
    getResults,
    insertResults,  
    getSurvey
}