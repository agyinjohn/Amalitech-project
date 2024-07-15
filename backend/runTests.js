const newman = require("newman");

newman.run(
  {
    collection: require("./test/Bespoke.postman_collection.json"), // point to your Postman collection JSON file
    // point to your Postman environment JSON file, if any
    reporters: "cli",
  },
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Collection run complete!");
  }
);
