import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(url , {
    dbName: "chatbot"
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.log(error);
}
);

db.once("open", () => {
    console.log("Connected to database");
}
);

export default db;