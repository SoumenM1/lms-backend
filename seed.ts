// // seed.ts
// import { connect, connection, model } from 'mongoose';
// import { SchemaFactory } from '@nestjs/mongoose';
// import { Question } from '../lms-backend/src/questions/schemas/question.schema'; // Adjust the path based on your schema
// import { faker } from '@faker-js/faker';

// // Create the schema and model
// const QuestionSchema = SchemaFactory.createForClass(Question);
// const QuestionModel = model('Question', QuestionSchema);

// const MONGO_URI = 'mongodb+srv://soumen:YzTyPQ7gAIEsw5OG@cluster0.c5spa4r.mongodb.net/nestDB?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI

// const generateRandomQuestions = (num: number) => {
//   const questions = [];
//   for (let i = 0; i < num; i++) {
//     questions.push({
//       text: faker.lorem.sentence(),
//       options: [
//         faker.lorem.word(),
//         faker.lorem.word(),
//         faker.lorem.word(),
//         faker.lorem.word(),
//       ],
//       correctAnswer: faker.lorem.word(),
//       difficulty: faker.datatype.number({ min: 1, max: 10 }), // Generating a random difficulty level between 1 and 10
//     });
//   }
//   return questions;
// };

// const seedDatabase = async () => {
//   try {
//     await connect(MONGO_URI);

//     const questions = generateRandomQuestions(500);

//     // Validate each document
//     for (const question of questions) {
//       const validationError = new QuestionModel(question).validateSync();
//       if (validationError) {
//         console.error('Validation error:', validationError);
//         return;
//       }
//     }

//     await QuestionModel.insertMany(questions);
//     console.log('500 random questions have been inserted successfully!');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } finally {
//     await connection.close();
//   }
// };

// seedDatabase();


import mongoose, { Document,model } from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { User } from './src/auth/schemas/user.schema'; // Adjust the path
import { Question } from './src/questions/schemas/question.schema'; // Adjust the path
import { Test  } from './src/tests/schemas/test.schema'; // Adjust the path
const QuestionSchema = SchemaFactory.createForClass(Question);
const QuestionModel = model('Question', QuestionSchema);
const UserSchema = SchemaFactory.createForClass(User);
const UserModel = model('User',UserSchema);

const TestSchema = SchemaFactory.createForClass(Test);
const TestModel = model('Test',TestSchema);

const MONGO_URI = 'mongodb+srv://soumen:YzTyPQ7gAIEsw5OG@cluster0.c5spa4r.mongodb.net/nestDB?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
}

interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
}

const generateRandomTest = async () => {
  const users = await UserModel.find().exec() as IUser[];
  const questions = await QuestionModel.find().exec() as IQuestion[];
  
  if (users.length === 0 || questions.length === 0) {
    throw new Error('Users or Questions collection is empty.');
  }

  const userId = users[Math.floor(Math.random() * users.length)]._id;
  const randomQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10); // Select 10 random questions

  return {
    userId,
    questions: randomQuestions.map((q) => q._id),
    uniqueURL: faker.datatype.uuid(),
    attempts: Math.floor(Math.random() * 100),
    score: Math.floor(Math.random() * 100),
  };
};

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);

    // Create and insert dummy data
    const testData = [];
    for (let i = 0; i < 10; i++) { // Create 10 dummy tests
      const test = await generateRandomTest();
      testData.push(test);
    }

    await TestModel.insertMany(testData);
    console.log('Dummy test data has been inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
// npx ts-node seed.ts
