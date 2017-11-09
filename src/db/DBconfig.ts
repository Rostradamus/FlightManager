export default class DBconfig {
    private static db_info: any = {
        host: "localhost",
        user: "root",
        password: "fd118644",
        database: "FlightManager"
    };

    public static getDB_info(): any {
        return this.db_info;
    }

}
