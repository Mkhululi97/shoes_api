import shoeFunctions from "../services/shoes-services.js";
import db from "../database.js";

const ShoeFunctions = shoeFunctions(db);

export default function shoesApi() {
  async function getAllShoes(req, res) {
    try {
      const shoeList = await ShoeFunctions.getAllShoes();
      res.status(200).json(shoeList);
    } catch (err) {
      res.status(500).json({ message: err.message }); //send errors as json, since this is json api //(500) error on the server not from client
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
  async function addShoe(req, res) {
    try {
      const addShoeToList = await ShoeFunctions.addShoe({
        brand: req.body.brand,
        name: req.body.name,
        size: req.body.size,
        color: req.body.color,
        quantity: req.body.quantity,
        price: req.body.price,
        image: req.body.image,
      });
      res.status(201).json({ message: "Shoe added to the database" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message }); //send errors as json, since this is json api //(500) error on the server not from client
    }
  }
  async function updateInventory(req, res) {
    try {
      await ShoeFunctions.updateInventory(req.params.id);
      res
        .status(201)
        .json({ message: `Quantity for ${req.params.id} shoe updated` });
    } catch (err) {
      console.log(err);
    }
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
