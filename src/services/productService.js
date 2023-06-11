const db = require("../models/index");
const { sendSimpleEmail } = require("./emailService");

const createNewProduct = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.body.name || !req.file?.url || !req.body.group) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const product = await db.products.create({
          name: req.body.name,
          image: req.file.url,
          group: req.body.group,
          priceUp: req.body.priceUp || null,
          priceDown: req.body.priceDown || null,

          brain: req.body.brain || null,
          sale: req.body.sale || null,
          color: req.body.color || null,
          rom: req.body.rom || null,
          ram: req.body.ram || null,
          screen: req.body.screen || null,
          card: req.body.card || null,

          camera: req.body.camera || null,
          cpu: req.body.cpu || null,
          origin: req.body.origin || null,
          amount: req.body.amount || null,
          contentMarkdown: req.body.contentMarkdown || null,
          contentHTML: req.body.contentHTML || null,
          status: req.body.status || "YES",
        });
        resolve({ errCode: 0, message: "ok", data: product });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleUpdateProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({ errCode: 2, message: "Missing required parameters" });
      }
      let product = await db.products.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (product) {
        product.name = data.name;
        product.brain = data.brain;
        product.priceUp = data.priceUp;
        product.priceDown = data.priceDown;
        product.ram = data.ram;
        product.rom = data.rom;
        product.screen = data.screen;
        product.sale = data.sale;
        product.card = data.card;
        product.group = data.group;

        product.color = data.color;
        product.camera = data.camera;
        product.cpu = data.cpu;
        product.origin = data.origin;
        product.amount = data.amount;
        product.contentHTML = data.contentHTML;
        product.contentMarkdown = data.contentMarkdown;

        const productUpdate = await product.save();
        resolve({
          errCode: 0,
          message: "Update product succeeded!",
          data: productUpdate,
        });
      } else {
        resolve({
          errCode: 1,
          message: "Product not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleDeleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 1, message: "Missing parameter" });
      } else {
        const product = await db.products.findOne({ where: { id } });
        if (!product) {
          resolve({ errCode: 2, message: "Product doesn't exist!" });
        } else {
          await db.products.destroy({ where: { id } });
          resolve({
            errCode: 0,
            message: "This product has already been deleted",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleGetAllProducts = (res) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (res.page) {
        const countTotal = await db.products.count();
        let currentPage = res.page || 1;
        let perPage = 10;
        const totalPages = Math.ceil(+countTotal / perPage);
        let start = countTotal - currentPage * perPage;
        if (start > 0) {
          start = countTotal - currentPage * perPage;
        } else if (start < 0 && start > -perPage) {
          start = 0;
          perPage = countTotal - Math.floor(+countTotal / perPage) * perPage;
        } else {
          start = 0;
          perPage = 0;
        }
        const data = await db.products.findAll({
          offset: start,
          limit: perPage,
        });
        resolve({
          errCode: 0,
          message: "ok",
          data: data,
          pagination: {
            total: countTotal,
            count: data.length,
            perPage: 10,
            currentPage: +currentPage,
            totalPages: totalPages,
          },
        });
      } else {
        resolve({
          errCode: 0,
          message: "Missing Parameter: page",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleGetAProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 2, message: "Missing required parameters" });
      } else {
        const data = await db.products.findOne({ where: { id: id } });
        resolve({
          errCode: 0,
          message: "ok",
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleGetAGroup = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.type) {
        const data = await db.products.findAll();
        resolve({
          errCode: 0,
          message: "ok",
          data: data,
        });
      } else {
        if (req.brand === "B0") {
          const data = await db.products.findAll({
            where: { group: req.type },
            include: [
              {
                model: db.allcodes,
                as: "brainData",
              },
            ],
            raw: true,
            nest: true,
          });
          resolve({
            errCode: 0,
            message: "ok",
            data: data || [],
          });
        } else {
          const data = await db.products.findAll({
            where: { group: req.type, brain: req.brand },
            include: [
              {
                model: db.allcodes,
                as: "brainData",
              },
            ],
            raw: true,
            nest: true,
          });
          resolve({
            errCode: 0,
            message: "ok",
            data: data || [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleSearch = (q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.products.findAll({
        include: [
          {
            model: db.allcodes,
            as: "brainData",
            attributes: ["value"],
          },
        ],
        raw: true,
        nest: true,
      });
      let list = [];
      if (data) {
        data.map((item) => {
          if (item.name.toLowerCase().includes(q)) {
            list.push(item);
          }
        });
      }
      resolve({
        errCode: 0,
        message: "ok",
        data: list || [],
      });
    } catch (e) {
      reject(e);
    }
  });
};
const handleBookingProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.address ||
        !data.idProduct
      ) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      } else {
        Array.from(data.idProduct.split(",")).map(async (id) => {
          await db.bookings.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            status: "S1",
            address: data.address,
            idProduct: +id,
          });
          let productBooking = await db.products.findOne({
            where: { id: data.idProduct },
            raw: false,
          });
          if (productBooking) {
            productBooking.amount = +productBooking.amount - 1;
            await productBooking.save();
          }
        });
        await sendSimpleEmail({
          name: data.name,
          phone: data.phone,
          address: data.address,
          receiverEmail: data.email,
          redirectLink: `${process.env.URL_REACT}/`,
        });
        resolve({
          errCode: 0,
          message: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getProductBooking = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      } else {
        let user = await db.users.findOne({
          where: { id: id },
        });
        if (!user) {
          resolve({
            errCode: 3,
            message: "User not exist",
          });
        } else {
          let userBooking = await db.bookings.findOne({
            where: { email: user.email },
          });
          resolve({
            errCode: 0,
            message: "ok",
            data: userBooking.idProduct,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getBookingStatus = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.query?.status) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      } else {
        let user = await db.users.findOne({
          where: { id: req.userId },
        });
        if (!user) {
          resolve({
            errCode: 3,
            message: "User not exist",
          });
        } else {
          let bookingProduct = await db.bookings.findAll({
            where: { email: user.email, status: req.query.status },
            include: [
              {
                model: db.products,
                as: "productData",
                attributes: [
                  "id",
                  "image",
                  "name",
                  "origin",
                  "group",
                  "priceDown",
                ],
              },
            ],
            raw: true,
            nest: true,
          });

          resolve({
            errCode: 0,
            message: "ok",
            data: bookingProduct,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
const handleCancel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 2, message: "Missing required parameters" });
      }
      let booking = await db.bookings.findOne({
        where: { id: id },
        raw: false,
      });
      if (booking) {
        booking.status = "S4";

        await booking.save();
        resolve({
          errCode: 0,
          message: "Your product has been cancel successfully!",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Your product booking didn't found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// Booking admin
const bookingProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.status) {
        resolve({
          errCode: -1,
          message: "Missing parameters",
        });
      } else {
        let bookingProduct = await db.bookings.findAll({
          where: { status: data.status },
          include: [
            {
              model: db.products,
              as: "productData",
              attributes: ["name", "image", "createdAt"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          message: "Ok",
          data: bookingProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const confirmBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({ errCode: 2, message: "Missing required parameters" });
      }
      let booking = await db.bookings.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (booking) {
        booking.status = data.status;

        await booking.save();
        resolve({
          errCode: 0,
          message: "ok",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Your product booking didn't found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// create brand
const handleCreateBrandProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.value) {
        resolve({ errCode: 2, message: "Missing required parameters: value" });
      } else {
        let codeBrand = await db.allcodes.findAll({
          where: { type: "BRAIN" },
        });
        const countBrand = codeBrand.length || 0;
        await db.allcodes.create({
          type: "BRAIN",
          keyMap: "B" + (+countBrand + 1),
          value: data.value,
        });
        resolve({
          errCode: 0,
          message: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewProduct,
  handleGetAllProducts,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetAProduct,
  handleGetAGroup,
  handleSearch,
  handleBookingProduct,
  getProductBooking,
  getBookingStatus,
  handleCancel,
  bookingProduct,
  confirmBooking,
  handleCreateBrandProduct,
};
