const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { createJWT } = require("../middleWare/JWTAction");

const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
const checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.users.findOne({ where: { email: email } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createANewUser = (req) => {
  // console.log(req.file.url);

  return new Promise(async (resolve, reject) => {
    try {
      if (
        !req.body.email ||
        !req.body.password ||
        !req.body.nickName ||
        !req.body.phoneNumber ||
        !req.file.url
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const check = await checkUserEmail(req.body.email);
        if (check === true) {
          resolve({
            errCode: 1,
            message: "Your email is already in used, Plz try an other email!",
          });
        } else {
          const hashPasswordFromBcrypt = await hashUserPassword(
            req.body.password
          );
          const user = await db.users.create({
            email: req.body.email,
            password: hashPasswordFromBcrypt,
            nickName: req.body.nickName,
            image: req.file.url,
            role: "R3",
            phoneNumber: req.body.phoneNumber,
          });
          const token = createJWT({ userId: user.id, role: user.role });
          delete user.password;
          delete user.role;
          resolve({
            errCode: 0,
            data: user,
            token: token,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
// login with google
const loginWithGoogle = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.body.email || !req.body.nickName || !req.body.avatar) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const check = await checkUserEmail(req.body.email);
        if (check === true) {
          const userFound = await db.users.findOne({
            where: { email: req.body.email },
          });
          const token = createJWT({
            userId: userFound.id,
            role: userFound.role,
          });
          delete userFound.password;
          delete userFound.role;
          resolve({
            errCode: 0,
            data: userFound,
            token: token,
          });
        } else {
          const user = await db.users.create({
            email: req.body.email,
            nickName: req.body.nickName,
            image: req.body.avatar,
            role: "R3",
          });
          const token = createJWT({ userId: user.id, role: user.role });
          delete user.password;
          delete user.role;
          resolve({
            errCode: 0,
            data: user,
            token: token,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      if (!data.email || !data.password) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const isExist = await checkUserEmail(data.email);
        if (isExist) {
          const user = await db.users.findOne({
            where: { email: data.email },
          });
          if (user) {
            const check = await bcrypt.compareSync(
              data.password,
              user.password
            );
            if (check) {
              userData.errCode = 0;
              userData.errMessage = "Ok";
              const token = createJWT({ userId: user.id, role: user.role });
              delete user.password;
              delete user.role;
              userData.data = user;
              userData.token = token;
            } else {
              userData.errCode = 3;
              userData.errMessage = "Wrong password!";
            }
          } else {
            userData.errCode = 2;
            userData.errMessage = `User not found! Plz try again!`;
          }
        } else {
          userData.errCode = 1;
          userData.errMessage = `Your's email isn't exist. Plz try other email!`;
        }
        resolve(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleUpdateUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.users.findOne({
        where: { id: req.userId },
        raw: false,
      });

      if (user) {
        user.nickName = req.body?.nickName || user.nickName;
        user.address = req.body?.address || user.address;
        user.phoneNumber = req.body?.phoneNumber || user.phoneNumber;
        user.image = req.body?.image || user.image;

        await user.save();
        resolve({
          errCode: 0,
          message: "Update user succeeded",
          data: user,
        });
      } else {
        resolve({
          errCode: 1,
          message: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleDeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 1, message: "Missing parameter" });
      } else {
        const user = await db.users.findOne({ where: { id } });
        if (!user) {
          resolve({ errCode: 2, message: "User doesn't exist!" });
        } else {
          await db.users.destroy({ where: { id } });
          resolve({
            errCode: 0,
            message: "This user has already been deleted",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleGetAllUsers = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userLogin = await db.users.findOne({ where: { id } });
      if (!userLogin) {
        resolve({ errCode: 403, errMessage: "access denied" });
      } else {
        const data = await db.users.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
        resolve({
          errCode: 0,
          message: "ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createANewUser,
  handleLogin,
  handleGetAllUsers,
  handleUpdateUser,
  handleDeleteUser,
  loginWithGoogle,
};
