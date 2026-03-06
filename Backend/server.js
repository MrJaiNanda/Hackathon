const exp =  require('express');
const app = exp();
const port = 3000;
const cors = require('cors');
const connectDB = require('./db');
const User = require('./schema');

app.use(cors());

app.get(5000, () => {
    console.log('Server is running on port 5000');
})

app/post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
});

connectDB().then(() =>{
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
})