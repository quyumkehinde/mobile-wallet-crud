## Project setup

1. Clone this repo.
2. Create a database to use for the project.
3. Create your .env file from .env.example by running ``cp .env.example .env``
4. Update your DB credentials in .env
5. Install packages using npm by running ``npm install``
6. Migrate your database by running ``npm run db:migrate``
7. Start your dev server by running ``npm run dev``
8. Run all tests by running ``npm run test``

NOTE: You should run all CLI commands from the project root.

## Routes

### Non-auth Routes

#### Registration

Endpoint - ``/api/v1/register``
Payload - **email**, **password**

#### Login

Endpoint - ``/api/v1/login``
Payload - **email**, **password**

### Auth Routes

You can access any of these routes by providing a bearer token as part of your request header.

#### Deposit fund

Endpoint - ``/api/v1/wallet/deposit``
Payload - **amount**

#### Withdraw fund

Endpoint - ``/api/v1/wallet/withdraw``
Payload - **amount**

#### Transfer fund

Endpoint - ``/api/v1/wallet/transfer``
Payload - **amount**, **recipient_id**
