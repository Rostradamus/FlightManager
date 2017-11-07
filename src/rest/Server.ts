/**
 * Created by rolee on 2017-09-28.
 *
 * This is the REST entry point for the project.
 * Restify is configured here.
 */
import Log from "../Util";
import restify = require('restify');
let path = require('path');
let fs = require('fs');
import DBController from "../db/DBController";

export default class Server {

    private port: number;
    private rest: restify.Server;
    private db: DBController;



    constructor(port: number) {
        this.port = port;
        this.db = DBController.getInstance();

    }

    public async stop(): Promise<boolean> {
        await this.rest.close();
        Log.raw("<R> " + new Date().toLocaleString() + ": " + 'Server::(stop) - Server stopped');
        return true;
    }

    public start(): Promise<boolean> {
        let that = this;
        return new Promise((fulfill, reject) => {
            try {
                Log.raw("<R> " + new Date().toLocaleString() + ": " + 'Server::(start) - Server started');

                that.rest = restify.createServer({name: 'FlightManagerApp'});
                that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                // TODO: must provide constant path
                const queryPath = '/query';
                // const dataPath = '/dataset/:id';

                // NOTE: THIS IS FOR LOADING THE STATIC FILES
                that.rest.get(/\/public\/?.*/, restify.serveStatic({
                    directory: __dirname
                }));

                that.rest.get('/', Server.get);
                that.rest.get('/hello', Server.get);
                that.rest.get('/customers', function (req: any, res: any) {
                    that.db.inputListener("SELECT * FROM CUSTOMER")
                        .then((result: any) => {
                            Log.info("The result was: " + result);
                            res.send(result)
                        })
                        .catch((err: any) => {
                            Log.error(err.message);
                            throw err;
                        })
                });

                // that.rest.put(dataPath, Server.put);
                //
                // that.rest.del(dataPath, Server.del);
                //
                that.rest.post(queryPath, Server.post);

                that.rest.listen(that.port, () => fulfill(true));
                that.rest.on('error', (err: string) => reject(err));

            } catch (err) {
                reject(err);
            }
        });
    }

    public static get(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            let currPath = (req.getPath() == '/')? 'index' : req.getPath();
            let filePath = path.join(__dirname, '/views/'+ currPath + '.html');
            console.log(filePath);
            fs.readFile(filePath, {encoding: 'utf-8'}, function (err: any, file: any) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else {
                    res.write(file);
                    // res.send(file);
                }
                res.end();
            });
            return next();
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static put(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::(put) - ID => ' + req.params.id);

        return next();
    }

    public static del(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::(del) - ID => ' + req.params.id);

        return next();
    }

    public static post(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::(post) - Process...');
        Log.info('Server::(post - Query Body =>');
        Log.raw(JSON.stringify(req.body, null, 2));

        DBController.getInstance().inputListener("SELECT * FROM CUSTOMER")
            .then((result: any) => {
                Log.info("The result was: " + result);
                res.send({test:"hi"});
            })
            .catch((err: any) => {
                Log.error(err.message);
                res.json({err:"fell into catch phrase"});
                throw err;

            });

        return next();
    }

    public static performEcho(msg: string): any {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }
}