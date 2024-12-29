import Head from "next/head";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon</title>
        <meta
          name="description"
          content="We're working hard to launch our new site!"
        />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-pulse">
          Coming Soon
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          We're building something amazing! Stay tuned.
        </p>
        <button className="mt-8 px-6 py-3 text-white bg-black font-semibold rounded-lg shadow-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition">
          <Link href="/signup" className=" underline-offset-4">
            Notify Me
          </Link>
        </button>
      </div>
    </>
  );
}
