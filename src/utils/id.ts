import mongoose from "mongoose";

export const objectId = (id?: string): mongoose.Types.ObjectId =>
  new mongoose.Types.ObjectId(id);
