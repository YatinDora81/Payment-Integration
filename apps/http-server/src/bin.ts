import app from "./index.js";
import os from "os";
import dotenv from "dotenv";
import cluster from "cluster";
const cpuCount = 1 || os.cpus().length;

dotenv.config();

const PORT = process.env.PORT;

if(cluster.isPrimary){
    for(let i = 0; i < cpuCount; i++){
        cluster.fork();
    }
}else{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} , with process id ${process.pid}`);
    });
}