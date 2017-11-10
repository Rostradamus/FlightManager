import mysql = require('mysql');
import Log from "../Util";
import DBconfig from "./DBconfig";

export default class DBHandler {
    private static instance: DBHandler;
    private con: any;
    private db_info: any;

    private constructor() {
        // TODO: THIS IS TEMPORARY CONNECTION, have to be modified

        this.db_info = DBconfig.getDB_info();
        Log.info("Database Handler Created.");
    }

    public static getInstance() {
        if (!DBHandler.instance)
            DBHandler.instance = new DBHandler();
        return DBHandler.instance;
    }

    public inputListener(msg: string): Promise<any> {
        const that = this;
        return new Promise((fulfill: any, reject: any) => {
            try {
                that.setupConnection()
            } catch (err) {
                return reject(err);
            }
            Log.trace("Query to be handled -> " + msg);
            that.con.query(msg, function (err: any, result: any, fields: any) {
                if (err) {
                    Log.error(err.message);
                    that.con.end();
                    Log.trace("End DB connection");
                    return reject(err);
                }
                Log.trace("Query executed Successfully");
                that.con.end();
                Log.trace("End DB connection");
                return fulfill({fields: fields, result: result});
            });
        });
    }

    private setupConnection() {
        const that = this;
        this.con = mysql.createConnection(that.db_info);
        that.con.connect(function (err: any) {
            if (err) {
                Log.error(err.message);
                that.con.end();
                throw err
            }
            Log.info("Successfully connected to DB, Now Handling the query");
        });
    }

}

/*
let mydb = DBHandler.getInstance();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function inputStreamer() {
    rl.question("Input your MySQL query: ", function (answer: any) {
        if (answer === 'q')
            return rl.close();
        mydb.inputListener(answer)
            .then((res) => {
                console.log(res);
                inputStreamer();
            })
            .catch((err) =>{
                Log.error(err.message);
                return rl.close();
        });
    })
}

// inputStreamer();
*/