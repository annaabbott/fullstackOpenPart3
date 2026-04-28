import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

dotenv.config();

const app = express();
let nextId = 1000;
// const password = process.argv[2];
// const url =
//   "mongodb+srv://annaabbottdesign_db_user:<db_password>@cluster0.3itr5l5.mongodb.net/?appName=Cluster0".replace(
//     "<db_password>",
//     password,
//   );
const url = process.env.MONGODB_URI;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: http:;",
  );
  next();
});
app.use(express.json());
app.use(morgan("dev"));

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use(express.static("dist"));

app.get("/info", (request, response) => {
  response.send(
    "<p>Phonebook has info for " +
      persons.length +
      " people</p> <p>" +
      new Date() +
      "</p>",
  );
});

app.get("/api/persons", async (request, response) => {
  const results = await Person.find({});
  response.json(results);
});

app.get("/api/persons/:id", async (request, response) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  }

  const match = persons.find((person) => person.name === body.name);
  if (match) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
