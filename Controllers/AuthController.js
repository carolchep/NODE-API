import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

// Registering a new User
export const registerUser = async (req, res) => {
    //destrucure the request body
    const { username, password, firstname, lastname } = req.body;
//use bcrypy to hash passsword
    const salt = await bcrypt.genSalt(10);
    //attached hashed value to the passsword
    const hashedPass = await bcrypt.hash(password, salt);
//create an object instance with the values
    const newUser = new UserModel({
        username,
        password: hashedPass,
        firstname,
        lastname,
    });

    try {
        //save the object to the database
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        //error display
        res.status(500).json({ message: error.message });
    }
};


// login User

export const loginUser = async (req, res) => {
    //destructure the values
    const {username, password} = req.body

    try {
        //find the username in the db
        const user = await UserModel.findOne({username: username})


        if(user)
        //if user exists
        {
            //use compare to check if paasword is the same
            const validity = await bcrypt.compare(password, user.password)


            validity? res.status(200).json(user): res.status(400).json("Invalid password")
        }
        else{
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}