import { Activity, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Mock data for Daily Admissions
const admissionsData = [
  { day: "Mon", admissions: 45 },
  { day: "Tue", admissions: 52 },
  { day: "Wed", admissions: 38 },
  { day: "Thu", admissions: 65 },
  { day: "Fri", admissions: 48 },
  { day: "Sat", admissions: 35 },
  { day: "Sun", admissions: 25 },
];

// Mock data for Revenue Growth Trend
const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 68000 },
];

export default function AdminCharts() {
  return (
    <div className="mt-2 space-y-6">

      {/* Daily Admissions Chart */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-800">Number of turfs booked</h3>
            <p className="text-sm text-slate-500 mt-1">Activity logs for the last 7 days.</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100/50">
            <Activity className="w-5 h-5 text-teal-500" />
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={admissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
              />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Line
                type="natural"
                dataKey="admissions"
                stroke="#2DD4BF"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2DD4BF", stroke: "white", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2DD4BF", stroke: "white", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Growth Trend Chart */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-800">Revenue Growth Trend</h3>
            <p className="text-sm text-slate-500 mt-1">Monthly breakdown of system-wide turf revenue.</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100/50">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="transparent" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 13 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                ticks={[0, 20000, 40000, 60000, 80000]}
              />
              <RechartsTooltip
                cursor={{ fill: '#F3F4F6' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex flex-col gap-1">
                        <p className="text-gray-900 font-medium">{label}</p>
                        <p className="text-blue-500 font-medium text-sm">
                          total : {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="revenue"
                radius={[6, 6, 6, 6]}
                barSize={40}
              >
                {revenueData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#60A5FA" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
