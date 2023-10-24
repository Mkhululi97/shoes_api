export default function shoeFunctions(db) {
  async function getAllShoes() {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details ORDER BY id ASC"
    );
  }
  async function getAllShoesByBrand(brand) {
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
  async function getAllShoesByBrandAndSize(brand, size) {
    return await db.any(
      "SELECT * FROM shoe_api_schema.shoe_details WHERE brand=$1 AND size=$2",
      [brand, size]
    );
  }
  async function addShoe(shoeDetails) {
    const { brand, name, size, color, quantity, price, image } = shoeDetails;
    await db.none(
      "insert into shoe_api_schema.shoe_details (brand, name, size, color, quantity, price, image_url) values($1, $2, $3, $4, $5, $6, $7)",
      [brand, name, size, color, quantity, price, image]
    );
  }
  async function updateInventory(id) {
    await db.none(
      "UPDATE shoe_api_schema.shoe_details SET quantity = quantity - 1 WHERE id=$1",
      id
    );
    return await db.oneOrNone(
      "SELECT quantity FROM shoe_api_schema.shoe_details WHERE id=$1",
      id
    );
  }
  return {
    getAllShoes,
    getAllShoesByBrand,
    getAllShoesBySize,
    getAllShoesByBrandAndSize,
    addShoe,
    updateInventory,
  };
}
