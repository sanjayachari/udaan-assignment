# Node.js Project

This repository contains a Node.js application, a runtime environment for executing JavaScript code server-side.

## Features
- **Lightweight and Efficient**
- **Asynchronous and Event-driven**
- **Built-in Modules for Networking and File Systems**
- **Extensive Package Ecosystem with npm**

---

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or above recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

Follow these steps to set up and run the project on your local machine:

1. Clone the repository:

    ```bash
    git clone https://github.com/sanjayachari/udaan-assignment.git
    cd backend
    ```

2. Install dependencies:

    Using npm:
    ```bash
    npm install
    ```

    Using yarn:
    ```bash
    yarn install
    ```

---

## Running the Project

To start the application:

Using npm:
```bash
npm start
```

Using yarn:
```bash
yarn start
```

By default, the application will run on `http://localhost:5000` unless otherwise specified.

---

## Scripts

- `start`: Starts the application.
- `dev`: Starts the application in development mode (if configured).
- `build`: Prepares the application for production (if applicable).
- `test`: Runs tests for the project (if applicable).

---

## Environment Variables

You can configure the application using environment variables. Create a `.env` file in the root directory and define the following variables as needed:

```env
PORT=5000
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
