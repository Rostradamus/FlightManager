import mysql = require('mysql');
import Log from "../Util";

export default class TestDB {
    constructor() {
        // TODO: THIS IS TEMPORARY CONNECTION, have to be modified
        let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Dlgudfh1@",
            database: "mydb"
        });

        con.connect(function(err) {
            if (err)  {
                Log.error(err.message);
                return err;
            }
            console.log("ahahah");
            Log.info("Connected!");
            let sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
            con.query("SELECT * from customers", function (err, result, fields) {
                if (err) {
                    Log.error(err.message);
                    return err;
                }
                console.log(result[0].address);

            });
        });
        //
    }
}

let mydb = new TestDB();
