import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    handle: string,
    name: string,
    email: string,
    password: string,
    description: string,
    image: string
    links:string
}


const userSchema = new mongoose.Schema({
    handle:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowrecase: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true,

    },

    description: {
        type: String,
        default: '',
        trim: true
    },

    image: {
        type: String,
        default: ''
    },
    links:{
        type: String,
        default: '[]'
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User