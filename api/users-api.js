import users from "../services/users-services.js";
import cartFunctions from "../services/cart-services.js";
import db from "../database.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Users = users(db);
const CartFunctions = cartFunctions(db);
export default function usersApi() {
  async function userSignup(req, res, next) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        let result;
        try {
          result = await Users.userSignup({
            password: hash,
            email: req.body.email,
            is_admin: req.body.is_admin,
          });
          if (result === undefined) {
            res.status(201).json({
              message: "User Created",
            });
          } else {
            res.json({ message: result });
            next();
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  async function userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      //get the count of items in cart for the active user.
      let itemsInCart = await CartFunctions.countItemsInCart(email);
      let user = await Users.userLogin({ email });
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            message: "Auth failed from password compare",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              id: user.id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          user = { email: user.email, is_admin: user.is_admin };

          return res.status(200).json({
            user: user,
            message: "Auth successful",
            token: token,
            itemsInCart,
          });
        } else {
          return res.json({
            message: user,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "Auth failed from catch",
      });
    }
  }

  return {
    userSignup,
    userLogin,
  };
}
