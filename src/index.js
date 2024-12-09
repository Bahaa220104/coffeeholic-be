import cors from "cors";
import express from "express";
import httpConfig from "./config/http.config.js";
import setupRoutes from "./routes/index.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

setupRoutes(app);

app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(httpConfig.port, () => {
  console.log(`Server is running on port ${httpConfig.port}`);
});
