export default class DBconfig {
    private static db_info: any = {
        host: "localhost",
        user: "root",
        password: "Dlgudfh1@",
        database: "mydb"
    };

    public static getDB_info(): any {
        return this.db_info;
    }

}
