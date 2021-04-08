const mysql =require('mysql2');

switch (process.env.ENV) {
    case "LOCAL":
        conn = {
            host: process.env.DB_LOCAL_URL ,
            user: process.env.DB_LOCAL_USER ,
            password: process.env.DB_LOCAL_PASSWORD ,
            database: process.env.DB_LOCAL_DATABASE
        }
        break;
    case "GCLOUD":
        conn = {
            socketPath: process.env.DB_GCLOUD_URL ,
            user: process.env.DB_GCLOUD_USER ,
            password: process.env.DB_GCLOUD_PASSWORD ,
            database: process.env.DB_GCLOUD_DATABASE
        }
        break;
}

module.exports = mysql.createConnection(conn);