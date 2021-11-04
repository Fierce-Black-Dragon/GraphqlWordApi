import mongoose from "mongoose";

const WordSchema = new mongoose.Schema(
  {
    wordName: { type: String, required: true },
    email: { type: String, required: true },
    definition: { type: String, required: true },
    examples: { type: String, required: true },
    synonyms: [{ type: String }],
    Grammer: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const word = mongoose.model("Word", WordSchema);
export default word;
