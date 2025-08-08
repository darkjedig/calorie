import { Metadata } from "next"
import { CalorieCalculator } from "@/components/calorie-calculator"

export const metadata: Metadata = {
  title: "Dog-to-Human Calorie Calculator",
  description: "Calculate how human food portions affect your dog's daily caloric intake",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-radial from-[#EEF7FD] via-white to-[#C1D8EE]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-[#34465b]">
              Dog-to-Human Calorie Calculator
            </h1>
            <p className="text-xl text-[#34465b]/80 max-w-2xl mx-auto">
              Understand how human food portions impact your dog&#39;s daily caloric needs, and see what that would mean for you.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#56EBFF]/10 rounded-[2rem] transform rotate-3"></div>
            <div className="relative bg-white rounded-[2rem] shadow-xl p-8">
              <CalorieCalculator />
            </div>
          </div>
        </div>
        </div>
      </main>
  )
}
