"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const db_1 = require("./lib/db");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 3000;
        app.use(express_1.default.json());
        const gqlserver = new server_1.ApolloServer({
            typeDefs: `
    type Query {
      hello: String
      movies: [Movie!]!
      movie(id: String!): Movie
    }
    type Mutation {
      createMovie(input: CreateMovieInput!): Movie!
      deleteMovie(id: String!): Boolean
      updateMovie(input: UpdateMovieInput!): Movie!
    }
    type Movie {
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
    `,
            resolvers: {
                Query: {
                    movie: (_1, _a) => __awaiter(this, [_1, _a], void 0, function* (_, { id }) {
                        try {
                            const movie = yield db_1.prismaClient.movie.findUnique({
                                where: { id },
                            });
                            return movie;
                        }
                        catch (error) {
                            console.error('Error fetching movie:', error);
                            throw error;
                        }
                    }),
                    movies: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const movies = yield db_1.prismaClient.movie.findMany();
                            return movies;
                        }
                        catch (error) {
                            console.error('Error fetching movies:', error);
                            throw error;
                        }
                    }),
                },
                Mutation: {
                    createMovie: (_2, _b) => __awaiter(this, [_2, _b], void 0, function* (_, { input }) {
                        try {
                            const movie = yield db_1.prismaClient.movie.create({
                                data: Object.assign(Object.assign({}, input), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
                            });
                            return movie;
                        }
                        catch (error) {
                            console.error('Error creating movie:', error);
                            throw error;
                        }
                    }),
                    deleteMovie: (_3, _c) => __awaiter(this, [_3, _c], void 0, function* (_, { id }) {
                        try {
                            yield db_1.prismaClient.movie.delete({
                                where: { id }
                            });
                            return true;
                        }
                        catch (error) {
                            console.error('Error deleting movie:', error);
                            throw error;
                        }
                    }),
                    updateMovie: (_4, _d) => __awaiter(this, [_4, _d], void 0, function* (_, { input }) {
                        const { id } = input, data = __rest(input, ["id"]);
                        try {
                            const movie = yield db_1.prismaClient.movie.update({
                                where: { id },
                                data: Object.assign(Object.assign({}, data), { updatedAt: new Date().toISOString() })
                            });
                            return movie;
                        }
                        catch (error) {
                            console.error('Error updating movie:', error);
                            throw error;
                        }
                    }),
                }
            },
        });
        yield gqlserver.start();
        app.get("/", (req, res) => {
            res.json({ message: "seevering" });
        });
        app.use("/graphql", (0, express4_1.expressMiddleware)(gqlserver));
        app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
    });
}
init();
