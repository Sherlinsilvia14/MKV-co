import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Connect to MongoDB
// Added database name 'textile-shop' to the connection string
mongoose.connect('mongodb+srv://sherlinsilviaa23aim:Sherlin14@cluster0.zsi0q.mongodb.net/textile-shop?appName=Cluster0')
    .then(() => console.log('MongoDB Connected Successfully to textile-shop'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.log('HINT: Please check if your IP address is whitelisted in MongoDB Atlas Network Access.');
        console.log('HINT: Ensure the password in the connection string is correct.');
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    whatsapp: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { name, whatsapp, password, address } = req.body;

        // Wait for connection to be ready before querying
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please try again later.' });
        }

        // Check existing
        const existingUser = await User.findOne({ whatsapp });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this WhatsApp number already exists' });
        }
        const newUser = new User({ name, whatsapp, password, address });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful', user: { name, whatsapp, address } });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
});

app.get('/api/user/:whatsapp', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected' });
        }
        const user = await User.findOne({ whatsapp: req.params.whatsapp });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ name: user.name, whatsapp: user.whatsapp, address: user.address });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { whatsapp, password } = req.body;

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database not connected. Please try again later.' });
        }

        const user = await User.findOne({ whatsapp });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: { name: user.name, whatsapp: user.whatsapp, address: user.address } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Product Add Error:', error);
        res.status(500).json({ message: 'Server error adding product', error: error.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Fetch Products Error:', error);
        res.status(500).json({ message: 'Server error fetching products', error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Fetch Single Product Error:', error);
        res.status(500).json({ message: 'Server error fetching product', error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
