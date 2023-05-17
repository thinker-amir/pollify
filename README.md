## Pollify

Pollify is an online polling system that allows users to create, manage, and participate in polls. With customizable options and real-time results, Pollify is a powerful tool for gathering feedback and opinions from your audience.  

### Features
**User authentication:** Register and log in to create and manage polls.  
**Poll creation:** Create polls with customizable questions and options.  
**Poll sharing:** Share polls with others using unique URLs.  
**Real-time results:** View poll results in real-time as votes are cast.  
**Poll management:** Edit and delete polls you've created.  
**Poll participation:** Vote in polls created by others.    

### Table of Contents
- Getting Started
- Usage
- Contributing
- Issues
- Contact
- License  

### Getting Started
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

Change to the project directory:
```bash
cd pollify
```

Run the project with Docker Compose:
```bash
docker compose up -d
```

Attach to the NestJS container:
```bash
docker compose exec nestjs bash
```

Create .env file
```bash
cp .env.example .env
```

Set up your environment in .env file
```bash
JWT_SECRET="PUT A COMPLEX STRING"
```

Install Node.js dependencies:
```bash
npm i
```

**Done!** The application should now be running at http://localhost:3000.  

### Usage
To use Pollify, simply create an account, create a poll, and share the poll URL with your audience. As votes are cast, you can view real-time results and manage your polls as needed.  

### Testing
Pollify includes a suite of automated tests to ensure that the application is functioning correctly. To run the tests, follow these steps:  

Attach to the NestJS container:
```bash
docker compose exec nestjs bash
```

Run the tests:
```bash
# run unit tests
npm run test

# run end to end tests
npm run test:e2e
```
The tests should run and display the results in the console.  


### The Pollify API Swagger  
The Pollify API Swagger is available at http://localhost:3000/api.  

### Contributing
We welcome contributions from other developers! To contribute to Pollify, follow these steps:  
- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them.
- Push your changes to your fork.
- Submit a pull request.  

Please make sure to follow our coding guidelines and standards.  

### Issues
If you encounter any issues with Pollify, please report them on our GitHub Issues page. Please include as much detail as possible, including steps to reproduce the issue and any error messages you receive.  

### Contact
If you have any questions or feedback about Pollify, please contact me at amir.fakour.dev@gmail.com.

## License
This project is licensed under the MIT License - see the LICENSE file for details.