import express from "express";
import ShoesApi from "../api/shoes-api.js";
const router = express.Router();
const shoesApi = ShoesApi();

// getting all shoes
// (/) = /api/shoes
router.get("/", shoesApi.getAllShoes);
// filtering brand
router.get("/brand/:brandname", shoesApi.getAllShoesByBrand);
// filtering size
router.get("/size/:size", shoesApi.getAllShoesBySize);
// filtering brand and size
router.get("/brand/:brandname/size/:size", shoesApi.getAllShoesByBrandAndSize);
// updating inventory
router.post("/sold/:id", shoesApi.updateInventory);
// adding a shoe
router.post("/", shoesApi.addShoe);
export default router;
