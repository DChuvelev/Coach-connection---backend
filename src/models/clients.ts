import { userFields, Client, User, findUserByCredentials } from "./userTypes";
import { Schema, model, connect, Model } from "mongoose";

// const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require("bcryptjs");

const clientFields = { ...userFields };

const clientSchema = new Schema<Client>(clientFields);

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

clientSchema.statics.findClientByCredentials = function (email, password) {
  return findUserByCredentials(email, password, this);
};

module.exports = model("client", clientSchema);
