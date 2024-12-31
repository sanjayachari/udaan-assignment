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

routes.post('/leads', verifyJWT, addLead);

routes.get('/leads/:id', verifyJWT, getLeadById);

routes.put('/leads', verifyJWT, updateLeadDetails); // update

routes.get('/leads/kam/:kamId', verifyJWT, getLead);

routes.get('/remaining-leads/kam/:kamId', verifyJWT, getCallRemainingLeads);

routes.get('/call-history-leads/kam/:kamId', verifyJWT, getCallHistory);

routes.post('/leads/:leadId/contacts', verifyJWT, addContact);

routes.post('/leads/:leadId/interactions', verifyJWT, logInteraction);

routes.post('/leads/:leadId/orders', verifyJWT, addOrder);

routes.post('/leads/:leadId/callFrequency', verifyJWT, setCallFrequency);


module.exports = routes;
