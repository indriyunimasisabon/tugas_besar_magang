import database from "../config/database.js";
import User from "./userModel.js";

const syncDatabase = async () => {
    try {
        await database.authenticate();
        console.log("Connection has been established successfully.");

        await User.sync({alter: true});
        console.log("Database & Models synced successfully.");
    } catch (error) {
        console.log("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export { database, syncDatabase };