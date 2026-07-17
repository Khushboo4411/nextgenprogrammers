const mongoose = require('mongoose');
async function connectMongo(){
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName : "coaching"
        });
        console.log("MongoDB connected successfully!!");
        console.log("Database : ", mongoose.connection.name);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectMongo;