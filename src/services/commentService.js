const db = require("../models/index");

const createAComment = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("qunyh", req.userId);
      // return "ok";
      if (!req.body.comment || !req.body.productId) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        await db.comments.create({
          userId: req.userId,
          productId: req.body.productId,
          comment: req.body.comment,
        });
        resolve({
          errCode: 0,
          message: "Create comment successfully!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllComment = (res) => {
  const id = res.productId;
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        const countTotal = await db.comments.count({
          where: { productId: id },
        });
        let currentPage = res.page || 1;
        let perPage = 5;
        const totalPages = Math.ceil(+countTotal / perPage);
        let start = countTotal - currentPage * perPage;
        if (start > 0) {
          start = countTotal - currentPage * perPage;
        } else if (start < 0 || start > -perPage) {
          start = 0;
          perPage = countTotal - Math.floor(+countTotal / perPage) * perPage;
        } else {
          start = 0;
          perPage = 0;
        }
        const data = await db.comments.findAll({
          where: { productId: id },
          include: [
            {
              model: db.users,
              as: "userData",
              attributes: ["nickName", "image"],
            },
          ],
          raw: true,
          nest: true,
          offset: start,
          limit: perPage,
        });
        resolve({
          errCode: 0,
          message: "ok",
          data: data.reverse(),
          pagination: {
            total: countTotal,
            count: data.length,
            perPage: 10,
            currentPage: +currentPage,
            totalPages: totalPages,
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const deleteAComment = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.userId || !req.query.commentId) {
        resolve({
          errCode: -1,
          message: "Missing parameter",
        });
      } else {
        const data = await db.comments.findOne({
          where: { id: req.query.commentId },
        });
        if (!data) {
          resolve({
            errCode: -3,
            message: "This comment does not exist",
          });
        } else {
          if (+data.userId === +req.userId) {
            await db.comments.destroy({ where: { id: req.query.commentId } });
            resolve({
              errCode: 0,
              message: "Deleted comment successfully!",
            });
          } else {
            resolve({
              errCode: -2,
              message: "Use cannot delete this comment.",
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createAComment,
  getAllComment,
  deleteAComment,
};
