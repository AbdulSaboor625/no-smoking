
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CircularProgressBar } from "./circle-progress";

const StatisticsCard = () => {
  const chartData = [
    { name: "1-10 Nov", value: 30, fill: "#5C2783" },
    { name: "11-15 Nov", value: 45, fill: "#F5B600" },
    { name: "16-20 Nov", value: 30, fill: "#5C2783" },
    { name: "21-25 Nov", value: 60, fill: "#F5B600" },
    { name: "26-30 Nov", value: 30, fill: "#5C2783" },
  ]

  const mentors = [
    { id: 1, name: "Matt Doe" },
    { id: 2, name: "Matt Doe" },
  ]

  return (
    <div className="w-full">

      <Card className="p-6 2xl:p-8 bg-white rounded-2xl shadow-sm border border-[#f0f0f0]">
      <h1 className="2xl:text-xl md:text-lg text-base font-semibold text-[#000000]">Statistic</h1>
        <div className="flex flex-col items-center space-y-6 relative pt-0">
          {/* Avatar progress circle */}
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            <Avatar className="w-[120px] h-[120px] bg-[#AE89C7] border-none shadow-none p-4">
              <AvatarImage src="/assets/images/avatar.svg" alt="John" />
              <AvatarFallback className="bg-[#612F8D] text-white text-2xl">J</AvatarFallback>
            </Avatar>
            <div className="absolute top-6 right-6 z-50 bg-[#F5B600] text-[#131316] rounded-full px-2 py-1 text-sm font-bold shadow">
              30%
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <CircularProgressBar
                percentage={30}
                size={150}
                strokeWidth={4}
                backgroundColor="#561F7A  "
                progressColor="#F9C015"
              />
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center !m-0">
            <h2 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-[#000] mb-2">Good Morning John</h2>
            <p className="text-xs xl:text-sm font-[400] text-[#000]">Continue achieving your target!</p>
          </div>

          {/* Bar chart */}
          <div className="w-full bg-[#F2F2F2] border-none 2xl:rounded-[40px] xl:rounded-[30px] rounded-[20px] p-0 pt-4">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                barCategoryGap="28%"
                barGap={8}
              >
                <CartesianGrid horizontal stroke="#9E9E9E" strokeOpacity={0.35} vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9E9E9E"
                  tick={{ fontSize: 12, fill: "#131316" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9E9E9E"
                  tick={{ fontSize: 12, fill: "#131316" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 70]}
                  ticks={[0, 20, 40, 60]}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px" }}
                  labelStyle={{ color: "#131316", fontWeight: 600 }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={52} isAnimationActive={false}>
                  {chartData.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} radius={[10, 10, 0, 0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-8">
        <h3 className="2xl:text-[24px] xl:text-[20px] text-base font-semibold text-[#000000] xl:mb-4 mb-2">Your mentor</h3>
        <div className="bg-[#F2F2F2] 2xl:rounded-[40px] xl:rounded-[30px] rounded-[20px] p-2">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="flex items-center justify-between flex-col 2xl:flex-row px-3 py-3 rounded-xl gap-2 2xl:gap-0">
              <div className="flex items-center gap-3 w-full 2xl:w-auto mb-2 2xl:mb-0">
                <Avatar className="w-[50px] h-[50px] 2xl:w-[63px] 2xl:h-[63px] border-2 border-[#561F7A] bg-[#AE89C7] rounded-full flex justify-center items-center">
                  <AvatarImage src="/assets/images/avatar.svg" alt={mentor.name} className="w-[36px] h-[44px]" />
                  <AvatarFallback className="bg-[#612F8D] text-white font-semibold">{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="2xl:text-xl text-base font-semibold text-[#612F8D]">{mentor.name}</span>
              </div>
                <div className="w-full 2xl:w-auto flex justify-end 2xl:justify-start">
                <Button
                  variant="outline"
                  className="w-full xl:w-auto rounded-full px-4 sm:px-5 py-2 border-[#612F8D] text-[#612F8D] hover:text-[#612F8D] hover:bg-[#612F8D]/5 text-sm font-semibold flex items-center gap-2"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.2539 14.7501V12.8123C14.0347 11.4185 15.2539 9.75 15.2539 6.16681C15.2539 3.84719 14.8308 1.75 12.2924 1.75C12.2924 1.75 11.3972 0.75 9.24621 0.75C6.20865 0.75 4.25391 2.57696 4.25391 6.16681C4.25391 9.75 5.47307 11.4186 7.25391 12.8123V14.7501L3.53792 15.8679C2.1505 16.2924 1.11984 17.4054 0.777658 18.7601C0.642358 19.2957 1.10498 19.7501 1.6603 19.7501H11.8475" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.2539 20.75V13.75M13.7539 17.25H20.7539" stroke="#561F7A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </Card>

      {/* Mentor section */}
      {/* <Card className="p-6 sm:p-7 bg-white rounded-2xl shadow-sm border border-[#f0f0f0]">
        <h3 className="text-xl font-bold text-[#131316] mb-4">Your mentor</h3>
        <div className="space-y-3">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="flex items-center justify-between px-3 py-3 rounded-xl border border-[#E9E9EB] bg-[#F9FAFB]">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 bg-[#E5D8F3] border border-[#612F8D]/20">
                  <AvatarImage src="/assets/images/avatar.svg" alt={mentor.name} />
                  <AvatarFallback className="bg-[#612F8D] text-white font-semibold">{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold text-[#612F8D]">{mentor.name}</span>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-4 sm:px-5 py-2 border-[#612F8D] text-[#612F8D] hover:bg-[#612F8D]/5 text-sm font-semibold flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">+</span>
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  )
}

export default StatisticsCard
