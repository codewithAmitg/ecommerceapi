const { default: mongoose } =require("mongoose");
const dbConnect = async () =>{
    try{
        mongoose.set("strictQuery", false);
        const conn= await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
        console.log(process.env.MONGODB_URL);

    }catch(error){
        console.log("Database error");
    }
};

module.exports = dbConnect;

//on swagger use https://aecom.onrender.com/ for servers url : git 