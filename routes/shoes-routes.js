import express from "express";
import ShoesApi from "../api/shoes-api.js";
const router = express.Router();
const shoesApi = ShoesApi();
// getting all shoes
router.get("/shoes", shoesApi.getAllShoes);
// filtering brand
router.get("/brand/:brandname", shoesApi.getAllShoesByBrand);
// filtering size
router.get("/size/:size", shoesApi.getAllShoesBySize);
// filtering brand and size
router.get("/brand/:brandname/size/:size", shoesApi.getAllShoesByBrandAndSize);
// updating inventory
// adding a shoe
export default router;
