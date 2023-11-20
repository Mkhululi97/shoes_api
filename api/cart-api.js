import cartFunctions from "../services/cart-services.js";
import db from "../database.js";

const CartFunctions = cartFunctions(db);

export default function shoesApi() {
  async function add(req, res) {
    try {
      await CartFunctions.add(req.body.email, req.body.shoe_id);
      res.status(200).json({ message: "shoe added to cart" });
    } catch (err) {
      console.log(err);
    }
  }
  async function remove(req, res, next) {
    try {
      let result = await CartFunctions.remove(req.body.email, req.body.shoe_id);

      if (result === undefined) {
        res.status(201).json({
          message: "Shoe updated on the",
        });
      } else {
        res.status(409).json({ message: result });
        next();
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getCart(req, res) {
    try {
      const inputmail = req.params.email;
      const cart = await CartFunctions.getCart(inputmail);
      return res.status(200).json({ cart });
    } catch (err) {
      res.status(500).json({ message: err.message }); //send errors as json, since this is json api //(500) error on the server not from client
    }
  }
  async function deleteCartItem(req, res) {
    try {
      const inputshoeid = req.body.shoe_id;
      await CartFunctions.deleteCartItem(inputshoeid);
    } catch (err) {
      res.json({ err: err });
      console.log(err);
    }
  }
  async function cartPayment(req, res) {
    try {
      await CartFunctions.cartPayment();
      res.json({ message: "cart cleared" });
    } catch (err) {
      console.log(err);
    }
  }
  return {
    add,
    remove,
    deleteCartItem,
    getCart,
    cartPayment,
  };
}
