import mongoose from "mongoose";

export class BaseModel {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
