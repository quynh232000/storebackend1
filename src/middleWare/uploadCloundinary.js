const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: "dhglwzgm3",
  api_key: "359316549556682",
  api_secret: "L2MtV_lWVQwRDuM0Y3bASFfve44",
});

const uploadAvatarCloud = async (req, res, next) => {
  const file = req.files.avatar;
  if (!file) {
    return res.status(200).json({
      errCode: 1,
      message: "No file has selected! Plz choose your file",
    });
  } else {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${Date.now()}`,
      resource_type: "avatar",
      folder: "avatar",
    });
    req.file = result;
    next();
  }
};

module.exports = uploadAvatarCloud;
