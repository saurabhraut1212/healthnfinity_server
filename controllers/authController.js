import Auth from "../models/authModel.js";
import Log from "../models/logModel.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await Auth.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email is already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Auth.create({ name, email, password: hashedPassword, role });

        if (user) {

            await Log.create({
                actionType: 'create',
                userId: user._id,
                role: user.role,
                additionalData: { email },
            });

            const data = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
            return res.status(201).json({ message: "User created successfully", user, token: generateToken(data) })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }


}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with that email ID does not exist." });
        }


        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(400).json({ message: "Invalid password." });
        }


        await Log.create({
            actionType: 'login',
            userId: user._id,
            role: user.role,
            additionalData: { email }
        });


        const data = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };


        return res.status(200).json({
            message: "User logged in successfully.",
            user: data,
            token: generateToken(data)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                user.password = hashedPassword
            }

            const updatedUser = await user.save();

            await Log.create({
                actionType: 'update',
                userId: updatedUser._id,
                role: updatedUser.role,
                additionalData: { email: updatedUser.email },
            });

            const data = {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name
            }
            return res.status(200).json({ message: "User profile updated successfully", updatedUser, token: generateToken(data) });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }



};