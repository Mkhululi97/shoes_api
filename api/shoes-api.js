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
  async function getShoeById(req, res) {
    try {
      const shoeDetails = await ShoeFunctions.getShoeById(req.params.id);
      res.status(200).json(shoeDetails);
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
  async function getAllShoesByColor(req, res) {
    try {
      const shoeListByColor = await ShoeFunctions.getAllShoesByColor(
        req.params.color
      );
      res.status(200).json(shoeListByColor);
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
  async function getAllShoesByBrandAndColor(req, res) {
    try {
      const shoeListByBrandAndColor =
        await ShoeFunctions.getAllShoesByBrandAndColor(
          req.params.brandname,
          req.params.color
        );
      res.status(200).json(shoeListByBrandAndColor);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllShoesBySizeAndColor(req, res) {
    try {
      const shoeListBySizeAndColor =
        await ShoeFunctions.getAllShoesBySizeAndColor(
          req.params.size,
          req.params.color
        );
      res.status(200).json(shoeListBySizeAndColor);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllShoesByBrandAndSizeAndColor(req, res) {
    try {
      const shoeListByBrandAndSizeAndColor =
        await ShoeFunctions.getAllShoesByBrandAndSizeAndColor({
          brand: req.params.brandname,
          size: req.params.size,
          color: req.params.color,
        });
      res.status.json(shoeListByBrandAndSizeAndColor);
    } catch (err) {
      console.log(err);
    }
  }
  async function addShoe(req, res) {
    try {
      await ShoeFunctions.addShoe({
        brand: req.body.brand,
        name: req.body.name,
        size: req.body.size,
        color: req.body.color,
        quantity: req.body.quantity,
        image_url: req.body.image_url,
        new_price: req.body.new_price,
      });
      res.status(201).json({ message: "Shoe added to the database" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message }); //send errors as json, since this is json api //(500) error on the server not from client
    }
  }
  async function updateInventory(req, res) {
    try {
      let result = await ShoeFunctions.updateInventory(req.params.id);
      res.status(201).json(result);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
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
