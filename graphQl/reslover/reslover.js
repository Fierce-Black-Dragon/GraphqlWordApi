import wordSchema from "../../models/word.js";
import axios from "axios";

const rootReslover = {
  // fetching all words from the database
  words: () => {
    return wordSchema
      .find()
      .then((words) => {
        return words.map((word) => {
          return { ...word._doc, _id: word.id };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  word: (args) => {
    // fetching  word by id from the database
    return wordSchema
      .findById(args.wordId)
      .then((word) => {
        return word;
      })
      .catch((err) => {
        throw err;
      });
  },

  createWord: async (args) => {
    const foundWord = await wordSchema.findOne({
      wordName: args.wordInput.wordName.toLowerCase(),
    });
    // to find if the word is already in the database
    if (foundWord) {
      throw new Error("Word already exists");
    } else {
      // to get the word  details from the  oxford API
      const apiresult = await axios.get(
        `https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${args.wordInput.wordName.toLowerCase()}?strictMatch=true`,
        {
          headers: {
            app_id: process.env.API_ID,
            app_key: process.env.API_KEY,
          },
        }
      );

      const example =
        apiresult.data?.results[0]?.lexicalEntries[0]?.entries[0]?.senses[0]
          ?.examples[0].text;
      const resultSynonyms =
        apiresult.data?.results[0]?.lexicalEntries[0]?.entries[0]?.senses[1]?.synonyms?.map(
          (p) => p.text
        );
      // saving the word in the database
      const word = new wordSchema({
        wordName: args.wordInput.wordName.toLowerCase(),
        definition:
          apiresult.data?.results[0]?.lexicalEntries[0]?.entries[0]?.senses[0]
            ?.definitions[0],
        examples: example,
        Grammer:
          apiresult.data?.results[0]?.lexicalEntries[0]?.lexicalCategory?.text,
        synonyms: resultSynonyms,
      });
      await word
        .save()
        .then((result) => {
          console.log(result);
          return { result };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
      return word;
    }
  },
};
export default rootReslover;
