import cartFunctions from "../services/cart-services.js";
import db from "../database.js";

const CartFunctions = cartFunctions(db);

export default function shoesApi() {
  //update counter for the number of items in cart
  async function countItemsInCart(data) {
    return await CartFunctions.countItemsInCart(data);
  }
  async function add(req, res) {
    try {
      let result = await CartFunctions.add(req.body.email, req.body.shoe_id);
      //get counter for the number of items in cart
      let cartItemsCounter = await countItemsInCart(result);
      let getCart = await CartFunctions.getCart(req.body.email);
      res.status(200).json({
        message: "shoe added to cart",
        itemsInCart: cartItemsCounter,
        cart: getCart,
      });
    } catch (err) {
      console.log(err);
    }
  }
  async function remove(req, res, next) {
    try {
      let result = await CartFunctions.remove(req.body.email, req.body.shoe_id);
      let cartItemsCounter = await countItemsInCart(result);
      let getCart = await CartFunctions.getCart(req.body.email);
      if (result === undefined) {
        res.status(201).json({
          message: "Shoe updated on the",
        });
      } else {
        res.status(200).json({
          response: result,
          itemsInCart: cartItemsCounter,
          cart: getCart,
        });
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
      const { shoe_id, email } = req.body;
      await CartFunctions.deleteCartItem(shoe_id, email);
      let getCart = await CartFunctions.getCart(req.body.email);
      let cartItemsCounter = await countItemsInCart(email);
      res.status(200).json({ itemsInCart: cartItemsCounter, cart: getCart });
    } catch (err) {
      res.json({ err: err });
      console.log(err);
    }
  }
  async function shoeSold(req, res) {
    try {
      let result = await CartFunctions.shoeSold();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
  async function cartPayment(req, res) {
    try {
      let results = await CartFunctions.cartPayment(
        req.body.email,
        req.body.payment
      );
      res.json({ message: results }); //fix. to add cart cleared when
      //payment requirments have been met
    } catch (err) {
      console.log(err, "from api");
    }
  }
  return {
    add,
    remove,
    deleteCartItem,
    getCart,
    cartPayment,
    shoeSold,
    countItemsInCart,
  };
}
