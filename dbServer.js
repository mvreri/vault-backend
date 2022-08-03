//backend for the vault app
const express = require("express")
const app = express()
const {
    Pool
} = require("pg")
const dotenv = require("dotenv")
dotenv.config()

var listener = app.listen(8888, function() {
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});


app.use(express.json());
//middleware to read req.body.<params>

//FIND USER
app.post("/login", async (req, res) => {
    const user = req.body.username;
    const pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });

    pool.connect();
    const selectQuery = `SELECT details->>'name' details FROM users WHERE details->>'email'::text = $1`;

    // Pass the string and integer to the pool's query() method
    pool.query(selectQuery, [user], (err, result) => {
        if (err) {
            let response_data = {
                status: 409,
                message: "User Data Conflict",
                data: null
            };
            res.json(response_data);
        }

        if (res) {
            let response_data = {
                status: 200,
                message: "User Data",
                data: result.rows
            };
            res.json(response_data);//the data should be contained here
        }
    })

    pool.end()
}) //end of app.post()