import mongoose, { Schema, Document, Model }  from "mongoose";
import {randomUUID} from "crypto"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'




export interface IUser extends mongoose.Document {
    username: string,
    password: string,
    isAdmin: boolean,
    birthday: Date,
    isDeleted: boolean

  }
  interface IUserDocument extends IUser, Document {
    createJWT(): string;
    comparePassword: (password: string) => Promise<boolean>;
}
 
const UserSchema= new Schema<IUserDocument>({
    username:{
        type:String,
        required:[true, "Username is required"]
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[6, 'Password must be more than 6 characters']

    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    birthday:{
        type:Date,
        default:Date.now()
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})



//middleware
UserSchema.pre<IUser>('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

//methods
UserSchema.methods.createJWT= function(){
    const payload: object={username: this.username, isAdmin: this.isAdmin, userId: this._id} 
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: process.env.JWT_EXPIRE as string})
}

UserSchema.methods.comparePassword= async function(userPassword: string){
   const isMatch= await bcrypt.compare(userPassword, this.password) 
        
        return isMatch;
}

const UserModel=mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
