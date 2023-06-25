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

# License

```
Copyright 2023 Angelo Geulin

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```
