## 🗳️ Pollify 🗳️

Pollify is an online polling system that allows users to create, manage, and participate in polls. With customizable options and real-time results, Pollify is a powerful tool for gathering feedback and opinions from your audience.

### 🌟 Features

> **🔐 FeaturesUser authentication:** Register and log in to create and manage polls.  
> **📝 Poll creation:** Create polls with customizable questions and options.  
> **🔗 Poll sharing:** Share polls with others using unique URLs.  
> **⏱️ Real-time results:** View poll results in real-time as votes are cast.  
> **🛠️ Poll management:** Edit and delete polls you've created.  
> **🗳️ Poll participation:** Vote in polls created by others.

### 💻 Technologies Used

This project utilizes various technologies and frameworks. Here are the key technologies used:

<table>
  <tr>
    <th>Technology</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>NestJs</td>
    <td>A progressive Node.js framework for building efficient and scalable server-side applications.</td>
  </tr>
  <tr>
    <td>Docker</td>
    <td>A containerization platform used to package the application and its dependencies into isolated containers.</td>
  </tr>
  <tr>
    <td>Postgres</td>
    <td>A powerful open-source relational database management system.</td>
  </tr>
  <tr>
    <td>TypeORM</td>
    <td>An Object-Relational Mapping (ORM) library for TypeScript and JavaScript that simplifies database integration.</td>
  </tr>
  <tr>
    <td>Localstack</td>
    <td>A fully functional local AWS cloud stack that enables local development and testing.</td>
  </tr>
  <tr>
    <td>AWS S3</td>
    <td>Amazon Simple Storage Service for storing and retrieving data objects, such as cover images in this project.</td>
  </tr>
  <tr>
    <td>Jest</td>
    <td>A JavaScript testing framework for unit testing and assertions.</td>
  </tr>
  <tr>
    <td>TypeScript</td>
    <td>A typed superset of JavaScript that compiles to plain JavaScript.</td>
  </tr>
  <tr>
    <td>Passport.js</td>
    <td>An authentication middleware for Node.js that supports various authentication strategies.</td>
  </tr>
  <tr>
    <td>JWT Strategy</td>
    <td>JSON Web Token (JWT) authentication strategy used for securing API endpoints.</td>
  </tr>
  <tr>
    <td>Socket.io</td>
    <td>A library for enabling real-time, bidirectional communication between web clients and servers.</td>
  </tr>
  <tr>
    <td>Swagger</td>
    <td>A tool for documenting and testing APIs.</td>
  </tr>
</table>

### 📚 Table of Contents

- Getting Started
- Usage
- Contributing
- Issues
- Contact
- License

### 🚀 Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

**Prerequisites**

Before you begin, make sure you have the following installed:

- Docker
- Docker Compose plugin

**Installation**

Clone the repository:

```bash
 git clone https://github.com/thinker-amir/pollify.git
```

Move to the project directory:

```bash
cd pollify
```

Setup your environment configuration

```bash
vi nestjs/.env
```

Run the project with Docker Compose

```bash
docker compose up -d
```

Install Node.js dependencies:

```bash
docker compose exec nestjs npm i
```

Create a bucket to store the cover images in AWS S3:

```bash
docker compose exec localstack awslocal s3api create-bucket --bucket pollify-poll-cover
```

**🎉 Congratulation! 🎉**  
The application should now be running at http://localhost:3000.

---

### 📖 Usage

To use Pollify, simply create an account, create a poll, and share the poll URL with your audience. As votes are cast, you can view real-time results and manage your polls as needed.

### 🧪 Testing

Pollify includes a suite of automated tests to ensure that the application is functioning correctly. To run the tests, follow these steps:

Attach to the NestJS container:

```bash
docker compose exec nestjs bash
```

Run the tests:

```bash
# run unit tests
npm run test -- --verbose

# run end to end tests
npm run test:e2e -- --verbose
```

The tests should run and display the results in the console.

### 📚 The Pollify API Swagger

The Pollify API Swagger is available at http://localhost:3000/api.

### 🤝 Contributing

We welcome contributions from other developers! To contribute to Pollify, follow these steps:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them.
- Push your changes to your fork.
- Submit a pull request.

Please make sure to follow our coding guidelines and standards.

### ❗ Issues

If you encounter any issues with Pollify, please report them on our GitHub Issues page. Please include as much detail as possible, including steps to reproduce the issue and any error messages you receive.

### 📧 Contact

If you have any questions or feedback about Pollify, please contact me at amir.fakour.dev@gmail.com.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
