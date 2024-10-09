import { useState, useEffect } from 'react';
import { Form, useActionData, useFetcher } from '@remix-run/react';
import { json, type ActionFunction } from '@remix-run/node';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ClientOnly } from 'remix-utils/client-only';
import OpenAI from 'openai';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ActionData {
  foodName?: string;
  dogCalories?: number;
  humanEquivalent?: number;
  explanation?: string;
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const foodName = form.get('foodName');
  
  if (typeof foodName !== 'string') {
    return json<ActionData>({ error: "Invalid input" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {role: "system", content: "You are a helpful assistant that calculates dog food calorie equivalents for humans. Provide the dog calories, human equivalent calories, and a brief explanation."},
        {role: "user", content: `Calculate the calorie equivalent for a dog eating ${foodName}. Please format your response as follows:
        Dog Calories: [number]
        Human Equivalent Calories: [number]
        Explanation: [brief explanation]`}
      ],
    });

    console.log('OpenAI API Response:', JSON.stringify(response, null, 2));

    const result = response.choices[0].message?.content;
    if (!result) {
      throw new Error("No response content from OpenAI");
    }

    console.log('OpenAI Response Content:', result);

    // More flexible parsing
    const dogCaloriesMatch = result.match(/Dog Calories:\s*(\d+)/i);
    const humanEquivalentMatch = result.match(/Human Equivalent Calories:\s*(\d+)/i);
    const explanationMatch = result.match(/Explanation:\s*(.+?)(?=\n|$)/s);

    if (!dogCaloriesMatch || !humanEquivalentMatch) {
      console.error('Failed to parse OpenAI response:', result);
      throw new Error("Unable to extract calorie information from OpenAI response");
    }

    return json<ActionData>({
      foodName,
      dogCalories: parseInt(dogCaloriesMatch[1]),
      humanEquivalent: parseInt(humanEquivalentMatch[1]),
      explanation: explanationMatch ? explanationMatch[1].trim() : "No explanation provided.",
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return json<ActionData>({ error: error instanceof Error ? error.message : "Failed to calculate calorie equivalent" });
  }
};

export default function Index() {
  const [foodName, setFoodName] = useState('');
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher<ActionData>();

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Dog vs Human Calorie Comparison',
        color: 'white',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error state
    fetcher.submit({ foodName }, { method: 'post' });
  };

  // Update chart data when fetcher data changes
  useEffect(() => {
    console.log('Fetcher state:', fetcher.state);
    console.log('Fetcher data:', fetcher.data);
    if (fetcher.data && !('error' in fetcher.data) && fetcher.data.dogCalories && fetcher.data.humanEquivalent) {
      setChartData({
        labels: ['Dog Calories', 'Human Equivalent'],
        datasets: [
          {
            label: 'Calories',
            data: [fetcher.data.dogCalories, fetcher.data.humanEquivalent],
            backgroundColor: ['rgba(86, 235, 255, 0.5)', 'rgba(254, 224, 64, 0.5)'],
            borderColor: ['rgba(86, 235, 255, 1)', 'rgba(254, 224, 64, 1)'],
            borderWidth: 1,
          },
        ],
      });
      setError(null); // Clear any previous errors
    } else if (fetcher.data && 'error' in fetcher.data) {
      setError(fetcher.data.error || 'An unknown error occurred');
      setChartData(null); // Clear chart data if there's an error
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ease-in-out transform hover:scale-105">
        <h1 className="text-4xl font-bold mb-4 text-center text-waggel-blue">Pet Food Calorie Calculator</h1>
        <p className="text-white text-center mb-8">Easily compare the caloric impact of human food on your dog's diet. Simply enter a food item to see the equivalent calories for humans.</p>
        <fetcher.Form method="post" className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter a food..."
              className="w-full p-4 border-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-waggel-blue focus:border-transparent transition-all duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            disabled={fetcher.state === 'submitting'}
            className="w-full bg-waggel-blue text-gray-900 p-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetcher.state === 'submitting' ? 'Calculating...' : 'Calculate'}
          </button>
        </fetcher.Form>
        {error && (
          <p className="mt-6 text-center text-red-500 bg-red-100 border border-red-400 rounded-lg p-3 animate-pulse">{error}</p>
        )}
        {fetcher.data && !('error' in fetcher.data) && fetcher.data.foodName && (
          <div className="mt-8 bg-gray-700 rounded-lg p-6 shadow-inner transition-all duration-300 ease-in-out">
            <h2 className="text-center font-bold text-white mb-4 text-xl">
              Calorie comparison for {fetcher.data.foodName}:
            </h2>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-waggel-blue font-bold">Dog Calories</p>
                <p className="text-white text-2xl">{fetcher.data.dogCalories}</p>
              </div>
              <div className="text-center">
                <p className="text-waggel-blue font-bold">Human Equivalent</p>
                <p className="text-white text-2xl">{fetcher.data.humanEquivalent}</p>
              </div>
            </div>
            {fetcher.data.explanation && (
              <p className="text-center text-white mb-6">
                {fetcher.data.explanation}
              </p>
            )}
            <ClientOnly fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-waggel-blue"></div></div>}>
              {() => chartData && (
                <div className="mt-6 bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" style={{height: '300px'}}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
            </ClientOnly>
          </div>
        )}
      </div>
    </div>
  );
}