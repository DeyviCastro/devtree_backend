

import mongoose from "mongoose";

export const connetDB = async() => {
    
    try {
        const url = process.env.MONGODB_URI;
        const conectar = await mongoose.connect(url);
        console.log('Se conecto a la base de datos')

    } catch (error) {
        process.exit(1);
        
    }

}