import users from "../services/users-services.js";
import db from "../database.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Users = users(db);
export default function usersApi() {
  async function userSignup(req, res, next) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        try {
          await Users.userSignup({
            password: hash,
            email: req.body.email,
            is_admin: req.body.is_admin,
          });
          res.status(201).json({
            message: "User Created",
          });
        } catch (err) {
          res.status(409).json({ message: "Mail Exists" });
        }
      }
    });
  }

  async function userLogin(req, res, next) {
    try {
      let user = await Users.userLogin({ email: req.body.email });
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log(result, err);
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
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
          res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "Auth failed",
      });
    }
  }

  return {
    userSignup,
    userLogin,
  };
}
