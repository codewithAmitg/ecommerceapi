const { default: mongoose } =require("mongoose");
const dbConnect = () =>{
    try{
        mongoose.set("strictQuery", false);
        const conn=mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
        console.log(process.env.MONGODB_URL);

    }catch(error){
        console.log("Database error");
    }
};

module.exports = dbConnect;
