export default function shoeFunctions(db) {
  async function add(email, shoe_id) {
    try {
      let user_id = await db.any(
        `SELECT id FROM shoe_api_schema.users WHERE email=$1`,
        [email]
      );
      let cartcheck = await db.oneOrNone(
        `SELECT id FROM shoe_api_schema.cart WHERE user_id=$1`,
        [user_id[0].id]
      );
      // //insert into the cart table the id of the user with matching email
      if (cartcheck === null) {
        await db.any(`INSERT INTO shoe_api_schema.cart (user_id) VALUES($1)`, [
          user_id[0].id,
        ]);
      }
      //insert into the orders table the:
      //check shoe_id exists
      let shoeexist = await db.any(
        `SELECT id FROM shoe_api_schema.orders WHERE shoe_id=$1`,
        [shoe_id]
      );
      //qty=> increment when shoe_id exists or set default to 1
      //shoe_id=> insert only when shoe_id does not exist
      //cart_id=> same user_id
      if (shoeexist.length > 0) {
        await db.none(
          `UPDATE shoe_api_schema.orders SET qty = qty + 1 WHERE shoe_id=$1 AND cart_id=$2`,
          [shoe_id, user_id[0].id]
        );
      } else {
        await db.none(
          `INSERT INTO shoe_api_schema.orders (qty, shoe_id, cart_id) VALUES ($1,$2,$3)`,
          [1, shoe_id, user_id[0].id]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function remove(email, shoe_id) {
    let error;
    try {
      let user_id = await db.any(
        `SELECT id FROM shoe_api_schema.users WHERE email=$1`,
        [email]
      );
      let quantity = await db.oneOrNone(
        `SELECT qty FROM shoe_api_schema.orders WHERE shoe_id=$1`,
        [shoe_id]
      );
      if (quantity) {
        if (quantity.qty === 1) {
          await db.none(
            `DELETE FROM shoe_api_schema.orders WHERE shoe_id=$1 AND cart_id=$2`,
            [shoe_id, user_id[0].id]
          );
        } else if (quantity.qty > 0) {
          await db.none(
            `UPDATE shoe_api_schema.orders SET qty = qty - 1 WHERE shoe_id=$1 AND cart_id=$2`,
            [shoe_id, user_id[0].id]
          );
        }
      } else {
        error = "shoe is not on cart";
      }
    } catch (err) {
      console.log(err);
    }
    return error;
  }
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
    add,
    remove,
    getCart,
  };
}
