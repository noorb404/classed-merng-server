const {model , Schema } = require('mongoose');


const userSchema = new Schema({
    username : String ,
    password : String ,
    
    name : String ,
    email: String,
    phone : String ,
    address : String ,
    website : String ,
    image: String ,
    date: String ,
    gas: [String],
    water:[String] ,
    paper:[String], 
    electricity :[String],
    type:String //1 for Schools , 2 for איגוד ערים
  //  posts :  [{ type: mongoose.Types.ObjectId, required: true, ref: 'Post'}]

});

module.exports = model('User', userSchema);