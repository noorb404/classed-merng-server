const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const axios = require('axios');
var FormData = require('form-data');

const { SECRET_KEY } = require('../../config');
const { validateRegisterInput , validateLoginInput } = require('../../util/validators')


//login token for 1h validation
function generateToken(user){
    return jwt.sign({
        id: user.id,
        username:user.username,
        email:user.email,
        address:user.address,
        phone:user.phone,
        website:user.website,
        image:user.image,
        date:user.date,
        gas:user.gas,
        water:user.water,
        paper:user.paper,
        type:user.type,
        electricity:user.electricity,
        name: user.name
    
    }, SECRET_KEY, {expiresIn:'1h'});

}

module.exports = {
    Query: {
        async getUser(_, {username}){
            try{
                const user = await User.findOne({username});
                const token = generateToken(user);
                return {
                    username:user.username,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    address:user.address,
                    website:user.website,
                    image:user.image,
                    date:user.date,
                    gas:user.gas,
                    water:user.water,
                    paper:user.paper,
                    type:user.type,
                    electricity:user.electricity,
                    id: user._id,
                    token
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async getUsers(){
            try{
                const users = await User.find();
                return users;
            }catch(err){
                throw new Error(err);
            }
        }
        
        
    },
    Mutation: {

        //Login Mutation
        async login(_, {username,password}){
            const{errors,valid} = validateLoginInput(username,password);
            if(!valid){
                throw new UserInputError('Errors', {errors});     
            }
            const user = await User.findOne({username});

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }

            const token = generateToken(user);
            return {
                username:user.username,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                website:user.website,
                image:user.image,
                date:user.date,
                gas:user.gas,
                water:user.water,
                paper:user.paper,
                type:user.type,
                electricity:user.electricity,
                id: user._id,
                token
            }

        },

        //Signup Mutation
        async register(_, 
            {
              registerInput: {username , password, confirmPassword , type}
        }
        ){
            const { valid , errors } = validateRegisterInput(username,  password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            const user = await User.findOne({username});
            //if already exist
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username:' This username is taken'
                    }
                });
            }
            password = await bcrypt.hash(password , 12);
            const newUser = new User({
                name: 'שם בית ספר',
                username,
                type,
                password,
                email:'דואר לבית ספר',
                phone : 'מס טלפון' ,
                address : 'כתובת בית ספר' ,
                website : 'אתר בית ספר' ,
                image: 'school1' ,
                date: new Date().getFullYear() ,
                gas:  ["51", "143", "250" ,"410" , "70" , "502" , "140" , "518", "152", "119", "325", "184"],
                water: ["32", "22", "220" ,"160" , "240" , "150" , "114" , "321", "250", "212", "434", "235"] ,
                paper:  ["249", "34", "150" ,"50" , "455" , "215" , "650" , "150", "330", "539", "327", "331"], 
                electricity :  ["413", "1145", "1265" ,"1100" , "1650" , "2830" , "4850" , "108", "3290", "1139", "157", "2325"]
            });
            
            const res = await newUser.save();
            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        async updateUser(_,{updateInput: {username , phone , address , website , email , name , image}}){
            const user = await User.findOne({username});
            if(!user){
                throw new Error('User Not Found!');
            }
            if(name!==undefined)
              user.name=name;
            if(phone!==undefined)
                user.phone = phone;
            if(address!==undefined)
                user.address = address;
            if(website!==undefined)
                user.website = website;
            if(email!==undefined)
                user.email = email;
            if(image!==undefined){
                console.log(image);
                user.image=image;
            }
            const res =  await user.save();
            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
        
    }
}