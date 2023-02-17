const { gql } = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!
        description: String!
        image: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        name:String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        name:String!
        body: String!
    }
    type User{
        id: ID!
        name: String!
        token: String!
        username: String!
        email:String!
        phone: String!
        address: String!
        website: String!
        image: String!
        date: String!
        gas: [String]!
        water: [String]!
        paper: [String]! 
        electricity: [String]!
        type:String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        type:String!
    }
    input UpdateInput{
        phone: String!
        address: String!
        website: String!
        email: String!
        name: String!
        username: String!
        image:String!
    }

    
    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post!
        getUser(username: String!): User!
        getUsers: [User]

    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        updateUser(updateInput: UpdateInput): User!
        createPost(description: String!, image:String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body:String! , name:String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId:ID!): Post!
    }
    type Subscription{
        newLike:Post!
        newComment:Post!
    }
`;