const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>",
  );
  process.exit(1);
}

const password = process.argv[2];

const url =
  "mongodb+srv://annaabbottdesign_db_user:<db_password>@cluster0.3itr5l5.mongodb.net/?appName=Cluster0".replace(
    "<db_password>",
    password,
  );

async function main() {
  mongoose.set("strictQuery", false);

  await mongoose.connect(url, { family: 4 });

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  await person.save();
  console.log("person saved!");

  const result = await Person.find({});
  result.forEach((person) => {
    console.log(person);
  });

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
