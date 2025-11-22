import { Schema, model, Document } from 'mongoose';


export interface IUser extends Document{
firstName:string;
lastName:string;
email:string;
password?:string;
msId?:string;
starredProjects:string[];
}


const userSchema = new Schema<IUser>({
    firstName:{type:String,required:false, default: ''},
    lastName:{type:String,required:false, default: ''},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:false},
    msId:{type:String,required:false, unique:true, sparse:true},
    starredProjects:{type:[String],required:false, default: []},
})


const userModel = model<IUser>('User', userSchema);

export default userModel;