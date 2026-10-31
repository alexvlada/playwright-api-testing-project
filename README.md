# Playwright API Testing Project

A REST API test automation project built with Playwright and TypeScript, using the Simple Tool Rental API.

The project demonstrates API testing practices including HTTP methods, authentication, CRUD operations, response validation, and data integrity checks.

## Technologies Used

- **Playwright** – API test automation
- **TypeScript** – programming language
- **Node.js** – runtime environment
- **dotenv** – environment variable management
- **REST API** – HTTP request and response validation

## Project Structure

```text
playwright-api-testing-project/
├── tests/
│   └── api.spec.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```
## Test Coverage

The test suite covers the following scenarios:

- API server status validation
- Retrieving all tools
- Retrieving a single tool and validating its details
- Retrieving tool details with the user manual
- API client registration and authentication
- Creating an order and validating the order count
- Retrieving and validating order details
- Updating an order and verifying the changes
- Deleting an order and verifying its removal

### HTTP Methods

- **GET** – Retrieve resources
- **POST** – Register API clients and create orders
- **PATCH** – Update existing orders
- **DELETE** – Remove orders

## Installation

Clone the repository:

```bash
git clone https://github.com/alexvlada/playwright-api-testing-project.git
cd playwright-api-testing-project
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers (not required for API-only tests, but useful if the project is extended with UI tests):

```bash
npx playwright install
```

## Configuration

Create a `.env` file in the project root:

```env
API_BASE_URL=https://simple-tool-rental-api.click
```

The API base URL is loaded through environment variables using `dotenv`.

## Running Tests

Run the complete test suite:

## Running Tests

Run the complete API test suite:

```bash
npx playwright test

## API Under Test

This project uses the [Simple Tool Rental API](https://simple-tool-rental-api.click), a REST API designed for practicing API testing and automation.

The API supports tool catalog operations, client registration, authentication, and order management.

## Notes

- Tests are executed sequentially because they share authentication and order data.
- Each test run registers a new API client using a dynamically generated email address.
- The test suite creates, updates, validates, and deletes an order as part of the execution flow.

