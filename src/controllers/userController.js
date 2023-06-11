const userService = require("../services/userService");

const createANewUser = async (req, res) => {
  try {
    const data = await userService.createANewUser(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const loginWithGoogle = async (req, res) => {
  try {
    const data = await userService.loginWithGoogle(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleLogin = async (req, res) => {
  try {
    const data = await userService.handleLogin(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleDeleteUser = async (req, res) => {
  try {
    const data = await userService.handleDeleteUser(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleUpdateUser = async (req, res) => {
  try {
    const data = await userService.handleUpdateUser(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleGetAllUsers = async (req, res) => {
  try {
    const data = await userService.handleGetAllUsers(req.userId);
    // console.log(req.userId);
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
  createANewUser,
  handleLogin,
  handleDeleteUser,
  handleGetAllUsers,
  handleUpdateUser,
  loginWithGoogle,
};
