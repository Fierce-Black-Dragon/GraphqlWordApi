import { graphql, buildSchema } from "graphql";

const schema = buildSchema(`
type Word{
    _id:ID!
    wordName:String!
    definition:String!
    examples:String
    synonyms:[String]
    Grammer:String
}
input WordInput{
    wordName:String!
 
  
}

  type RootQuery {
      words: [Word!]!
      word(wordId:ID!): Word!
  }
  type RootMutation {
     createWord(wordInput:WordInput):Word
  }
  schema {
      query: RootQuery
      mutation: RootMutation
  }
`);
export default schema;
