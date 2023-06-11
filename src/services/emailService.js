const nodemailer = require("nodemailer");

const sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"BIN SHOP 👻" <tranong600@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt mua sản phẩm", // Subject line

    html: `
        <h3>Xin chào ${dataSend.name}!</h3>
        
        <p>Cảm ơn bạn đã mua hàng tại BinShop</p>
        <div>Đơn hàng của bạn sẽ được vận chuyển tới địa chỉ <strong style="color:red">${dataSend.address}</strong> trong vài ngày tới</div>
        <p>@Shipper sẽ gọi cho bạn theo số điện thoại <strong style="color:red">${dataSend.phone}</strong>, bạn vui lòng để ý điện thoại trong vài ngày tới,đừng để shipper gọi nhiều lần mà không nghe máy nhé...BinShop mãi yêu :))</p>
        </div>
        <div>
        <p>Mua sắm nhiều hơn tại:</p>
        <a href=${dataSend.redirectLink} target="_blank">BShop.com.vn</a>
        </div>

        <div>Xin chân thành cảm ơn!</div>
    `,
  });
};

module.exports = {
  sendSimpleEmail,
};
