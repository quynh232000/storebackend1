const allCodeService = require("../services/allCodeService");

const handleGetAllGroup = async (req, res) => {
  try {
    const data = await allCodeService.getAllCode(req.query);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from services...",
    });
  }
};
const handleGetTypeBrain = async (req, res) => {
  try {
    const data = await allCodeService.getTypeBrain(req.query);
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
  handleGetAllGroup,
  handleGetTypeBrain,
};
