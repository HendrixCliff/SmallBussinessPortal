const Business = require("./../models/businessSchema");
const {validationResult } = require("express-validator");
const slugify =  require("slugify");

exports.recallBusinesses = asyncErrorHandler(async (req, res) => {
        try {
          const business = await Business.findOne({ slug: req.params.slug });
      
          if (!business) {
            return res.status(404).json({ message: "Business not found" });
          }
      
          res.json(business);
        } catch (error) {
          res.status(500).json({ message: "Server error" });
        }
});

exports.registerBusiness = asyncErrorHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, location, contact, logo, category } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const business = await Business.create({
      name,
      slug,
      description,
      location,
      contact,
      logo,
      category,
      owner: req.user._id,
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

exports.searchBusinesses = asyncErrorHandler(
    async (req, res) => {
        try {
          const query = req.query.q;
          const businesses = await Business.find({ name: { $regex: query, $options: "i" } });
          res.json(businesses);
        } catch (error) {
          res.status(500).json({ message: "Server Error" });
        }
      });