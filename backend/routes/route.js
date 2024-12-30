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
  getUser,
  getKAM,
  getLead,
  updateLeadDetails,
  getLeadById,
  getCallRemainingLeads,
  getCallHistory,
  logout
} = require("../controllers/controller");


const express = require("express");
const routes = express.Router();

routes.get("/test", test);
routes.post("/register", register);
routes.post("/add-kam", addKAM);
routes.get("/get-user", verifyJWT, getUser);
routes.post("/login", login);
routes.post("/logout", logout);
routes.get("/get-kam/:kamId", verifyJWT, getKAM);

routes.post('/leads', addLead);
routes.get('/leads/:id', getLeadById);
routes.put('/leads', updateLeadDetails); // update

routes.get('/leads/kam/:kamId', getLead);
routes.get('/remaining-leads/kam/:kamId', getCallRemainingLeads);
routes.get('/call-history-leads/kam/:kamId', getCallHistory);

routes.post('/leads/:leadId/contacts', addContact);
routes.post('/leads/:leadId/interactions', logInteraction);
routes.post('/leads/:leadId/orders', addOrder);
routes.post('/leads/:leadId/callFrequency', setCallFrequency);






module.exports = routes;
