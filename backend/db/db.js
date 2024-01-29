import mongoose from "mongoose";

const url = "mongodb://localhost:27017/chatbot";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

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