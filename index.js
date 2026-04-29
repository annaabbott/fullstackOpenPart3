import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

dotenv.config();

const app = express();
let nextId = 1000;
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

app.get("/info", async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.send(
      "<p>Phonebook has info for " +
        persons.length +
        " people</p> <p>" +
        new Date() +
        "</p>",
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.get("/api/persons", async (request, response) => {
  const results = await Person.find({});
  response.json(results);
});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const body = request.body;

  try {
    const existingPerson = await Person.findOne({ name: body.name });
    if (existingPerson) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const body = request.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { number: body.number },
      { new: true, runValidators: true, context: "query" },
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
