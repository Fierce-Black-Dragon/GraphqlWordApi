import wordSchema from "./models/word.js";
const rootReslover = {
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
    const apiresult = await axios.get(
      `https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${args.wordInput.wordName}?strictMatch=true`,
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

    const word = new wordSchema({
      wordName: args.wordInput.wordName,
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
        return { ...result._doc, _id: result._doc._id.toString() };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return word;
  },
};
export default rootReslover;
