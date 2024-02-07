"use client";

import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export default function UpdateProfile() {
  const { user } = useUser();
  const [name, setName] = useState<String>("");

  async function updateName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await axios.patch(`/api/user/${user?.sub}`, { name });
    if (res.status === 200) {
      alert(res.data.message);
      window.location.reload();
    }
  }

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-4 text-2xl text-center font-light tracking-tight text-gray-900 dark:text-white">
        Update name
      </h5>
      <form onSubmit={updateName}>
        <div className="flex gap-1">
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your new name"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
