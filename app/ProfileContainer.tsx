"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { UserGetResponse } from "./api/user/[id]/route";
import UpdateProfile from "./components/UpdateProfile";
import Dashboard from "./components/Dashboard";
import axios from "axios";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();
  useEffect(() => {
    getProfile();
  });

  const [profile, setProfile] = useState<UserGetResponse>();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) return <span>Not logged in</span>;

  function getProfile() {
    if (!user?.sub || profile) {
      return;
    }
    axios.get(`/api/user/${user?.sub}`).then((res) => {
      setProfile(res.data);
    });
  }

  function resendVerificationEmail() {
    axios
      .post(`/api/user/${user?.sub}`, { action: "resendVerificationEmail" })
      .then((res) => {
        alert(res.data.message);
      });
  }

  return (
    profile && (
      <>
        {profile.email_verified ? (
          <>
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-lg border border-gray-200 shadow dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col items-center py-5">
                  <img
                    className="mb-3 h-24 w-24 rounded-full shadow-lg"
                    src={profile.picture ?? ""}
                    alt={profile.name ?? "user picture"}
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {profile.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.email}
                  </span>
                </div>
                <UpdateProfile />
              </div>
            </div>
            <br /> <Dashboard />
          </>
        ) : (
          <div className="flex justify-center">
            Your email is not verified. Please verify your email.
            <button
              onClick={resendVerificationEmail}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Resend Email
            </button>
          </div>
        )}
      </>
    )
  );
}
