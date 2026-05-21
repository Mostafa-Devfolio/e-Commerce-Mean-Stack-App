import type { NextFunction } from 'express';
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import type { IUser } from "../../interface/User.interface.ts";

const addresses = [
  {
    label: {
      type: String,
      enum: ["home", "work", "other"],
    },
    addressText: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
];

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: addresses,
    gender: {
      type: String,
      enum: ["male", "female"],
      required: false,
      default: "male"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    emailConsent: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  // If password is not modified, exit the hook early
  if (!this.isModified("password")) return;

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // No need to call next() at the end!
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
