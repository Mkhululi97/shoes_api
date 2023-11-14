import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
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
app.use(cors());
/* ---------- For populating table with data, purposes only ---------- */
// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.post("/insert", async function insert(req, res) {
//   let brand = req.body.br;
//   let name = req.body.nme;
//   let size = req.body.sz;
//   let color = req.body.clr;
//   let quantity = req.body.qty;
//   let price = req.body.prz;
//   let image = req.body.imgurl;
//   await db.none(
//     "insert into shoe_api_schema.shoe_details (brand, name, size, color, quantity, price, image_url) values($1, $2, $3, $4, $5, $6, $7)",
//     [brand, name, size, color, quantity, price, image]
//   );
//   res.redirect("/");
// });
/* ---------- For populating table with data, purposes only ---------- */

/* -------------- SHOE ROUTES -------------- */
import ShoesApi from "./api/shoes-api.js";
import hideEndpoint from "./middleware/check-auth.js";
const shoesApi = ShoesApi();
app.get("/api/shoes", shoesApi.getAllShoes);
app.get("/api/shoes/:id", shoesApi.getShoeById);
app.get("/api/shoes/brand/:brandname", shoesApi.getAllShoesByBrand);
app.get("/api/shoes/size/:size", shoesApi.getAllShoesBySize);
app.get(
  "/api/shoes/brand/:brandname/size/:size",
  shoesApi.getAllShoesByBrandAndSize
);
app.post("/api/shoes/sold/:id", shoesApi.updateInventory);
app.post("/api/shoes/", hideEndpoint, shoesApi.addShoe);
/* -------------- SHOE ROUTES -------------- */

/* -------------- USERS ROUTES -------------- */
import UsersApi from "./api/users-api.js";
const usersApi = UsersApi();
app.post("/api/users/signup", usersApi.userSignup);
app.post("/api/users/login", usersApi.userLogin);
/* -------------- USERS ROUTES -------------- */

/* -------------- CART ROUTES -------------- */
import CartApi from "./api/cart-api.js";
const cartApi = CartApi();
// app.get("/api/cart/:email", hideEndpoint, cartApi.getCart);
app.get("/api/cart/:email", cartApi.getCart);
app.post("/api/cart/add", cartApi.add);
app.post("/api/cart/remove", cartApi.remove);
app.post("/api/cart/delete", cartApi.deleteCartItem);

/* -------------- CART ROUTES -------------- */

let PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
