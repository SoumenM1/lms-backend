<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```



1. Introduction
This document provides details on how to test the various API endpoints for the project. Each section includes the endpoint, method, request parameters, and expected responses.

2. Authentication APIs
2.1 Register User
Endpoint: /auth/register
Method: POST
Description: Register a new user.
Request Body:
json
Copy code
{
  "username": "testuser",
  "password": "password123"
}
Expected Response:
Status: 201 Created
Body:
json
Copy code
{
  "message": "User registered successfully"
}

2.2 Login User
Endpoint: /auth/login
Method: POST
Description: Login an existing user.
Request Body:
json
Copy code
{
  "username": "testuser",
  "password": "password123"
}
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "access_token": "JWT_TOKEN"
}

2.3 Logout User
Endpoint: /auth/logout
Method: POST
Description: Logout the current user.
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "message": "Logged out successfully"
}

3. Question Management APIs (Admin Only)
3.1 Create Question
Endpoint: /questions
Method: POST
Description: Create a new question with a specified difficulty.
Request Headers:
Authorization: Bearer JWT_TOKEN
Request Body:
json
Copy code
{
  "text": "What is the capital of France?",
  "difficulty": 5,
  "options": ["Paris", "Berlin", "Rome", "Madrid"],
  "correctAnswer": "Paris"
}
Expected Response:
Status: 201 Created
Body:
json
Copy code
{
  "message": "Question created successfully",
  "questionId": "QUESTION_ID"
}


3.2 Get All Questions
Endpoint: /questions
Method: GET
Description: Retrieve all questions.
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
[
  {
    "id": "QUESTION_ID",
    "text": "What is the capital of France?",
    "difficulty": 5,
    "options": ["Paris", "Berlin", "Rome", "Madrid"],
    "correctAnswer": "Paris"
  },
  ...
]


3.3 Get Question by ID
Endpoint: /questions/:id
Method: GET
Description: Retrieve a single question by its ID.
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "id": "QUESTION_ID",
  "text": "What is the capital of France?",
  "difficulty": 5,
  "options": ["Paris", "Berlin", "Rome", "Madrid"],
  "correctAnswer": "Paris"
}

3.4 Update Question
Endpoint: /questions/:id
Method: PUT
Description: Update an existing question by its ID.
Request Headers:
Authorization: Bearer JWT_TOKEN
Request Body:
json
Copy code
{
  "text": "What is the capital of Germany?",
  "difficulty": 5,
  "options": ["Berlin", "Paris", "Rome", "Madrid"],
  "correctAnswer": "Berlin"
}
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "message": "Question updated successfully"
}

3.5 Delete Question
Endpoint: /questions/:id
Method: DELETE
Description: Delete a question by its ID.
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "message": "Question deleted successfully"
}

4. Test Management APIs (End User)
4.1 Get Test by Unique URL
Endpoint: /tests/unique/:uniqueURL
Method: GET
Description: Retrieve test details using a unique URL.
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "id": "TEST_ID",
  "title": "Sample Test",
  "questions": [...]
}

4.2 Start Adaptive Test
Endpoint: /tests/:testId/start
Method: POST
Description: Start a new adaptive test for a user.
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "message": "Test started successfully",
  "firstQuestion": {
    "id": "QUESTION_ID",
    "text": "What is the capital of France?",
    "difficulty": 5,
    "options": ["Paris", "Berlin", "Rome", "Madrid"]
  }
}

4.3 Submit Answer
Endpoint: /tests/:testId/questions/:questionId/answer
Method: POST
Description: Submit an answer for a question and get the next question based on the response.
Request Headers:
Authorization: Bearer JWT_TOKEN
Request Body:
json
Copy code
{
  "answer": "Paris"
}
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "correct": true,
  "nextQuestion": {
    "id": "NEXT_QUESTION_ID",
    "text": "What is the capital of Germany?",
    "difficulty": 6,
    "options": ["Berlin", "Paris", "Rome", "Madrid"]
  }
}

5. Test Results APIs (Admin Only)
5.1 Get Test Results
Endpoint: /tests/:testId
Method: GET
Description: Retrieve the test results (admin only).
Request Headers:
Authorization: Bearer JWT_TOKEN
Expected Response:
Status: 200 OK
Body:
json
Copy code
{
  "testId": "TEST_ID",
  "results": [
    {
      "userId": "USER_ID",
      "score": 80,
      "attempts": 20,
      ...
    },
    ...
  ]
}

