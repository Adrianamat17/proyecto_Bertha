require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gamevault';

connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});