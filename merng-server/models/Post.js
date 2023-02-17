const {model , Schema } = require('mongoose');


const postSchema = new Schema({
    description: String,
    image: String ,
    createdAt:String,
    username:String,
    name:String,
    comments: [
        {
            body: String,
            username: String,
            name:String,
            createdAt: String
        }
    ],
    likes: [
        {
            username:String,
            createdAt:String
        }
    ],
    creator : { type: Schema.Types.ObjectId,  ref: 'users'}
    
});

module.exports = model('Post', postSchema);
