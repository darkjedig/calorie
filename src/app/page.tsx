import { Metadata } from "next"
import { CalorieCalculator } from "@/components/calorie-calculator"
import { RelatedArticles } from "@/components/related-articles"

export const metadata: Metadata = {
  title: "Dog Calorie Calculator with Human-Equivalent Comparison",
  description: "Calculate how human food portions affect your dog's daily caloric intake, with a human-equivalent comparison.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-radial from-[#EEF7FD] via-white to-[#C1D8EE]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-[#34465b]">
              Dog Calorie Calculator with Human-Equivalent Comparison
            </h1>
            <p className="text-xl text-[#34465b]/80 max-w-3xl mx-auto mt-10">
              Human foods can be surprisingly calorie-dense for dogs. <br /> <br />Use this calculator to see how a portion of a human 
              food (e.g., pizza, cheese, chocolate) translates into your dog&apos;s daily calorie intake and what that would be in human terms. <br /> <br />
              This helps put "just a bite" into perspective. Choose your dog&apos;s breed, search for a human food, pick a portion 
              (bite, piece, slice, or whole item where available), and get a clear comparison.
            </p>
          </header>
          <div className="relative">
            <div className="absolute inset-0 bg-[#56EBFF]/10 rounded-[2rem] transform rotate-3"></div>
            <div className="relative bg-white rounded-[2rem] shadow-xl p-8">
              <CalorieCalculator />
            </div>
          </div>
          <RelatedArticles
            title="Related: what dogs can and can&apos;t eat"
            articles={[
              { title: "Can dogs eat nectarines?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-nectarines" },
              { title: "Can dogs eat courgette?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-courgette" },
              { title: "Can dogs eat radishes?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-radishes" },
              { title: "Can dogs eat cheese?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-cheese" },
              { title: "Can dogs eat lettuce?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-lettuce" },
              { title: "Can dogs eat parsnips?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-parsnips" },
              { title: "Can dogs eat ginger biscuits?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-ginger-biscuits" },
              { title: "Can dogs eat crisps?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-crisps" },
              { title: "Can dogs eat leeks?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-leeks" },
              { title: "Can dogs eat turnips?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-turnips" },
              { title: "Can dogs eat mangoes?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-mangoes" },
              { title: "Can dogs eat corned beef?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-corned-beef" },
              { title: "Can dogs eat Marmite?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-marmite" },
              { title: "Can dogs eat jelly?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-jelly" },
              { title: "Can dogs eat prawn crackers?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-prawn-crackers" },
              { title: "Can dogs eat Quorn?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-quorn" },
              { title: "Can dogs eat black pudding?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-black-pudding" },
              { title: "Can dogs eat Weetabix?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-weetabix-the-essential-guide" },
              { title: "Can dogs eat strawberries?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-strawberries" },
              { title: "Can dogs eat cucumbers?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-cucumbers" },
              { title: "Can dogs eat white chocolate?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-white-chocolate" },
              { title: "Can dogs eat celery?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-celery" },
              { title: "Can dogs eat tomatoes?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-tomatoes" },
              { title: "Can dogs eat mackerel?", href: "https://www.waggel.co.uk/blog/post/can-dogs-eat-mackerel" },
            ]}
          />

          <section aria-labelledby="how-we-calculate" className="mt-16">
            <div className="bg-white rounded-2xl border border-[#C1D8EE] shadow-sm p-6 md:p-8">
              <h2 id="how-we-calculate" className="text-2xl md:text-3xl font-semibold text-[#34465b] mb-4">
                How we calculate
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#34465b]">
                <li>Your dog&apos;s daily calories are estimated as average breed weight × 30.</li>
                <li>We calculate the treat calories from the selected food&apos;s calories per 100g and the portion size.</li>
                <li>We show the dog&apos;s % of daily intake for that treat.</li>
                <li>We translate that same % to a human-equivalent kcal using 2,200 kcal/day.</li>
                <li>We find a relatable human food example with about the same calories.</li>
              </ul>
            </div>
          </section>
        </div>
        </div>
      </main>
  )
}
