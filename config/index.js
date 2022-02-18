require("dotenv").config();

let config = {
    port: process.env.PORT || 3001
}

module.exports = { config }
