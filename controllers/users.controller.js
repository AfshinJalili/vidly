"use strict";

import User from "../models/user.model.js";
import _ from "lodash";
import bcrypt from "bcrypt";

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-password -__v");
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

export async function createUser(req, res) {

    if (await userExists(req.body.email))
        res.status(400).json('This email is already existing!');
    else
        await saveUser(new_User(req.body));


    async function userExists(email) {
        try {
            return await User.findOne({email});
        } catch (err) {
            res.status(500).json(err.message);
            return false;
        }
    }

    async function saveUser(user) {
        try {
            user.password = await hashPassword(user.password);
            await user.save();

            const token = user.generateAuthToken();
            res.status(200).header('x-auth-token', token).json(_.pick(user, ['_id', 'name', 'email']));
        } catch (err) {
            res.status(500).json(err.message);
        }

        async function hashPassword(password) {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        }
    }

    function new_User(reqBody) {
        return new User(_.pick(reqBody, ["name", 'email', 'password']));

    }
}











