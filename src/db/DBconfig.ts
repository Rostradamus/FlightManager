export default class DBconfig {
    private static db_info: any = {
        host: "localhost",
        user: "root",
        password: "wjswlals",
        database: "FlightManager",
        dateStrings: 'date'
    };

    public static getDB_info(): any {
        return this.db_info;
    }
}
