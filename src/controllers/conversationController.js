const conversationService = require("../services/conversationService");

const createAConversation = async (req, res) => {
  try {
    const data = await conversationService.createAConversation(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const getConversations = async (req, res) => {
  try {
    const data = await conversationService.getConversations(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const createAMessage = async (req, res) => {
  try {
    const data = await conversationService.createAMessage(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const createAMessageAdmin = async (req, res) => {
  try {
    const data = await conversationService.createAMessageAdmin(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const getAConversation = async (req, res) => {
  try {
    const data = await conversationService.getAConversation(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const getAConversationAdmin = async (req, res) => {
  try {
    const data = await conversationService.getAConversationAdmin(req.query);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
module.exports = {
  createAConversation,
  getConversations,
  createAMessage,
  createAMessageAdmin,
  getAConversation,
  getAConversationAdmin,
};
