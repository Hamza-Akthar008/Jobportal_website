const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "talentedpak008@gmail.com", // generated ethereal user
      pass: "vspkmolktosaubkv", // generated ethereal password
    },
  });
  exports.sendemail= (code)=>
  {
    var mailOptions = {
        from: "talentedpak008@gmail.com",
        to: "f200319@cfd.nu.edu.pk",
        subject: "Forget Password",
        text: "The Verfication code  is : "+code 
       
      };
      transporter.sendMail(mailOptions
      );
  }
 