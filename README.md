# 🔎 Find Job Descriptions

![Screenshot of project home page](https://raw.githubusercontent.com/arvl130/job-descriptions/master/preview-1.png)

![Screenshot of project search page](https://raw.githubusercontent.com/arvl130/job-descriptions/master/preview-2.png)

Stop thinking about job descriptions and get them here. Try our [Online Search](https://jobdescriptions.ageulin.com) and [REST API](https://jobdescriptions.ageulin.com).

## Features

- Responsive frontend
- Online search
- REST API support

## Tech stack

- [React](https://react.dev) and [Next.js](https://nextjs.org) for frontend and backend
- [Tailwind CSS](tailwindcss.com) for styling
- [Next Auth](https://authjs.dev) for authentication
- [PostgreSQL](https://www.postgresql.org) for job description search
- [DynamoDB](https://aws.amazon.com/dynamodb) for API key management and validation

## Setup

This project uses the dataset provided by the O\*NET Resource Center for searching job descriptions.

You may obtain a copy of their dataset from [here](https://www.onetcenter.org/database.html). Import
it to your PostgreSQL database.

Clone this repository:

```sh
$ git clone https://github.com/arvl130/job-descriptions.git
$ cd job-descriptions
```

Pull down the project dependencies:

```sh
$ pnpm install
```

Create a `.env` file using the `.env.template`. Fill in the file with the appropriate credentials.

```sh
$ cp .env.template .env
$ vi .env # press :wq to quit!
```

Run the project:

```sh
$ pnpm dev
```

Build for production:

```sh
$ pnpm build
```
