const userService = require("../services/commentService");

const handleCreateAComment = async (req, res) => {
  try {
    const data = await userService.createAComment(req);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleGetAllComment = async (req, res) => {
  try {
    const data = await userService.getAllComment(req.query);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleDeleteAComment = async (req, res) => {
  try {
    const data = await userService.deleteAComment(req);
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
  handleCreateAComment,
  handleGetAllComment,
  handleDeleteAComment,
};
