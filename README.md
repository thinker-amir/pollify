# Pollify

## Online Polling System


The Online Polling System is a web application that allows users to create, manage, and participate in polls. Users can create polls with customizable options, share them with others, and view real-time results. The application is built using NestJS, PostgreSQL, and TypeORM.

### Features  

* **User authentication**: Register and log in to create and manage polls.
* **Poll creation**: Create polls with customizable questions and options.
* **Poll sharing**: Share polls with others using unique URLs.
* **Real-time results**: View poll results in real-time as votes are cast.
* **Poll management**: Edit and delete polls you've created.
* **Poll participation**: Vote in polls created by others.

---


### Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

**Prerequisites**  

* Docker  
* Docker Compose plugin

### Installation   

1. Clone the repository:
```bash
 git clone https://github.com/thinker-amir/pollify.git
```  
2. Change to the project directory:  
```bash
cd pollify
```
3. Run the project with Docker Compose:
```bash
docker compose up -d
```
4. Attach to the NestJS container:
```bash
docker compose exec nestjs bash
```
5. Install Node.js dependencies:
```bash
npm i
```
Done! The application should now be running at http://localhost:3000.

---

### License  

This project is licensed under the MIT License - see the LICENSE file for details.