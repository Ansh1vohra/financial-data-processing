const dotenv = require("dotenv");

dotenv.config();

const { connectToDatabase } = require("../src/config/db");
const User = require("../src/models/user.model");
const { ROLES } = require("../src/constants/roles");

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME || "Admin User";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment. Add them to .env before running seed:admin."
    );
  }

  await connectToDatabase();

  const existingAdmin = await User.findOne({ email: email.toLowerCase() });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.role = ROLES.ADMIN;
    existingAdmin.isActive = true;

    if (password) {
      existingAdmin.password = password;
    }

    await existingAdmin.save();

    console.log(`Updated existing admin user: ${existingAdmin.email}`);
    process.exit(0);
  }

  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: ROLES.ADMIN,
    isActive: true,
  });

  console.log(`Admin user created successfully: ${admin.email}`);
  process.exit(0);
};

createAdmin().catch((error) => {
  console.error("Failed to create admin user", error.message);
  process.exit(1);
});
