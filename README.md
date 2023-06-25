# 🔎 Job Descriptions Search API

![Screenshot of the website for this project](https://i.imgur.com/nnMwiGY.png)

Stop thinking about job descriptions and get them here.

# Setup

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
