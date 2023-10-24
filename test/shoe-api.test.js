/* ####### BRING IN ASSERT ####### */
import assert from "assert";
/* ##### BRING IN THE DATABASE ##### */
import db from "../database.js";
/* ##### BRING IN THE DATABASE FACTORY FUNCTION ##### */
import ShoeFunctions from "../services/shoes-services.js";
describe("Test Shoe Functions", function () {
  /* SOLVE THE TIMEOUT OF 2000MS EXCEEDED EEROR */
  this.timeout(3000);

  describe("getAllShoes function", function () {
    it("should retrieve all the shoes from the database", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        const shoesArr = await shoeFunctions.getAllShoes();
        assert.equal(19, shoesArr.length);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("getAllShoesByBrand function", function () {
    it("should retrieve all the shoes from the database by brand", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        const shoesArr = await shoeFunctions.getAllShoesByBrand("Moschino");
        assert.equal(14, shoesArr.length);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("getAllShoesBySize function", function () {
    it("should retrieve all the shoes from the database by size", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        const shoesArr = await shoeFunctions.getAllShoesBySize("7");
        assert.equal(5, shoesArr.length);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("getAllShoesByBrandAndSize function", function () {
    it("should retrieve all the shoes from the database by brand and size", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        const shoesArr = await shoeFunctions.getAllShoesByBrandAndSize(
          "zanotti",
          "7"
        );
        assert.equal(1, shoesArr.length);
      } catch (err) {
        console.log(err);
      }
    });
  });
});
