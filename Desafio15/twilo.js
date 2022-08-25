require('dotenv').config();
const twilio = require('twilio');
const cliente = twilio(process.env.TWILIO_ACCOUNT,process.env.TWILIO_TOKEN);

cliente.messages.create({
    to: process.env.TWILIO_TO,
    from: process.env.TWILIO_FROM,
    body: 'Cuerpo del mensaje'
}).then((data) => {
    console.log('Mensaje enviado correctamente');
}).catch(err => console.log(err));