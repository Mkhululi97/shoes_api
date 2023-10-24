export default function shoeFunctions(db) {
  async function getAllShoes() {
    return await db.any("SELECT * FROM shoe_api_schema.shoe_details");
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
  return {
    getAllShoes,
    getAllShoesByBrand,
    getAllShoesBySize,
    getAllShoesByBrandAndSize,
  };
}
