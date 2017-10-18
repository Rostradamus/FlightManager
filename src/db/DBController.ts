import mysql = require('mysql');
import Log from "../Util";
let readline = require('readline');

export default class DBHandler {
    private static instance: DBHandler;
    private con: any;
    private db_info: any;

    private constructor() {
        // TODO: THIS IS TEMPORARY CONNECTION, have to be modified
        this.db_info = {
            host: "localhost",
            user: "root",
            password: "Dlgudfh1@",
            database: "mydb"
        };
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
                    Log.error(err.message);
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

let isQuit = false;
//TODO: test a user insert function
let rl = readline.createInterface({
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
                return rl.close();
        });
    })
}

inputStreamer();