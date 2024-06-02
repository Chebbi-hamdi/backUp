import Test from "../models/test";


const createTest = async (req, res) => {
    try {
        const { name, familyName, email, recup_email, password } = req.body;
        const test = new Test({
        name,
        familyName,
        email,
        recup_email,
        password,
        });
        await Test.save();
        res.status(201).json(test);
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    };

    const getTest = async (req, res) => {
        try {
            const tests = await Test.find();
            res.status(200).json(tests);
        } catch (error) {
            console.error("Error getting tests:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    export default {
        createTest,
        getTest,
    };