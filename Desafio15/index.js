const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'myrl85@ethereal.email',
        pass: 'f8PjnddZBm5h73wyCE'
    }
});

transport.sendMail({
    from: 'Matias <matyfusa03@gmail.com>',
    to: 'myrl85@ethereal.email',
    html: '<h1>Que buen mail</h1>',
    subject: 'Mail de prueba'
}).then(result => {
    console.log(result);
}).catch(err => console.log(err))