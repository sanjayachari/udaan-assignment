const KAM = require("../db/kamSchema");
const Lead = require("../db/leadSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const test = (req, res) => {
  console.log("Test working..");
  return res.json("Test working..");
};


const login = async (req, res) => {
  console.log("rendered!");
  try {
    const { email, password } = req.body;
    const user = await KAM.findOne({ email });
    if (!user) {
      return res.json({ message: "User not exist" });
    }
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (hashedPassword) {
      const jwtSign = jwt.sign({ user }, "san", { expiresIn: 60 * 60 });
      res.cookie("token", jwtSign, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, // Expiration time in milliseconds

      });

      // Return the logged-in user info (excluding password)
      return res.json(user);
    } else {
      return res.status(403).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    return res.status(403).json({ message: "somthing went wrong" });
  }
};

const salt = 10; // Define the salt rounds

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the email already exists
    const isExist = await KAM.findOne({ email });
    if (isExist) {
      return res.status(405).json({ message: 'Email already registered!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new KAM
    const newKAM = await KAM.create({
      email,
      password: hashedPassword,
      KAMS: [
        {
          fullName,
          status: 'Active', // Default status
        },
      ],
    });

    return res.status(200).json({
      message: 'KAM registration successful!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const addKAM = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    // Find the parent KAM document by email
    const parentKAM = await KAM.findOne({ email: email });
    if (!parentKAM) {
      return res.status(404).json({ message: 'Parent KAM not found' });
    }

    // Check if the fullName already exists within the parent KAM's KAMS array
    const isExist = parentKAM.KAMS.some(kam => kam.fullName === fullName);
    if (isExist) {
      return res.status(405).json({ message: 'KAM with this full name already exists!' });
    }

    // Add the new KAM to the parent KAM's KAMS array
    parentKAM.KAMS.push({
      fullName,
      status: 'Active', // Default status
    });

    // Save the updated parent KAM document
    await parentKAM.save();

    console.log('New KAM added:', parentKAM);

    return res.status(200).json({
      message: 'New KAM added successfully!',
      newKAM: {
        fullName,
        status: 'Active',
      },
    });
  } catch (error) {
    console.error('Error adding new KAM:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getUser = async (req, res) => {
  try {
    // Access the user from the JWT
    const user = req.user;  // The decoded user is set in the verifyJWT middleware

    // Find the KAM using the email from the JWT
    const kam = await KAM.findOne({ email: user.email });

    if (!kam) {
      return res.status(404).json({ message: 'KAM not found' });
    }

    // Return the KAM's details
    res.status(200).json({
      message: 'KAM details fetched successfully',
      kams: kam,  // Assuming the KAMs are stored in an array under the 'KAMS' field
    });
  } catch (error) {
    console.error('Error fetching KAMs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getKAM = async (req, res) => {
  try {
    const { kamId } = req.params;  // Get the KAM's ObjectId from the route params

    // Access the user from the JWT
    const user = req.user;  // The decoded user is set in the verifyJWT middleware
    // Find the KAM using the email from the JWT
    const kam = await KAM.findOne({ email: user.email });
    if (!kam) {
      return res.status(404).json({ message: 'KAM not found' });
    }

    // Find the specific KAM in the KAMS array by kamId
    const individualKAM = kam.KAMS.id(kamId);  // 'id' is a built-in mongoose method to find by ObjectId kam {
    if (!individualKAM) {
      return res.status(404).json({ message: 'Individual KAM not found' });
    }

    // Return the individual KAM details
    res.status(200).json({
      message: 'Individual KAM details fetched successfully',
      kam: individualKAM,
    });
  } catch (error) {
    console.error('Error fetching individual KAM:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addLead = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { name, address, leadStatus, email, kamId, fullName } = req.body;

    // Validate required fields
    if (!name || !address || !leadStatus || !email || !kamId || !fullName) {
      return res.status(400).json({ error: 'All fields (name, address, leadStatus, email, kamId) are required.' });
    }

    // Validate the KAM ID and email combination
    const kamExists = await KAM.findOne({ "email": email });
    if (!kamExists) {
      return res.status(404).json({ error: 'No KAM found with the given email and kamId.' });
    }

    // Create a new lead
    const newLead = new Lead({
      name,
      address,
      leadStatus,
      contacts: [], // Default empty array
      interactions: [], // Default empty array
      orders: [], // Default empty array
      callFrequency: null, // Default null
      lastCall: null, // Default null
      keyAccountManagers: {
        kamId, // Associate the lead with the provided KAM ID
        fullName,
        assignedDate: new Date(), // Automatically set the assigned date
      },
    });

    // Save the new lead to the database
    await newLead.save();

    // Return success response with the new lead data
    res.status(201).json({ message: 'Lead added successfully!', lead: newLead });
  } catch (error) {
    // Log the error and return a 500 error response
    console.error('Error adding lead:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const updateLeadDetails = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { leadId, name, address, leadStatus } = req.body;

    // Validate required fields
    if (!leadId || !name || !address || !leadStatus) {
      return res
        .status(400)
        .json({ error: 'leadId, name, address, and leadStatus are required.' });
    }

    // Find the lead by ID and update the fields
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { name, address, leadStatus },
      { new: true, runValidators: true } // Return the updated document
    );

    console.log('test', leadId, name, address, leadStatus, updatedLead)

    // If the lead does not exist, return an error
    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Return success response with the updated lead data
    res.status(200).json({ message: 'Lead updated successfully!', lead: updatedLead });
  } catch (error) {
    // Log the error and return a 500 error response
    console.error('Error updating lead details:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getLead = async (req, res) => {
  try {
    const { kamId } = req.params; // Get the leadId from route params

    const leads = await Lead.find({ 'keyAccountManagers.kamId': kamId });
    if (!leads) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    return res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getCallRemainingLeads = async (req, res) => {
  try {
    const { kamId } = req.params; // Get the kamId from route params

    // Fetch all leads for the given KAM
    const leads = await Lead.find({ 'keyAccountManagers.kamId': kamId });
    if (!leads || leads.length === 0) {
      return res.status(404).json({ error: 'No leads found for the specified KAM.' });
    }

    // Get today's date without time (UTC format)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Filter leads based on `lastCall` and `callFrequency`
    const remainingCallsLeads = leads.filter((lead) => {
      if (!lead.lastCall) return true; // Include leads with no lastCall

      const lastCallDate = new Date(lead.lastCall);
      lastCallDate.setUTCHours(0, 0, 0, 0);

      // Check call frequency and compare accordingly
      if (lead.callFrequency === 'Daily') {
        return lastCallDate.getTime() !== today.getTime(); // Exclude leads called today for daily frequency
      } else if (lead.callFrequency === 'Weekly') {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7); // Set the date to one week ago
        return lastCallDate.getTime() < oneWeekAgo.getTime(); // Exclude leads called in the last week for weekly frequency
      }
      
      return true; // Include leads with no frequency set or any other condition
    });

    return res.status(200).json(remainingCallsLeads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



const getCallHistory = async (req, res) => {
  try {
    const { kamId } = req.params; // Get the kamId from route params

    // Fetch all leads for the given KAM
    const leads = await Lead.find({ 'keyAccountManagers.kamId': kamId });
    if (!leads || leads.length === 0) {
      return res.status(404).json({ error: 'No leads found for the specified KAM.' });
    }

    // Filter leads to include only those with `KAM-to-lead` interactions
    const kamToLeadInteractions = leads.map(lead => {
      const filteredInteractions = lead.interactions.filter(
        interaction => interaction.type === 'KAM-to-lead'
      );

      // Only include leads with at least one `KAM-to-lead` interaction
      if (filteredInteractions.length > 0) {
        return {
          ...lead.toObject(), // Convert lead to plain object
          interactions: filteredInteractions,
        };
      }
      return null;
    }).filter(lead => lead !== null); // Remove any leads that have no interactions

    if (kamToLeadInteractions.length === 0) {
      return res.status(404).json({ error: 'No call history found for the specified KAM.' });
    }

    // Reverse the order of interactions so the last call appears first
    kamToLeadInteractions.forEach(lead => {
      lead.interactions.reverse(); // Reverse interactions for each lead
    });

    // Reverse the overall order of leads if necessary (this can be adjusted based on your requirements)
    kamToLeadInteractions.reverse();

    return res.status(200).json(kamToLeadInteractions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getLeadById = async (req, res) => {
  try {
    const { id } = req.params; // Get the leadId from route params

    // Find the lead by its ID
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    return res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const addContact = async (req, res) => {
  try {
    const { leadId } = req.params; // Get the leadId from route params
    const { name, role, phone, email } = req.body; // Get the contact details from the request body

    // Validate the input
    if (!name || !role || !phone || !email) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Find the lead by ID
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Add the new contact to the lead's contacts array
    lead.contacts.push({ name, role, phone, email });
    await lead.save();

    // Return the updated lead
    res.status(201).json({ message: 'Contact added successfully!', lead });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const logInteraction = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { summary, type } = req.body; // Include `type` from request body

    // Validate `type` field
    if (!['KAM-to-lead', 'Lead-to-POC'].includes(type)) {
      return res.status(400).json({ error: 'Invalid interaction type. Must be either "KAM-to-lead" or "Lead-to-POC".' });
    }

    // Set date to the current backend date
    const date = new Date();

    if (!summary) {
      return res.status(400).json({ error: 'Summary is required.' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Add the interaction with the current date, summary, type, and hardcoded outcome
    lead.interactions.push({ date, summary, type, outcome: 'success' });

    // Update `lastCall` only if the type is `KAM-to-lead`
    if (type === 'KAM-to-lead') {
      lead.lastCall = date;
    }

    // Save the lead document with the new interaction
    await lead.save();

    res.status(201).json({ message: 'Interaction logged successfully!', lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const addOrder = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { orderName, role, name, quantity, value, date } = req.body;

    // Check if all fields are provided
    if (!orderName || !role || !name || !quantity || !value || !date) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    // Ensure proper data types for quantity and value
    const parsedQuantity = parseInt(quantity, 10);  // Convert quantity to number
    const parsedValue = parseFloat(value);  // Convert value to number

    if (isNaN(parsedQuantity) || isNaN(parsedValue)) {
      return res.status(400).json({ error: 'Quantity and value must be valid numbers.' });
    }

    const orderId = uuidv4();  // Generate a new order ID

    // Push the new order with all required fields
    lead.orders.push({
      orderId,
      name,
      orderName,
      role,
      quantity: parsedQuantity,
      value: parsedValue,
      date,
    });

    // Save the lead
    await lead.save();

    res.status(201).json({ message: 'Order logged successfully!', lead });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const setCallFrequency = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { frequency } = req.body;

    if (!frequency || !['Daily', 'Weekly', 'Monthly'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency value.' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    lead.callFrequency = frequency;
    await lead.save();

    res.status(200).json({ message: 'Call frequency updated successfully!', lead });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};




module.exports = {
  test,
  login,
  register,
  addKAM,
  getUser,
  getKAM,
  addLead,
  getLead,
  addContact,
  logInteraction,
  addOrder,
  setCallFrequency,
  updateLeadDetails,
  getLeadById,
  getCallRemainingLeads,
  getCallHistory
};
