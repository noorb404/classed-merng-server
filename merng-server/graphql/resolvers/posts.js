const Post = require ('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError} = require('apollo-server');




module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1});
                return posts;
            }catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not found');
                }
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { description , image}, context){
            const user = checkAuth(context);
            const newPost = new Post({
                description,
                creator: user.id,
                image:image,
                username: user.username,
                name: user.name,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            return post;

        },
        async deletePost (_, { postId }, context){
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully';
                }else{
                        throw new AuthenticationError('Action not allowed');
                }

            }catch(err){
                throw new Error(err);
            }
        },
        async likePost(_, {postId} , context){
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);
            const postSub = post;
            postSub.name=post.username; // POST BEEN LIKED ID
            postSub.username=username; // LIKE ID
            if(post){
                if(post.likes.find(like => like.username === username)){
                    // post already liked => unlike.
                    post.likes = post.likes.filter(like => like.username !== username);
                }else{
                    // Like the post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });

                }
                await post.save();
                context.pubsub.publish('NEW_LIKE', {
                    newLike: postSub
                })
                return post;
            }else throw new UserInputError('Post not found');
        }
    },
    Subscription: {
        newLike:{
            subscribe: (_,__,{pubsub}) =>  pubsub.asyncIterator('NEW_LIKE')
        }
    }
}