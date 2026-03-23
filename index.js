const e = require("express");
const express = require("express");
const app = express();
let nextId = 1000;
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: nextId++,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: nextId++,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: nextId++,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: nextId++,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(
    "<p>Phonebook has info for " +
      persons.length +
      " people</p> <p>" +
      new Date() +
      "</p>",
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return nextId++;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "property name is missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "property number is missing",
    });
  }

  const match = persons.find((person) => person.name === body.name);
  if (match) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };
  persons = persons.concat(note);
  response.json(note);
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };
// app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
