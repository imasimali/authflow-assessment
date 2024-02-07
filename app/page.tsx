"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProfileClient from "./ProfileContainer";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="text-center">Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (!user)
    return (
      <div className="flex justify-center">
        <a href="/api/auth/login">
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Login
          </button>
        </a>
      </div>
    );
  return (
    <>
      <div className="flex justify-center">
        <a href="/api/auth/logout">
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Logout
          </button>
        </a>
      </div>
      <br />
      <ProfileClient />
    </>
  );
}
