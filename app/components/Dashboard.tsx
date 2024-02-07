"use client";
import { useEffect, useState } from "react";
import { DashboardGetResponse } from "../api/user/dashboard/route";
import { StatisticGetResponse } from "../api/user/statistic/route";
import dayjs from "dayjs";

export default function Dashboard() {
  const [table, setTable] = useState<DashboardGetResponse>();
  const [statistic, setStatistic] = useState<StatisticGetResponse>();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [tableData, statisticData] = await Promise.all([
        fetch(`/api/user/dashboard`).then((res) => res.json()),
        fetch(`/api/user/statistic`).then((res) => res.json()),
      ]);

      setTable(tableData);
      setStatistic(statisticData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <h1 className="text-2xl text-center">Statistic</h1>
      {statistic && (
        <section className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
          <dl className="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">
                {statistic.totalUsers}
              </dt>
              <dd className="font-light text-gray-500 dark:text-gray-400">
                Total Users
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">
                {statistic.activeUsers}
              </dt>
              <dd className="font-light text-gray-500 dark:text-gray-400">
                Active Sessions
              </dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-3xl md:text-4xl font-extrabold">
                {statistic.averageActiveUsers?.toFixed(2)}
              </dt>
              <dd className="font-light text-gray-500 dark:text-gray-400">
                Average Active Sessions
              </dd>
            </div>
          </dl>
        </section>
      )}
      <br />
      <h1 className="text-2xl text-center">Dashboard</h1>
      {table && (
        <section className="p-3 sm:p-5 dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
            <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      signup date
                    </th>
                    <th scope="col" className="px-4 py-3">
                      logins
                    </th>
                    <th scope="col" className="px-4 py-3">
                      last login
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.length > 0 &&
                    table.map((row, index) => (
                      <tr className="border-b dark:border-gray-700" key={index}>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white"
                        >
                          {row.email}
                        </th>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">
                          {dayjs(row.signupDate).format("YYYY/MM/DD")}
                        </td>
                        <td className="px-4 py-3">{row.loginCount}</td>
                        <td className="px-4 py-3">
                          {dayjs(row.lastLogin).format("YYYY/MM/DD HH:mm:ss")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
