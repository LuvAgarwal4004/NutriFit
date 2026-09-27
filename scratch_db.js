const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://luvag0707_db_user:ezvjSg8jeeKhUe10@cluster0.ltcwutt.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  
  const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    isDiscount: Boolean,
    discountedPrice: Number,
    discountPercent: Number
  }, { strict: false });

  const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

  const existing = await Product.findOne({ title: "Free Fuel for Fitness (3-4 days of protein snacks + bottle)" });
  if (!existing) {
    const p = await Product.create({
      title: "Free Fuel for Fitness (3-4 days of protein snacks + bottle)",
      price: 0,
      image: "https://res.cloudinary.com/dxytdtu3y/image/upload/v1727429188/protein_bottle_m7yxyi.png", // just some image or omit
      category: "Reward",
      description: "You won this from the fitness game! Enjoy your free snacks and bottle.",
      isDiscount: false,
      discountedPrice: 0,
      discountPercent: 0,
      _id: new mongoose.Types.ObjectId("600000000000000000000000") // stable ID so we can hardcode it in frontend
    });
    console.log("Created product", p);
  } else {
    console.log("Already exists", existing);
  }
  process.exit(0);
}
run();
