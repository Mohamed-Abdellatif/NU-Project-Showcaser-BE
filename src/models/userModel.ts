import { Schema, model, Document } from 'mongoose';


export interface IUser extends Document{
firstName:string;
lastName:string;
email:string;
password?:string;
msId?:string;
starredProjects:string[];
role:string;
projects:string[];
pendingProjects:string[];
linkedInUrl:string;
githubUrl:string;
universityId:string;
school:string;
major:string;
deactivated:boolean;
deactivateRequested:boolean;
}


const userSchema = new Schema<IUser>({
    firstName:{type:String,required:false, default: ''},
    lastName:{type:String,required:false, default: ''},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:false},
    msId:{type:String,required:false, unique:true, sparse:true},
    starredProjects:{type:[String],required:false, default: []},
    role:{type:String,required:false, default: 'user'},
    projects:{type:[String],required:false, default: []},
    pendingProjects:{type:[String],required:false, default: []},
    linkedInUrl:{type:String,required:false, default: ''},
    githubUrl:{type:String,required:false, default: ''},
    universityId:{type:String,required:false, default: ''},
    school:{type:String,required:false, default: ''},
    major:{type:String,required:false, default: ''},
    deactivated:{type:Boolean,required:false, default: false},
    deactivateRequested:{type:Boolean,required:false, default: false},
})


const userModel = model<IUser>('User', userSchema);

export default userModel;