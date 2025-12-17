import express from "express";

const discovery = express();
discovery.use(express.json());

const services = {};

discovery.post("/register", (req, res) => {
  const { name, host, port } = req.body;
  services[name] ??= [];
  services[name].push({
    host,
    port,
  });
  res.status(200).json(`добавлен ${name}`);
  console.log(`добавлен ${name}`);
});

discovery.get("/services/:name", (req, res) => {
  console.log(services);
  res.json(services[req.params.name] || []);
});

discovery.listen(4001, () => console.log("старт"));
