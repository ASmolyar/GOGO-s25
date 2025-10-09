import MongoConnection from './src/config/mongoConnection.ts';
import createExpressApp from './src/config/createExpressApp.ts';
import 'dotenv/config';

import { hash } from 'bcrypt';
import { User } from './src/models/user.model.ts';

async function bootstrapAdmin() {
  const email = 'gogoadmin@gmail.com'; // your choice
  const plain = 'gogoimpactreport';   // your choice

  const existing = await User.findOne({ email }).exec();
  if (!existing) {
    const hashed = await hash(plain, 10);
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email,
      password: hashed,
      verified: true,
      admin: true,
    });
    console.log('Admin user created:', email);
  } else {
    if (!existing.admin || !existing.verified) {
      existing.admin = true;
      existing.verified = true;
      await existing.save();
      console.log('Admin user ensured:', email);
    } else {
      console.log('Admin user already exists:', email);
    }
  }
}

const main = async () => {
  // Listen for termination
  process.on('SIGTERM', () => process.exit());

  // Set up the datbase connection
  const dbConnection = await MongoConnection.getInstance();
  await dbConnection.open();

  // Instantiate express app with configured routes and middleware
  const app = createExpressApp(dbConnection.createSessionStore());

  // Instantiate a server to listen on a specified port
  app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')} 🚀`);
    console.log('  Press Control-C to stop\n');
  });

  await bootstrapAdmin();
};

// Run the server
main();
