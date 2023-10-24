import shoeFunctions from "../services/shoes-services.js";
import db from "../database.js";

const ShoeFunctions = shoeFunctions(db);

export default function shoesApi() {
  async function getAllShoes(req, res) {
    try {
      const shoeList = await ShoeFunctions.getAllShoes();
      res.status(200).json(shoeList);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllShoesByBrand(req, res) {
    try {
      const shoeListByBrand = await ShoeFunctions.getAllShoesByBrand(
        req.params.brandname
      );
      res.status(200).json(shoeListByBrand);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllShoesBySize(req, res) {
    try {
      const shoeListBySize = await ShoeFunctions.getAllShoesBySize(
        req.params.size
      );
      res.status(200).json(shoeListBySize);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllShoesByBrandAndSize(req, res) {
    try {
      const shoeListByBrandAndSize =
        await ShoeFunctions.getAllShoesByBrandAndSize(
          req.params.brandname,
          req.params.size
        );
      res.status(200).json(shoeListByBrandAndSize);
    } catch (err) {
      console.log(err);
    }
  }
  return {
    getAllShoes,
    getAllShoesByBrand,
    getAllShoesBySize,
    getAllShoesByBrandAndSize,
  };
}
