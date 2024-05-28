const express = require("express");
const app = express();
const port = 5003;
app.use(express.json());

const db = require("./firebase");
const { collection, getDocs, addDoc } = require("firebase/firestore");

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// get all posts
app.get("/posts", async (req, res) => {
    try {
        let ret = [];
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log("this is ret: ", ret); // it should have got the messages from firestore
        res.status(200).json(ret);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// add a new post
app.post("/post", async (req, res) => {
    try {
        const { username, message } = req.body;
        if (username && message) {
            const docRef = await addDoc(collection(db, "posts"), {
                username: username,
                message: message,
                timestamp: new Date()
            });
            res.status(200).json({ success: true, id: docRef.id });
        } else {
            res.status(400).json({ success: false, message: "Username and message are required" });
        }
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});
