export default function Cart(db) {
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
      //insert into the cart table the id of the user with matching email
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
      //cart_id=> same as user_id
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
  let totalCart = 0;
  let shoesArr;
  async function getCart(email) {
    totalCart = 0;
    let totalShoe;
    let cartIdCheck = await db.any("SELECT * FROM shoe_api_schema.orders");
    if (cartIdCheck.length > 0) {
      let cartid = await db.any(
        `SELECT cart_id
       FROM shoe_api_schema.orders AS orders
       INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
       INNER JOIN shoe_api_schema.cart AS cart ON cart.user_id=orders.cart_id
       INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
       WHERE email=$1`,
        [email]
      );

      shoesArr = await db.any(
        `SELECT shoe_id, name, qty, size, new_price, image_url, (qty*new_price) AS total
      FROM shoe_api_schema.orders AS orders
      INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
      INNER JOIN shoe_api_schema.cart AS cart ON cart.user_id=orders.cart_id
      INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
      WHERE email=$1`,
        [email]
      );
      shoesArr.forEach((shoe) => {
        totalShoe = shoe.qty * shoe.new_price;
        totalCart += totalShoe;
      });
      cartid = cartid[0].cart_id;
      return { cartid, email, shoesArr, totalCart };
    } else {
      return { cartIdCheck, totalCart };
    }
  }
  async function deleteCartItem(shoe_id) {
    await db.none("DELETE FROM shoe_api_schema.orders WHERE shoe_id=$1", [
      shoe_id,
    ]);
  }
  async function shoeSold() {
    if (shoesArr !== undefined) {
      await Promise.all(
        shoesArr.map(async (shoe) => {
          await db.none(
            `UPDATE shoe_api_schema.shoe_details SET quantity =  quantity - $2 WHERE id=$1`,
            [shoe.shoe_id, shoe.qty]
          );
        })
      );
    }
  }
  async function cartPayment(email, paymentAmount) {
    try {
    let totalCart = await db.oneOrNone(`SELECT SUM(qty * new_price) AS totalCart
    FROM shoe_api_schema.orders AS orders
    INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
    INNER JOIN shoe_api_schema.cart AS cart ON cart.user_id=orders.cart_id
    INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
    WHERE email='user@test.com'
    `)
    totalCart = totalCart["totalcart"]
      let message;
      let user = await db.oneOrNone(
        "SELECT id FROM shoe_api_schema.users WHERE email=$1",
        [email]
      );
      if(paymentAmount < totalCart){
        return message='Insufficient funds'
      }
      if (user !== null && Number(paymentAmount) >= totalCart) {
        //remove user from cart table
        await db.none("DELETE FROM shoe_api_schema.cart WHERE user_id=$1", [
          user.id,
        ]);
        //remove user order(s)
        await db.none("DELETE FROM shoe_api_schema.orders WHERE cart_id=$1", [
          user.id,
        ]);
        await db.none(
          "ALTER SEQUENCE shoe_api_schema.cart_id_seq RESTART WITH 1"
        );
        await db.none(
          "ALTER SEQUENCE shoe_api_schema.orders_id_seq RESTART WITH 1"
        );
        shoeSold();
        return message="Payment Successful"
      }
    } catch (err) {
      console.log(err, "from cartPayment function");
    }
  }
  return {
    add,
    remove,
    deleteCartItem,
    getCart,
    cartPayment,
    shoeSold,
  };
}
