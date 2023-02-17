const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    Mutation: {
        createComment: async (_,{ postId, body , name }, context) => {
            const {username} = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty comment', {
                    errors:{
                        body:'comment body must not be empty'
                    }
                });
            }

            const post = await Post.findById(postId);
            const postSub = post;
            postSub.name=post.username; // POST BEEN COMMENT ID
            postSub.username=username; // COMMENT ID
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    name,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                context.pubsub.publish('NEW_COMMENT', {
                    newComment: postSub
                })
                return post;
            }else throw new UserInputError('Post not found');

        },
        async deleteComment(_, {postId,commentId} ,context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post){
                const commentIndex =  post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }else {
                    throw new AuthenticationError('Action not allowed');
                }
            }else {
                throw new UserInputError('Post not found');
            }
        }
    },
    Subscription: {
        newComment: {
            subscribe: (_,__,{pubsub}) =>  pubsub.asyncIterator('NEW_COMMENT')
        }
    }
};