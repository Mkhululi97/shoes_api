import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import db from "./database.js";
import dotenv from "dotenv";
import shoesRouter from "./routes/shoes-routes.js";
import usersRouter from "./routes/users-routes.js";
dotenv.config();

let app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// setup server to accept json
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
/* For populating table with data, purposes only */
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/insert", async function insert(req, res) {
  let brand = req.body.br;
  let name = req.body.nme;
  let size = req.body.sz;
  let color = req.body.clr;
  let quantity = req.body.qty;
  let price = req.body.prz;
  let image = req.body.imgurl;
  await db.none(
    "insert into shoe_api_schema.shoe_details (brand, name, size, color, quantity, price, image_url) values($1, $2, $3, $4, $5, $6, $7)",
    [brand, name, size, color, quantity, price, image]
  );
  res.redirect("/");
});
/* For populating table with data, purposes only */

app.use("/api/shoes", shoesRouter);
app.use("/api/users", usersRouter);

let PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
