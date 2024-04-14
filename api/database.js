import { Sequelize } from "sequelize";

let connection = null;

const getConnection = async () => {
    if (!connection) {
        connection = new Sequelize({
            database: process.env.DATABASE,
            username: process.env.DBUSER,
            password:process.env.DBPASS,
            dialect: "postgres",
            host: process.env.DBHOST,
            port: process.env.DBPORT,
            logging: false,
            pool: {
                min: 0,
                max: 5,
                idle: 20000,
                acquire: 20000,
            },
        });
        connection
            .authenticate()
            .then(() => console.log("Database Connected Successfully"))
            .catch((err) => console.error("Database Failed to connect", err.message));
    }
    return connection;
}

// Call the getConnection function


export default getConnection;