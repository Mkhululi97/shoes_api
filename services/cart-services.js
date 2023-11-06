export default function shoeFunctions(db) {
  async function getCart(email) {
    let cartid = await db.any(
      `SELECT cart_id
       FROM shoe_api_schema.orders AS orders
       INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
       INNER JOIN shoe_api_schema.cart AS cart ON cart.id=orders.cart_id
       INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
       WHERE email=$1`,
      [email]
    );
    let shoesArr = await db.any(
      `SELECT shoe_id, name, qty, size, new_price
      FROM shoe_api_schema.orders AS orders
      INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
      INNER JOIN shoe_api_schema.cart AS cart ON cart.id=orders.cart_id
      INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
      WHERE email=$1`,
      [email]
    );
    let total = await db.any(
      `SELECT SUM (new_price)
      FROM shoe_api_schema.orders AS orders
      INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
      INNER JOIN shoe_api_schema.cart AS cart ON cart.id=orders.cart_id
      INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
      WHERE email=$1`,
      [email]
    );
    cartid = cartid[0].cart_id;
    total = total[0].sum;
    return { cartid, email, shoesArr, total };
  }
  return {
    getCart,
  };
}
