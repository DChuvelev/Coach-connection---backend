import { userFields, Coach, findUserByCredentials } from "./userTypes";
import { Schema, model, connect, Model } from "mongoose";

// const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require("bcryptjs");

const coachFields = { ...userFields };

const coachSchema = new Schema<Coach>(coachFields);

// clientSchema.statics.findUserByCredentials = function (email, password) {
//   if (!email || !password) {
//     return Promise.reject(new Error("Invalid data"));
//   }
//   return this.findOne({ email })
//     .select("+password")
//     .then((user: Client) => {
//       console.log(user);
//       if (!user) {
//         return Promise.reject(new Error("Incorrect username or password"));
//       }
//       return bcrypt
//         .compare(password, user.password)
//         .then((matched: boolean) => {
//           if (!matched) {
//             return Promise.reject(new Error("Incorrect username or password"));
//           }
//           return user;
//         });
//     });
// };

coachSchema.statics.findCoachByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};

module.exports = model("coach", coachSchema);
