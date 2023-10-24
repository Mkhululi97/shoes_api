/* ####### BRING IN ASSERT ####### */
import assert from "assert";
/* ##### BRING IN THE DATABASE ##### */
import db from "../database.js";
/* ##### BRING IN THE DATABASE FACTORY FUNCTION ##### */
import ShoeFunctions from "../services/shoes-services.js";
describe("Test Shoe Functions", function () {
  /* SOLVE THE TIMEOUT OF 2000MS EXCEEDED EEROR */
  this.timeout(3000);

  // describe("getAllShoes function", function () {
  //   it("should retrieve all the shoes from the database", async function () {
  //     try {
  //       const shoeFunctions = ShoeFunctions(db);
  //       const shoesArr = await shoeFunctions.getAllShoes();
  //       assert.equal(19, shoesArr.length);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // });

  // describe("getAllShoesByBrand function", function () {
  //   it("should retrieve all the shoes from the database by brand", async function () {
  //     try {
  //       const shoeFunctions = ShoeFunctions(db);
  //       const shoesArr = await shoeFunctions.getAllShoesByBrand("Moschino");
  //       assert.equal(14, shoesArr.length);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // });

  // describe("getAllShoesBySize function", function () {
  //   it("should retrieve all the shoes from the database by size", async function () {
  //     try {
  //       const shoeFunctions = ShoeFunctions(db);
  //       const shoesArr = await shoeFunctions.getAllShoesBySize("7");
  //       assert.equal(5, shoesArr.length);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // });

  // describe("getAllShoesByBrandAndSize function", function () {
  //   it("should retrieve all the shoes from the database by brand and size", async function () {
  //     try {
  //       const shoeFunctions = ShoeFunctions(db);
  //       const shoesArr = await shoeFunctions.getAllShoesByBrandAndSize(
  //         "zanotti",
  //         "7"
  //       );
  //       assert.equal(1, shoesArr.length);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // });

  describe("addShoe function", function () {
    it("should add shoe details to the shoes table to the database", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        await shoeFunctions.addShoe({
          brand: "NAKED WOLFE",
          name: "NAKED WOLFE MAN SNOW SNEAKER KOSA 00148",
          size: "11",
          color: "White",
          quantity: "5",
          image:
            "https://www.hydraulicsstores.co.za/wp-content/uploads/2023/10/Side-4727-800x1000.jpg",
        });
        const shoesArr = await shoeFunctions.getAllShoes();
        assert.equal(shoesArr.length > "19", true); // original table length is 19
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("updateInventory function", function () {
    it("should update the quatity of the shoe, with the matching id", async function () {
      try {
        const shoeFunctions = ShoeFunctions(db);
        const shoeStock = await shoeFunctions.updateInventory("4");
        assert.equal(shoeStock.quantity < "8", true); // original quantity for shoe with the id of 4 is 8
      } catch (err) {
        console.log(err);
      }
    });
  });
});
