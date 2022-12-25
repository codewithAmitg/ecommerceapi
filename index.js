const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swagDocument = YAML.load('./swag.yaml');
const dbConnect = require('./config/dbConnect');
const { errorHandler } = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
dbConnect();
app.use('/api-docs1', swaggerUi.serve, swaggerUi.setup(swagDocument));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/user',authRouter);
// app.use(notFound);
app.use(errorHandler);

app.use('/',(req,res)=>{
    res.json({
        message : "Hi"
    });
});

app.listen(PORT, () =>{
    console.log(`server is and  running at ${PORT}`);
});
