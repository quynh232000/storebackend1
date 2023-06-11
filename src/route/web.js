const express = require("express");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const allCodeController = require("../controllers/allCodeController");
const commentController = require("../controllers/commentController");
const conversationController = require("../controllers/conversationController");
const { authorToken, checkAdmin } = require("../middleWare/JWTAction");
const uploadAvatarCloud = require("../middleWare/uploadCloundinary");

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    res.set("Content-Type", "text/html;charset=utf-8");
    res.send("<h1>hello quynh</h1>");
  });
  // user
  router.post(
    "/sign-up-user",
    uploadAvatarCloud,
    userController.createANewUser
  );
  router.post("/login-user", userController.handleLogin);
  router.get("/delete-user", authorToken, userController.handleDeleteUser);
  router.post("/update-user", authorToken, userController.handleUpdateUser);
  router.get(
    "/get-all-users",
    authorToken,
    checkAdmin,
    userController.handleGetAllUsers
  );

  // login with google
  router.post("/auth/login/google", userController.loginWithGoogle);

  // products
  router.post(
    "/create-product",
    uploadAvatarCloud,
    productController.createNewProduct
  );
  router.post("/delete-product", productController.handleDeleteProduct);
  router.post(
    "/create-new-brand-product",
    productController.handleCreateBrandProduct
  );
  router.put("/update-product", productController.handleUpdateProduct);
  router.post("/cancel-product", productController.handleCancel);
  router.get(
    "/get-all-products",

    productController.handleGetAllProducts
  );
  router.get("/get-a-product", productController.handleGetAProduct);
  router.get("/get-a-group", productController.handleGetAGroup);
  router.get("/search", productController.handleSearch);

  router.post("/booking-product", productController.handleBookingProduct);

  router.get(
    "/get-booking-product-cart",

    productController.getProductBooking
  );
  // admin
  router.post("/confirm-booking", productController.confirmBooking);

  // product booking
  router.get(
    "/booking-status",
    authorToken,
    productController.handleBookingStatus
  );
  router.get(
    "/get-booking-product",

    productController.getBookingProduct
  );

  // get code
  router.get("/get-all-code", allCodeController.handleGetAllGroup);
  router.get("/get-type-brain", allCodeController.handleGetTypeBrain);
  // comment
  router.post(
    "/create-a-comment",
    authorToken,
    commentController.handleCreateAComment
  );
  router.post(
    "/delete-a-comment",
    authorToken,
    commentController.handleDeleteAComment
  );
  router.get(
    "/get-all-comments",

    commentController.handleGetAllComment
  );
  // message
  router.post(
    "/create-a-conversation",
    authorToken,
    conversationController.createAConversation
  );
  router.get(
    "/get-conversations",
    authorToken,
    conversationController.getConversations
  );
  router.post(
    "/create-a-message",
    authorToken,
    conversationController.createAMessage
  );
  router.post(
    "/create-a-message-admin",
    authorToken,
    conversationController.createAMessageAdmin
  );
  router.get(
    "/get-a-conversation",
    authorToken,
    conversationController.getAConversation
  );
  router.get(
    "/get-a-conversation-admin",
    authorToken,
    conversationController.getAConversationAdmin
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
