"use strict";

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config.js";

export async function signIn(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) return res.status(400).json("Invalid email or password");

            const validPassword = await bcrypt.compare(req.body.password, user?.password);
            if (!validPassword) return res.status(400).json("Invalid email or password");

            const token = jwt.sign({ _id: user?._id }, config.jwtSecret);
            res.status(200).json(token);
        } catch (err) {
            res.status(500).json(err.message);
        }
}