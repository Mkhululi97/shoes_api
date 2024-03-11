export default function shoeFunctions(db) {
  async function getAllShoes() {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details ORDER BY id DESC"
    );
  }
  async function getShoeById(id) {
    return await db.oneOrNone(
      "SELECT brand,name,size,color,new_price FROM shoe_api_schema.shoe_details WHERE id=$1",
      id
    );
  }
  async function getAllShoesByBrand(brand) {
    brand = brand.toUpperCase();
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE brand=$1",
      [brand]
    );
  }
  async function getAllShoesBySize(size) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE size=$1",
      [size]
    );
  }
  async function getAllShoesByColor(color) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE color=$1",
      [color]
    );
  }

  async function getAllShoesByBrandAndSize(brand, size) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE brand=$1 AND size=$2",
      [brand, size]
    );
  }
  async function getAllShoesByBrandAndColor(brand, color) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE brand=$1 AND color=$2",
      [brand, color]
    );
  }
  async function getAllShoesBySizeAndColor(size, color) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE size=$1 AND color=$2",
      [size, color]
    );
  }
  async function getAllShoesByBrandAndSizeAndColor(shoeDetails) {
    const { brand, size, color } = shoeDetails;
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE brand=$1 AND size=$2 AND color=$3",
      [brand, size, color]
    );
  }
  async function addShoe(shoeDetails) {
    const { brand, name, size, color, quantity, image_url, new_price } =
      shoeDetails;
    await db.none(
      "INSERT INTO shoe_api_schema.shoe_details (brand, name, size, color, quantity, image_url, new_price) values($1, $2, $3, $4, $5, $6, $7)",
      [brand, name, size, color, quantity, image_url, new_price]
    );
  }
  async function updateInventory(id) {
    let message;
    let shoesLeft = await db.oneOrNone(
      "SELECT quantity FROM shoe_api_schema.shoe_details WHERE id=$1",
      [id]
    );
    if (shoesLeft.quantity > 0) {
      await db.none(
        "UPDATE shoe_api_schema.shoe_details SET quantity = quantity - 1 WHERE id=$1",
        id
      );
      message = "shoe stock adjusted";
    } else {
      message = "shoe sold out";
    }
    shoesLeft = shoesLeft.quantity;
    return { shoesLeft, message };
  }
  return {
    getAllShoes,
    getShoeById,
    getAllShoesByBrand,
    getAllShoesBySize,
    getAllShoesByColor,
    getAllShoesByBrandAndSize,
    getAllShoesByBrandAndColor,
    getAllShoesBySizeAndColor,
    getAllShoesByBrandAndSizeAndColor,
    addShoe,
    updateInventory,
  };
}
