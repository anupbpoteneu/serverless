const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

console.log("DB_NAME:", DB_NAME);
console.log("DB_USER:", DB_USER);
console.log("DB_PASSWORD:", DB_PASSWORD);
console.log("DB_HOST:", DB_HOST);
console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);




const functions = require('@google-cloud/functions-framework');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const { Sequelize } = require('sequelize');
const sequelize = require('./config.js');
const { User } = require('./usermodel.js');


// Log environment variables
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);
// Create Sequelize instance
// const sequelize = new Sequelize('webapp', 'webapp', 'F36JVi', {host: '10.53.116.2',dialect: 'mysql'});

// Create Sequelize instance
//  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {host: process.env.DB_HOST,dialect: 'mysql'});

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {host: DB_HOST,dialect: 'mysql'});

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY });
  



functions.cloudEvent('funcemail', async (cloudEvent) => {

  try {

     //database connectivity
     await sequelize.authenticate();
     console.log('Database connection successful.');
  
  
  const base64name = cloudEvent.data.message.data;

    
    const messageContent = Buffer.from(base64name, 'base64').toString();

    console.log('***(Received JSON):****', messageContent);

    // Parse message content as JSON.
    const { email, firstName, trackId } = JSON.parse(messageContent);
  
    console.log(`Hello, your naame is ${firstName} and your email is (${email})!`);

  // const name = base64name
  //   ? Buffer.from(base64name, 'base64').toString()
  //   : 'World';

  // console.log(`Hello, ${name}!`);

  console.log('(0) Received CloudEvent:', cloudEvent);
  console.log('(1) CloudEvent Data:', cloudEvent.data);
  console.log('(2) Pub/Sub Message:', cloudEvent.data.message);
  console.log('(3) Pub/Sub Message Data:', cloudEvent.data.message.data);
  console.log('(4) first name print :', firstName);
  console.log('(5) email print :', email);
  console.log('(6) Track ID print:', trackId);


  await mg.messages.create('mail.anupbpote.me', {
    from: 'WebOrg <mail@mail.anupbpote.me>',
    to: email,
    subject: "Regarding verification",
    text: `Hello,\n\nplease do the verification. We hope you are doing well!\n\nBest regards,\nWebOrg`,
    html: `<h4>Hello ${firstName}, your email ID is: ${email}. Please complete your verification!</h4><p>Click <a href="https://anupbpote.me/v1/user/verify?trackid=${trackId}">here</a> to verify your email address.</p>`
  });

  console.log("Email sent successfully");

      // Update emailTimestamp for user
    const user = await User.findOne({ where: { username: email } });
    if (user) {
      await User.update({ emailTimestamp: new Date() }, { where: { trackid: user.trackid } });
      console.log("Email timestamp updated for user:", email);
    } else {
      console.log("User not found with email:", email);
    }
    
}
catch (error) {
  console.error("Error processing message:", error);

  console.error("Error establishing database connection:", error);
}


});