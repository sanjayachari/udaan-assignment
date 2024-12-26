const verifyJWT = require("../auth/midleware");
const {
  test,
  register,
  addKAM,

  login,
  addLead,
  addContact,
  logInteraction,
  addOrder,
  setCallFrequency,
  getTodayCalls,
  getLastCall,
  getPerformance,
  getUser,
  getKAM,
  getLead
} = require("../controllers/controller");


const express = require("express");
const routes = express.Router();

routes.get("/test", test);
routes.post("/register", register);
routes.post("/add-kam", addKAM);
routes.get("/get-user", verifyJWT, getUser);
routes.post("/login", login);
routes.get("/get-kam/:kamId", verifyJWT, getKAM);

routes.post('/leads', addLead);
routes.get('/leads/kam/:kamId', getLead);
routes.post('/leads/:leadId/contacts', addContact);
routes.post('/leads/:leadId/interactions', logInteraction);
routes.post('/leads/:leadId/orders', addOrder);
routes.post('/leads/:leadId/callFrequency', setCallFrequency);
routes.get('/leads/todayCalls', getTodayCalls);
routes.get('/leads/:leadId/lastCall', getLastCall);

routes.get('/leads/:leadId/performance', getPerformance);




module.exports = routes;
