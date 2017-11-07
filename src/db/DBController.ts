import mysql = require('mysql');
import Log from "../Util";
import DBconfig from "./DBconfig";


let readline = require('readline');



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
            that.prepareConnection();
            that.con.query(msg, function (err: any, result: any, fields: any) {
                if (err) {
                    that.con.end();
                    reject(err);
                }

                that.con.end();
                fulfill(result);
            });
        });
    }

    private prepareConnection() {
        const that = this;
        this.con = mysql.createConnection(that.db_info);
        that.con.connect(function (err: any) {
            if (err) {
                Log.error(err.message);
                that.con.end();
                return false;
            }
            Log.info("Successfully connected to DB, Now Handling the query");
        });
    }

}





let mydb = DBHandler.getInstance();

//TODO: test a user insert function
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