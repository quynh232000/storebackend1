const db = require("../models/index");

const getAllCode = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.code) {
        resolve({ errCode: -1, message: "Missing parameter" });
      } else {
        const data = await db.allcodes.findAll({
          where: { type: req.code.toUpperCase() },
        });

        resolve({ errCode: 0, data: data });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getTypeBrain = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.typeBrain) {
        resolve({ errCode: -1, message: "Missing parameter" });
      } else {
        const data = await db.products.findAll({
          where: { group: req.typeBrain.toUpperCase() },
          include: [
            {
              model: AllCodes,
              where: { type: "BRAIN" },
            },
          ],
        });

        resolve({ errCode: 0, data: data });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCode,
  getTypeBrain,
};
