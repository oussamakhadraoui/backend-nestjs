import * as nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '66afacbc24ee4b',
    pass: 'd708ce133e7499',
  },
});

export async function sendingMail(option: {
  from: string;
  to: string;
  text: string;
}) {
  // send mail with defined transport object
  await transport.sendMail({
    from: option.from, // sender address
    to: option.to, // list of receivers
    subject: 'Changing password harry up it last for 10 min ✔', // Subject line
    text: option.text, // plain text body
    html: '<b>Hello world?</b>', // html body
  });
}
