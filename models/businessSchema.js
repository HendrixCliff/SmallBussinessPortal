import mongoose from "mongoose";
import slugify from "slugify";

const BusinessSchema = new mongoose.Schema(
  {
    name: {
         type: String,
          required: true, 
          unique: true 
        },
    slug: { 
        type: String, 
        unique: true 
    },
    owner: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "User", 
         required: true
         },
    description: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true },
    contact: { 
        type: String, 
        required: true
     },
    logo: { 
        type: String 
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    category: { type: String, required: true },
  },  
  { timestamps: true }
);

// ✅ Auto-generate slug before saving
BusinessSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});



export default mongoose.model("Business", BusinessSchema);
