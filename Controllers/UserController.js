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
            //destructuring user response
            const { password, ...otherDetails } = user._doc;

            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("User does not exists");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
// update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can only update your own profile");
    }
};
