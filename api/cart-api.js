import cartFunctions from "../services/cart-services.js";
import db from "../database.js";

const CartFunctions = cartFunctions(db);

export default function shoesApi() {
  async function getCart(req, res) {
    try {
      const inputmail = req.params.email;
      const cart = await CartFunctions.getCart(inputmail);
      return res.status(200).json({ cart });
    } catch (err) {
      res.status(500).json({ message: err.message }); //send errors as json, since this is json api //(500) error on the server not from client
    }
  }

  return {
    getCart,
  };
}
