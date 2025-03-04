import db from "../config/database.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        return res.status(200).json({ message: "Hello Hostcode" });
    } catch (e) {
        console.log("Error occured while processing");
        console.log(e);
    }
};


export const loginUser = async (req, res) => {
    try {
        return res.status(200).json({ message: "Hello Hostcode" });
    } catch (e) {
        console.log("Error occured while processing");
        console.log(e);
    }
};
