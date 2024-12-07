import mongoose from 'mongoose';

// import { User } from '../express-backend/users/userModel.js'; 
import { User, List, Task } from '../express-backend/users/userModel.js';

describe ('User Success', () => {
    beforeAll(async () => {
		await mongoose.connect('mongodb://localhost:27017/testDB', {});
	});
    afterAll(async () => {
		await mongoose.connection.close();
	});
})

const exampleUser = [
    {
      _id: new mongoose.Types.ObjectId(),
      userName: "asd",
      email: "asd@gmail.com",
      firstName: "asd",
      lastName: "asd",
      lists: [new mongoose.Types.ObjectId()],
    },
  ];
