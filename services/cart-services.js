export default function Cart(db) {
  async function add(email, shoe_id) {
    try {
      //find active user's id by email.
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
        `SELECT id FROM shoe_api_schema.orders WHERE shoe_id=$1 AND cart_id =$2`,
        [shoe_id, user_id[0].id]
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
      return { email };
    } catch (err) {
      console.log(err);
    }
  }
  async function remove(email, shoe_id) {
    let error;
    try {
      //find active user's id by email.
      let user_id = await db.any(
        `SELECT id FROM shoe_api_schema.users WHERE email=$1`,
        [email]
      );
      //find the quantity of the shoe's id in the cart for the active user.
      let quantity = await db.any(
        `SELECT qty FROM shoe_api_schema.orders WHERE shoe_id=$1 AND cart_id=$2`,
        [shoe_id, user_id[0].id]
      );
      //get quantity of shoe's id, from the object returned.
      quantity = quantity[0].qty;
      //remove the shoe from the cart when it's qty is one.
      if (quantity === 1) {
        await db.none(
          `DELETE FROM shoe_api_schema.orders WHERE shoe_id=$1 AND cart_id=$2`,
          [shoe_id, user_id[0].id]
        );
      }
      //decrease the shoe's qty by one, when it's qty is more than one.
      else if (quantity > 0) {
        await db.none(
          `UPDATE shoe_api_schema.orders SET qty = qty - 1 WHERE shoe_id=$1 AND cart_id=$2`,
          [shoe_id, user_id[0].id]
        );
      }
      // throw an error when the shoes has not be added to the cart yet.
      else {
        error = "shoe id is not in the cart";
      }
    } catch (err) {
      console.log(err);
    }
    return { error, email };
  }
  async function countItemsInCart(userObj) {
    let { email } = userObj;
    email === undefined ? (email = userObj) : "";
    let itemsInCart = await db.oneOrNone(
      `SELECT SUM (qty) AS items_in_cart
      FROM shoe_api_schema.orders AS orders
      INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
      INNER JOIN shoe_api_schema.cart AS cart ON cart.user_id=orders.cart_id
      INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
      WHERE email=$1`,
      email
    );
    return itemsInCart["items_in_cart"] || 0;
  }
  let totalCart = 0;
  let shoesArr;

  async function getCart(email) {
    totalCart = 0;
    let totalShoe;
    try {
      //get cart id by user's email
      let cartid = await db.oneOrNone(
        "SELECT id FROM shoe_api_schema.users WHERE email=$1",
        [email]
      );
      //get orders by cart id
      let cartIdCheck = await db.any(
        "SELECT * FROM shoe_api_schema.orders WHERE cart_id=$1",
        [cartid.id]
      );
      //when user has items in their cart
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
      }
      //when user's cart is empty
      else {
        shoesArr = [];
        return { cartIdCheck, totalCart, shoesArr };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteCartItem(shoe_id, email) {
    try {
      //find active user's id by email.
      let user_id = await db.any(
        `SELECT id FROM shoe_api_schema.users WHERE email=$1`,
        [email]
      );
      await db.none(
        "DELETE FROM shoe_api_schema.orders WHERE shoe_id=$1 AND cart_id=$2",
        [shoe_id, user_id[0].id]
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function shoeSold() {
    let message;
    let shoesLeft;
    //decrease the stock count for each shoe that's on the cart, from storage
    if (shoesArr !== undefined) {
      await Promise.all(
        shoesArr.map(async (shoe) => {
          shoesLeft = await db.oneOrNone(
            "SELECT quantity FROM shoe_api_schema.shoe_details WHERE id=$1",
            [shoe.shoe_id]
          );
          //default for shoes out stock should be zero, not a negative number
          shoesLeft.quantity < 0
            ? await db.none(
                `UPDATE shoe_api_schema.shoe_details SET quantity = 0 WHERE id=$1`,
                [shoe.shoe_id, shoe.qty]
              )
            : "";
          if (shoesLeft.quantity > 0) {
            await db.none(
              `UPDATE shoe_api_schema.shoe_details SET quantity =  quantity - $2 WHERE id=$1`,
              [shoe.shoe_id, shoe.qty]
            );
            shoesLeft = await db.oneOrNone(
              "SELECT quantity FROM shoe_api_schema.shoe_details WHERE id=$1",
              [shoe.shoe_id]
            );
            message = "shoe stock adjusted";
          } else {
            message = "shoe sold out";
          }
        })
      );
    }
    return { shoesLeft, message };
  }
  async function cartPayment(email, paymentAmount) {
    try {
      let totalCart = await db.oneOrNone(
        `SELECT SUM(qty * new_price) AS totalCart
    FROM shoe_api_schema.orders AS orders
    INNER JOIN shoe_api_schema.shoe_details AS shoe_det ON shoe_det.id=orders.shoe_id
    INNER JOIN shoe_api_schema.cart AS cart ON cart.user_id=orders.cart_id
    INNER JOIN shoe_api_schema.users AS users ON users.id=cart.user_id
    WHERE email=$1
    `,
        [email]
      );
      totalCart = totalCart["totalcart"];
      let message;
      let user = await db.oneOrNone(
        "SELECT id FROM shoe_api_schema.users WHERE email=$1",
        [email]
      );
      if (paymentAmount < totalCart) {
        return (message = "Insufficient funds");
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
        // await db.none(
        // "ALTER SEQUENCE shoe_api_schema.cart_id_seq RESTART WITH 1"
        // );
        await db.none(
          "ALTER SEQUENCE shoe_api_schema.orders_id_seq RESTART WITH 1"
        );
        shoeSold();
        return (message = "Payment Successful");
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
    countItemsInCart,
  };
}
