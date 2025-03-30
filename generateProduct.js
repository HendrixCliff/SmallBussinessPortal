const { faker } = require("@faker-js/faker");
const Product = require("./models/productSchema"); // Import your Mongoose model

const generateRandomProducts = async (count = 10) => {
  let products = [];

  for (let i = 0; i < count; i++) {
    const product = new Product({
      name: faker.commerce.productName(),
      price: faker.commerce.price(10, 1000, 2), // Random price between $10 - $1000
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 1, max: 100 }), // Random stock 1-100
      category: faker.helpers.arrayElement(["Electronics", "Clothing", "Home", "Toys", "Beauty"]),
      imageUrls: [faker.image.urlLoremFlickr({ category: "product" })], // Random product image
    });

    products.push(product);
  }

  // Insert all products into the database
  await Product.insertMany(products);
  console.log(`${count} random products added to the database!`);
};

// Run the function
generateRandomProducts(20)
  .then(() => process.exit())
  .catch((err) => {
    console.error("Error generating products:", err);
    process.exit(1);
  });
