import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // <-- listen on all network interfaces

connectDB().then(() => {
  app.listen(PORT, HOST, () => 
    console.log(`Server running on http://${HOST}:${PORT}`)
  );
});