import mongoose, { Schema, model } from "mongoose";

export interface Message {
  text: string;
  date: string;
  authorId: string;
}

export interface ChatMember {
  _id: string;
  role: string;
}

export interface Chat {
  _id: string;
  messages: Message[];
  members: ChatMember[];
}

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  // author: {
  //   type:
  // }
});

const chatFields = {
  messages: [{}],
};
