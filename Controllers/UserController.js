import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
// get a User
export const getUser = async (req, res) => {
    //fetch the id of the user from request
    const id = req.params.id;

    try {
        //check if user exists in the dsatabase
        const user = await UserModel.findById(id);

        if (user) {
            //if user exists
            //send everything excluding password
            const { password, ...otherDetails } = user._doc;

            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("User does not exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
