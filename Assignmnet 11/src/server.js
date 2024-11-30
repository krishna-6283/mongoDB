const app = require('./app');
const db = require('./utils/db');
require('dotenv').config();

// Connect to database
db.connect();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
