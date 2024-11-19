const port = 5000;
const express = require("express");
const app = express();
const cron = require('node-cron');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const {
    type
} = require("os");

app.use(express.json());
app.use(cors());

// database connection with MongoDB
mongoose.connect("mongodb+srv://HARSHAD:HARSHAD@cluster0.yzv2blz.mongodb.net/e-commerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Ensure upload directory exists
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// image storage configuration
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
}).single('product');

// Static folder for images
app.use('/images', express.static(uploadDir));

// Test route
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Image upload endpoint
app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({
                success: 0,
                error: err.message
            });
        }
        console.log("Request file:", req.file);
        if (!req.file) {
            return res.status(400).json({
                success: 0,
                error: "No file uploaded"
            });
        }
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`,
        });
    });
});

// Schema for creating products
const Product = mongoose.model("product", {
    email: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    crop_type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
});

// Endpoint for adding products
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            email: req.body.email,
            name: req.body.name,
            size: req.body.size,
            tags: req.body.tags,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            crop_type: req.body.crop_type,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint for removing products
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({
            id: req.body.id
        });
        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// creating api for getting all products

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All products fetched ");
    res.send(products);
})

// Schema creating for User model

const Users = mongoose.model('user', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    cartdata: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number
    }
})

// Endpoint for Adding User

app.post('/adduser', async (req, res) => {
    try {
        let user = await Users.find({});
        if (req.body.email === user.email) {
            return res.status(400).json({
                success: false,
                errors: "Existing user found with same email id"
            });
        } else {
            const user = new Users({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            });
            await user.save();
            res.json({
                success: true,
                name: req.body.name,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

// endpoint for List Out Users

app.get('/alluser', async (req, res) => {
    let users = await Users.find({});
    console.log("All Users fetched ");
    res.send(users);
})

// endpoint for Removing users

app.post('/removeuser', async (req, res) => {
    try {
        await Users.findOneAndDelete({
            email: req.body.email
        });
        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Creating Endpoint for signup

app.post('/signup', async (req, res) => {
    let check = await Users.findOne({
        email: req.body.email
    });
    if (check) {
        return res.status(400).json({
            success: false,
            errors: "Existing user found with same email id"
        });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        cartdata: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token
    });
});

// creating endpoint for user login

app.post('/login', async (req, res) => {
    let user = await Users.findOne({
        email: req.body.email
    });
    if (user) {
        const passcompare = req.body.password === user.password;
        if (passcompare) {
            const data = {
                user: {
                    id: user.id
                }
            };

            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                token
            });
        } else {
            res.json({
                success: false,
                errors: "Wrong password"
            });
        }
    } else {
        res.json({
            success: false,
            errors: "Wrong email id"
        });
    }
});

// creating endpoint for new collections

app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NEW COLLECTION FETCHED ");
    res.send(newcollection);

})

// creating endpoints popular in Onion

app.get('/popularinonion', async (req, res) => {
    let products = await Product.find({
        category: "onion"
    });
    let popular = products.slice(0, 6);
    console.log("Popular in onions fetched");
    res.send(popular);
})

// Creating middleware to fetch the user
const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({
            errors: "Please authenticate using valid token"
        });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({
            errors: "Please authenticate using valid token"
        });
    }
};

// Creating endpoints for adding product into cartdata
app.post('/addtocart', fetchuser, async (req, res) => {
    try {
        console.log("Added", req.body.itemId);
        let userdata = await Users.findOne({
            _id: req.user.id
        });
        if (!userdata) {
            return res.status(404).send("User not found");
        }
        userdata.cartdata[req.body.itemId] += 1;
        await Users.findByIdAndUpdate(req.user.id, {
            cartdata: userdata.cartdata
        });
        res.send("Added");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/removefromcart', fetchuser, async (req, res) => {
    try {
        console.log("Removed", req.body.itemId);
        let userdata = await Users.findOne({
            _id: req.user.id
        });

        if (userdata.cartdata[req.body.itemId] > 0) {
            userdata.cartdata[req.body.itemId] -= 1;
        }

        await Users.findOneAndUpdate({
            _id: req.user.id
        }, {
            cartdata: userdata.cartdata
        })

        res.send("Removed");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Creating endpoint to get cartdata
app.post('/getcart', fetchuser, async (req, res) => {
    try {
        console.log("Get cart");
        let userdata = await Users.findOne({
            _id: req.user.id
        });
        res.json(userdata.cartdata);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

const Orders = mongoose.model('Orders', {

    id: {
        type: Number,
    },

    user: {
        type: String,
        require: true,
    },

    name: {
        type: String,
        require: true,
    },

    lname: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        require: true,
    },
    contact: {
        type: Number,
        require: true,
    },

    payment: {
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true,
    },

    cartdata: {
        type: Object,
    },

    status: {
        type: Boolean
    },

    date: {
        type: Date,
        default: Date.now
    }
});

// creating endpoint for adding the order

app.post(('/addorder'), async (req, res) => {
    try {
        let orders = await Orders.find({});
        let id;
        if (orders.length > 0) {
            let last_product = orders[orders.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const order = new Orders({
            id: id,
            name: req.body.name,
            user: req.body.user,
            lname: req.body.lname,
            email: req.body.email,
            contact: req.body.contact,
            payment: req.body.payment,
            address: req.body.address,
            cartdata: req.body.cartdata,
            status: req.body.status
        });

        await order.save();
        res.json({
            success: true,
            name: req.body.name,
        });

    } catch (error) {
        res.send(500).json({
            success: false,
            error: error.message
        })
    }
})

// creating endpoint for fetching the pending orders

app.get('/pending', async (req, res) => {
    let orders = await Orders.find({
        status: false
    });
    console.log("All Pending Orders fetched ");
    res.send(orders);
})

// creating endpoint for fetching te complete orders

app.get('/complete', async (req, res) => {
    let orders = await Orders.find({
        status: true
    });
    console.log("All Complete Orders fetched ");
    res.send(orders);
})

// creating endpoint for fetching the perticular shopkeeper orders

app.post('/spending', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await Orders.find({
            status: false,
            'cartdata.email': email
        });
        console.log("Orders with specific email in cartdata fetched");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// creating endpoint for fetching the perticular shopkeeper orders

app.post('/scomplete', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await Orders.find({
            status: true,
            'cartdata.email': email
        });
        console.log("Orders with specific email in cartdata fetched");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// craeting schema for subscribers

const subscribers = mongoose.model('Subscribers', {
    user: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// creating endpoints for adding the subscribers

app.post('/subscribe', async (req, res) => {
    try {
        let check = await subscribers.findOne({
            email: req.body.email
        });
        if (check) {
            return res.status(400).json({
                success: false,
                errors: "Email already Subscribed"
            });
        }
        const subscribe = new subscribers({
            user: req.body.user,
            email: req.body.email,
        });

        await subscribe.save()

        res.json({
            success: true,
            email: req.body.email
        })
        console.log("Subscribe addeds", req.body.email);
    } catch (errors) {
        res.json({
            success: false,
            errors: errors.message
        })
    }
})

// creating endpoint for fetching the subscribers for it

app.get('/getsub', async (req, res) => {
    let subscribe = await subscribers.find({});
    console.log("All Complete Orders fetched ");
    res.send(subscribe);
})

// creating endpoints for unsubscribe 

app.post('/unsub', async (req, res) => {
    try {
        let check = await subscribers.findOne({
            email: req.body.email
        });
        if (!check) {
            return res.status(400).json({
                success: false,
                errors: "Email Not Found "
            });
        }
        await subscribers.findOneAndDelete({
            email: req.body.email
        });
        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// creating endpoint for fetching particular user 

app.get('/peruser', fetchuser, async (req, res) => {
    try {
        console.log("Get User Details");
        let user = await Users.findOne({
            _id: req.user.id
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// creating schema for farmer profile

const Farmers = mongoose.model('farmer', {

    email: {
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    phone: {
        type: Number,
        require: true
    },

    area: {
        type: String,
        require: true
    },

    farm_type: {
        type: String,
        require: true
    },

    soil_type: {
        type: String,
        require: true
    },

    crop_grown: {
        type: String,
        require: true
    },

    fertilizers: {
        type: String,
        require: true
    }
})

// creating schema for worker profile

const workers = mongoose.model('worker', {

    email: {
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    phone: {
        type: Number,
        require: true
    },

    birth: {
        type: String,
        require: true
    },

    time: {
        type: String,
        require: true
    },

    skills: {
        type: String,
        require: true
    },

    salary: {
        type: String,
        require: true
    }
})

// creating schema for merchant

const merchant = mongoose.model('merchant', {

    email: {
        type: String,
        require: true
    },

    address: {
        type: String,
        require: true
    },

    phone: {
        type: Number,
        require: true
    },

    business: {
        type: String,
        require: true
    },

    area: {
        type: String,
        require: true
    },

    payment: {
        type: String,
        require: true
    },

    goods: {
        type: String,
        require: true
    }
})

// creating modules for shopkeeper

const shopkeepers = mongoose.model('shopkeeper', {

    email: {
        type: String,
        require: true
    },

    ownaddress: {
        type: String,
        require: true
    },

    shaddress: {
        type: String,
        require: true
    },

    phoneno: {
        type: Number,
        require: true
    },

    shname: {
        type: String,
        require: true
    },

    shtype: {
        type: String,
        require: true
    },

    ophours: {
        type: String,
        require: true
    },

    payment: {
        type: String,
        require: true
    }

})

// creating endpoint for storing farmers information

app.post('/farmerd', async (req, res) => {
    try {
        let check = await Farmers.findOne({
            email: req.body.email
        });

        if (check) {
            return res.status(400).json({
                success: false,
                errors: "You already Enter Your Basic Details"
            });
        }
        const farmerdata = new Farmers({
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            area: req.body.area,
            farm_type: req.body.farm_type,
            soil_type: req.body.soil_type,
            crop_grown: req.body.crop_grown,
            fertilizers: req.body.fertilizers
        });

        await farmerdata.save();

        res.json({
            success: true,
            email: req.body.email
        })

        console.log("Profile adds successfully !!!", req.body.email);

    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
})
// creating endpoint for fetching the farmers

app.post('/perfarmer', async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            return res.status(400).send("Email is required");
        }

        let farmer = await Farmers.findOne({
            email: email
        });

        if (!farmer) {
            return res.status(404).send("Farmer not found");
        }

        res.json(farmer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// creating endpoint for storing workers data

app.post('/workerd', async (req, res) => {
    try {
        let existingWorker = await workers.findOne({
            email: req.body.email
        });

        if (existingWorker) {
            return res.status(400).json({
                success: false,
                message: "Worker with this email already exists"
            });
        }

        const workerdata = new workers({
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            birth: req.body.birth,
            time: req.body.time,
            skills: req.body.skills,
            salary: req.body.salary
        });


        await workerdata.save();

        res.json({
            success: true,
            message: "Worker profile added successfully",
            email: req.body.email
        });

        console.log("Profile added successfully for:", req.body.email);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// endpoint for fetching perticular worker

app.post('/perworker', async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            return res.status(400).send("Email is required");
        }

        let worker = await workers.findOne({
            email: email
        });

        if (!worker) {
            return res.status(404).send("Farmer not found");
        }

        res.json(worker);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// fetching perticular merchats data for their profile

app.post('/permerchant', async (req, res) => {
    try {
        const {
            email
        } = req.body;

        if (!email) {
            return res.status(400).send("Email is required");
        }

        let merchantdata = await merchant.findOne({
            email: email
        });

        if (!merchantdata) {
            return res.status(400).send("Farmer not found");
        }

        res.json(merchantdata);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

// creating endpoint for Fetching profile for ShopKeeper 

app.post('/pershop', async (req, res) => {
    try {
        const {
            email
        } = req.body;
        if (!email) {
            return res.status(400).send("Email is Required ");
        }
        let Shopkeeper = await shopkeepers.findOne({
            email: email
        });
        if (!Shopkeeper) {
            return res.status(404).send("farmer Not Found ");
        }
        res.json(Shopkeeper);
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server Error");
    }
})

// creating api for getting all products for perticular shopkeeper

app.post('/allsproducts', async (req, res) => {

    const {
        email
    } = req.body;
    if (!email) {
        return res.status(400).send("Email is Required ");
    }

    let products = await Product.find({
        email: email
    });
    console.log("Products Fetched for ", email);
    res.send(products);
})

// creating Api for fetching the shopkeeper data for perticular product

app.post('/shopkeeperdatas', async (req, res) => {
    const {
        email
    } = req.body;
    const {
        id
    } = req.body;

    if (!email) {
        return res.status(400).send("Email is required.");
    }

    try {
        const data = await shopkeepers.findOne({
            email: email
        });

        if (!data) {
            return res.status(404).send("Shopkeeper not found.");
        }

        console.log("Shopkeeper fetched for product Id: ", id);
        res.send(data);

    } catch (error) {
        console.error("Error fetching shopkeeper data: ", id);
        res.status(500).send("Internal Server Error.");
    }
});

// fetching related farmers 

app.get('/rfarmers', async (req, res) => {

    let rfarmers = await Farmers.find({});
    console.log("Related Farmers Fetched ");
    res.send(rfarmers);
})

// fetching user those who is farmer

app.get('/farmeruser', async (req, res) => {
    try {
        const users = await Users.find({
            role: "Farmer"
        });
        console.log("All Farmer users fetched:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching farmer users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// shema for related shopkeepers and theire data

app.get('/rshopkeepers', async (req, res) => {
    let rshopkeepers = await shopkeepers.find({});
    console.log("Related Shopkeepers Fetched ");
    res.send(rshopkeepers);
})

app.get('/shopkeeperuser', async (req, res) => {
    try {
        const users = await Users.find({
            role: "Shopkeeper"
        });
        console.log("All Shopkeeper users fetched:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching Shopkeeper users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

// shema for related merchant and theire data

app.get('/rmerchants', async (req, res) => {
    let rmerchant = await merchant.find({});
    console.log("Related Merchants Fetched ");
    res.send(rmerchant);
})

app.get('/merchantuser', async (req, res) => {
    try {
        const users = await Users.find({
            role: "Merchant"
        });
        console.log("All Merchant users fetched:", users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching Merchant users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

// shema for related workers and theire data

app.get('/rworkers', async (req, res) => {
    let rworkers = await workers.find({});
    res.send(rworkers);
    console.log("Related Workers Fetched ");
})

app.get('/workersuser', async (req, res) => {
    try {
        const users = await Users.find({
            role: "Worker"
        });
        res.status(200).json(users);
        console.log("All Worker users fetched:", users.length);
    } catch (error) {
        console.error("Error fetching Worker users:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

// schema for fetching complete orders for perticular farmer 

app.post('/fcomplete', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await Orders.find({
            status: true,
            'user': email
        });
        console.log("Complete Orders with specific email fetched");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// schema for fetching pending orders for perticular farmer 

app.post('/fpending', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await Orders.find({
            status: false,
            'user': email
        });
        console.log("Pending Orders with specific email fetched with count ", orders.length);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// schema for Farmers products

const FProductSchema = mongoose.model('fproduct', {
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quality: {
        type: String,
        required: true,
    },
    packagetype: {
        type: String,
        required: true,
    },
    harverstD: {
        type: Date,
        required: true,
    },
    expireD: {
        type: Date,
        required: true,
    },
    fertilizersused: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    timeframe: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean
    },
});

// endpoint for uploading farmers products details here

app.post('/addfproduct', async (req, res) => {
    try {

        const product = new FProductSchema({
            email: req.body.email,
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            quality: req.body.quality,
            packagetype: req.body.packagetype,
            harverstD: req.body.harverstD,
            expireD: req.body.expireD,
            fertilizersused: req.body.fertilizersused,
            location: req.body.location,
            timeframe: req.body.timeframe,
            status: req.body.status
        });

        await product.save();

        res.json({
            success: true,
            name: req.body.name,
            message: 'Product added successfully!'
        });

        console.log("Product added for Farmer:", req.body.email);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// creating endpoint for fetching farmers pending product that is not selled by other merchant

app.post('/fpendingp', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await FProductSchema.find({
            status: false,
            'email': email
        });
        console.log("Pending Orders with specific email fetched with count ", orders.length);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// creating endpoint for fetching farmers complete product that is selled by other merchant

app.post('/fcompletep', async (req, res) => {
    const {
        email
    } = req.body;

    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: "Invalid email format."
        });
    }

    try {
        let orders = await FProductSchema.find({
            status: true,
            'email': email
        });
        console.log("Complete Orders with specific email fetched with count ", orders.length);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// creating schema for earnings

const earning = mongoose.model('earning', {
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        require: true
    },
    reason: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    }
})

// endpoint for uploading farmers income

app.post('/income', async (req, res) => {

    try {
        const income = new earning({
            email: req.body.email,
            type: req.body.type,
            reason: req.body.reason,
            amount: req.body.amount
        });

        console.log('Income Altered Successfully');

        await income.save();

        res.send({
            success: true,
            email: req.body.email,
            message: "Income altered Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

// craeting endpoint for fetching the income

app.get('/fearning', async (req, res) => {
    try {
        const earn = await earning.find({
            type: "Earn"
        });
        res.status(200).json(earn);
        console.log("All Earn Alteration fetched:", earn.length);
    } catch (error) {
        console.error("Error fetching Investment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

// investment

app.get('/finvest', async (req, res) => {
    try {
        const earn = await earning.find({
            type: "Invest"
        });
        res.status(200).json(earn);
        console.log("All Invest Alteration fetched:", earn.length);
    } catch (error) {
        console.error("Error fetching Investment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

// schema for feedback

const feedback = mongoose.model('feedback', {
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    entityType: {
        type: String,
        require: true
    },
    whome: {
        type: String,
        require: true
    },
    comments: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    }
});

// creating endpoint for feedback storing
app.post('/addfeedback', async (req, res) => {
    try {
        const newFeedback = new feedback({
            email: req.body.email,
            name: req.body.name,
            entityType: req.body.entityType,
            whome: req.body.whome,
            comments: req.body.comments,
            rating: req.body.rating
        });

        console.log("Feedback added by ", req.body.email);

        await newFeedback.save();

        res.status(201).json({
            success: true,
            email: req.body.email,
            message: "Feedback saved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// creating endpoint for storing the work

const fwork = mongoose.model('farmerwork', {
    email: {
        type: String,
        require: true
    },
    task: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    nopeople: {
        type: Number,
        require: true
    },
    salary: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    }
});

app.post('/addFarmingWork', async (req, res) => {
    try {
        const newwork = new fwork({
            email: req.body.email,
            task: req.body.task,
            location: req.body.location,
            nopeople: req.body.nopeople,
            salary: req.body.salary,
            description: req.body.description
        });

        console.log("Work added by ", req.body.email);

        await newwork.save();

        res.status(201).json({
            success: true,
            email: req.body.email,
            message: "Work Added Successfully successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

cron.schedule('* * * * *', async () => {
    const currentTime = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(24, 0, 0, 0);

    if (currentTime.getHours() >= 24) {
        try {
            await fwork.deleteMany({ createdAt: { $lt: cutoffTime } });
            console.log("Expired works deleted.");
        } catch (error) {
            console.error("Error deleting expired works:", error);
        }
    }
});

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.log("Error : " + error);
    }
});