import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { UserModel } from "./models";
import { documentId } from "./libs";
import { UserRole } from "./enums";

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to Database.");

    const adminEmail = "admin@example.com";
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin user already exists. Skipping seeder.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123!", salt);

      await UserModel.create({
        id: documentId(),
        email: adminEmail,
        password: hashedPassword,
        fullName: "System Admin",
        role: UserRole.ADMIN,
        emailVerified: true,
      });

      console.log(`Admin user created successfully.`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: Admin@123!`);
    }

    console.log("Seeder executed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error executing seeder:", error);
    process.exit(1);
  }
}

seed();
