import { SideNav } from "@/components/sidenav"
import Head from "next/head"
import Link from "next/link"

export default function GettingStarted() {
  return (
    <>
      <Head>
        <title>Getting Started &#x2013; Find Job Descriptions</title>
        <meta
          name="description"
          content="Stop thinking about job descriptions and get them here."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-6xl mx-auto w-full grid grid-cols-[16rem_auto]">
        <SideNav />
        <main className="text-zinc-700 py-12 px-6 max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            <Link href="/" className="font-semibold hover:underline">
              Job Descriptions
            </Link>{" "}
            is a web service that allows users to search for job descriptions by
            simply entering a job title.
          </p>
          <p className="mb-4">
            You may use this service either through the online search provided
            in this website, or by integrating with our REST API.
          </p>
          <p className="mb-2">
            To start using this service, you will need an API key.
          </p>
          <ol className="pl-10 list-decimal">
            <li className="mb-4">
              Go to the{" "}
              <Link href="/api-keys" className="font-medium hover:underline">
                API Keys
              </Link>{" "}
              page and click the{" "}
              <span className="px-4 py-2 rounded-md bg-zinc-700 text-white font-medium">
                Generate new key
              </span>{" "}
              button.
            </li>
            <li className="mb-4">
              Enter a name to describe your new key. Then, click on{" "}
              <span className="px-4 py-2 rounded-md bg-zinc-700 text-white font-medium">
                Generate
              </span>
              .
            </li>
            <li className="mb-4">
              An Access Key ID and Access Key Secret will be generated for your
              new API Key. Copy these credentials and make sure to store them in
              a safe location.
            </li>
            <li>
              Go to the{" "}
              <Link href="/search" className="font-medium hover:underline">
                Online Search
              </Link>{" "}
              page to test your new API key.
            </li>
          </ol>
        </main>
      </div>
    </>
  )
}
