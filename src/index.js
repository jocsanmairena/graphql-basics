import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    userId: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
  },
  {
    userId: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
    age: 35
  },
  {
    userId: '3',
    name: 'Mike',
    email: 'mike@example.com',
    age: 40
  }
]

const posts = [
  {
    postId: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    authorId: '1'
  }, {
    postId: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    authorId: '1'
  }, {
    postId: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    authorId: '2'
  }
]

const comments = [
  {
    commentId: '101',
    text: "Some random text1",
    authorId: '1'

  },
  {
    commentId: '102',
    text: "Some random text2",
    authorId: '2'


  },
  {
    commentId: '103',
    text: "Some random text3",
    authorId: '2'

  },
  {
    commentId: '104',
    text: "Some random text4",
    authorId: '3'
  }
]

// Type definitions (schema)
const typeDefs = `
  #---QUERY DEFINITIONS---
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }
    #---MUTATION DEFINITIONS---
    
    #---TYPE DEFINITIONS---
    type User {
        userId: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        postId: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!  
    }
    
    type Comment {
      commentId: ID!
      text: String!
      author: User!  
    }
`

// Resolvers
const resolvers = {
  Query: {
    users( parent, args, ctx, info ) {
      //if not input filter arguments exist, then return all the users objects
      if ( !args.query ) {
        return users
      }
      //else filter users based on arguments and function task
      return users.filter( ( user ) => {
        return user.name.toLowerCase().includes( args.query.toLowerCase() )
      } )
    },
    posts( parent, args, ctx, info ) {
      if ( !args.query ) {
        return posts
      }

      return posts.filter( ( post ) => {
        const isTitleMatch = post.title.toLowerCase().includes( args.query.toLowerCase() )
        const isBodyMatch = post.body.toLowerCase().includes( args.query.toLowerCase() )
        return isTitleMatch || isBodyMatch
      } )
    },
    comments( parent, args, ctx, info ) {
      if ( !args.query ) {
        return comments
      }
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      }
    }
  },
  // RELATIONSHIP is based on authorId === userID 
  // Whenever a posts is a child query of users, the post of a user are based in the relationship between the user.id ( parent.id ) and the posts.id
  // User( parent ) an post( child ) query
  User: {
    posts( parent, args, ctx, info ) {
      return posts.filter( ( post ) => { return post.authorId === parent.userId } )
    },
    comments( parent, args, ctx, info ) {
      return comments.filter( ( comment ) => { return comment.authorId === parent.userId } )
    }
  },
  // Whenever a author(user) is a child query of posts, the author of a post are based in the relationship between the user.id  and the post.id (parent.id )
  //Post(parent) an author(child) query
  Post: {
    author( parent, args, ctx, info ) {
      return users.find( ( user ) => { return user.userId === parent.authorId } )
    }
  },
  // Whenever a comment(user) is a child query of posts, the authors of a post are based in the relationship between the user.id  and the post.id (parent.id )
  Comment: {
    author( parent, args, ctx, info ) {
      return users.find( ( user ) => { return user.userId === parent.authorId } )
    },

  }
}

const server = new GraphQLServer( {
  typeDefs,
  resolvers
} )

server.start( () => {
  console.log( 'Go to http://localhost:4000/' )
} )
