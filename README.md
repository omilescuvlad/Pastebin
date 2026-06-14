# Pastebin API

A simple backend API built with NestJS, TypeScript, PostgreSQL and Docker.  
The project allows users to create, manage and download text pastes.

## Features

- User registration
- User authentication
- Create, read, update and delete pastes
- Download pastes as `.txt` files
- PostgreSQL database running with Docker

## Technologies

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Docker

## Installation and running with Docker

Clone the repository:

```bash
git clone https://github.com/omilescuvlad/Pastebin.git
cd Pastebin
```

```bash
docker compose up --build
```

The API will be available at:
```bash
http://localhost:3000
```

Stop the application
```bash
docker compose down
```

## Notes
The PostgreSQL database starts automatically through Docker Compose, so no manual database setup is required.