const exp = require("constants");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Kacharuk M",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Kacharuk M.",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "HELP",
    helpText: "Some helpful tips",
    name: "Kacharuk M.",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({error})
      }
      forecast(latitude, longitude, (error, { temperature, feelslike }={}) => {
        if (error) {
          return res.send({error})
        }

        res.send({
          forecast: 'It is ' + temperature + " degree. It feels like " + feelslike + ' degree.',
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  console.log(req.query);
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "HELP",
    errorMessage: "Help article not found",
    name: "Kacharuk M.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "Page Not Found",
    errorMessage: "Error 404 - Page not found",
    name: "Kacharuk M.",
  });
});

app.listen(PORT, () => {
  console.log("Server is up on port "+ PORT);
});
