import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  const gqlserver = new ApolloServer({
    typeDefs: `
    type Query {
      movies: [Movie!]!
      movie(id: String!): Movie
      discussion(id: String!): Discussion
      discussions: [Discussion!]!
    }
    type Mutation {
      createMovie(input: CreateMovieInput!): Movie!
      deleteMovie(id: String!): Boolean
      deleteDiscussion(id: String!): Boolean
      updateMovie(input: UpdateMovieInput!): Movie!
      createDiscussion(input: createDiscussionInput!): Discussion!
    }
    type Movie {
      id: String!
      title: String!
      director: String
      releaseYear: Int
      genre: String
      rating: Float
      discussions: [Discussion]
      createdAt: String
      updatedAt: String
    }
    type MovieShort {
      id: String!
      title: String!
      director: String
      releaseYear: Int
      genre: String
      rating: Float
      createdAt: String
      updatedAt: String
    }
    input CreateMovieInput {
      title: String!
      director: String
      releaseYear: Int!
      genre: String!
      rating: Float!
    }
    input UpdateMovieInput {
      id: String!
      title: String
      director: String
      releaseYear: Int
      genre: String
      rating: Float
    }
    type Discussion {
      id: String!
      content: String!
      movie: MovieShort
      movieId: String
    }
    
    input createDiscussionInput {
      content: String
      movieId: String
    }
    `,
    resolvers: {
      Query: {
        movie: async (_, { id }) => {
          try {
            const movie = await prismaClient.movie.findUnique({
              where: { id },
              include: {
                discussions: true,
              }
            });
            return movie;
          } catch (error) {
            console.error('Error fetching movie:', error);
            throw error;
          }
        },
        discussion: async (_, { id }) => {
          try {
            const discussion = await prismaClient.discussion.findUnique({
              where: { id },
              include: {
                movie: true,
              }
            });
            return discussion;
          } catch (error) {
            console.error('Error fetching movie:', error);
            throw error;
          }
        },
        movies: async () => {
          try {
            const movies = await prismaClient.movie.findMany({
              include: {
                discussions: true,
              },
            });
            return movies;
          } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
          }
        },
        discussions: async () => {
          try {
            const discussions = await prismaClient.discussion.findMany({
              include: {
                movie: true,
              },
            });
            return discussions;
          } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
          }
        }
      },
      Mutation: {
        createMovie: async (_, { input }) => {
          try {
            const movie = await prismaClient.movie.create({
              data: {
                ...input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            });
            return movie;
          } catch (error) {
            console.error('Error creating movie:', error);
            throw error;
          }
        },
        createDiscussion: async (_, { input }) => {
          try {
            const { movieId, ...discussionData } = input;
        
            // Check if the movie with provided movieId exists
            const existingMovie = await prismaClient.movie.findUnique({
              where: {
                id: movieId,
              },
            });
        
            if (!existingMovie) {
              throw new Error(`Movie with ID ${movieId} not found`);
            }
        
            // Create the discussion associated with the movie
            const discussion = await prismaClient.discussion.create({
              data: {
                ...discussionData,
                movie: {
                  connect: {
                    id: movieId,
                  },
                },
              },
              include: {
                movie: true, // Include the movie field
              },
            });
        
            return discussion;
          } catch (error) {
            console.error('Error creating discussion:', error);
            throw error;
          }
        },
        
        deleteMovie: async (_, { id }) => {
          try {
            await prismaClient.discussion.deleteMany({
              where: {
                movieId: id
              }
            });

            await prismaClient.movie.delete({
              where: { id }
            });
            return true;
          } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
          }
        },
        deleteDiscussion: async (_, { id }) => {
          try {
            await prismaClient.discussion.delete({
              where: { id }
            });
            return true;
          } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
          }
        },
        updateMovie: async (_, { input }) => {
          const { id, ...data } = input;
          try {
            const movie = await prismaClient.movie.update({
              where: { id },
              data: {
                ...data,
                updatedAt: new Date().toISOString()
              }
            });
            return movie;
          } catch (error) {
            console.error('Error updating movie:', error);
            throw error;
          }
        }
      }
    },
  });
  await gqlserver.start();

  app.get("/", (req, res) => {
    res.json({ message: "seevering" });
  });
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}

init();
