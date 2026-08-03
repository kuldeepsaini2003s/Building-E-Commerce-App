import { Schema, model } from "mongoose";

const shopSchema = Schema({
  name: {
    type: String,
    required: [true, "Please enter your Shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Shop email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "shop",
  },
  avatar: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  transactions: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
    { timestamps: true },
  ],
});

const Shop = model("Shop", shopSchema);

export default Shop