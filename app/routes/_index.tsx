import { useState, useEffect } from 'react';
import { Form, useActionData, useSubmit, useLoaderData, useFetcher } from '@remix-run/react';
import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ClientOnly } from 'remix-utils/client-only';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FoodData {
  FoodCategory: string;
  FoodItem: string;
  per100grams: string;
  Cals_per100grams: string;
  KJ_per100grams: string;
}

interface LoaderData {
  foodData: FoodData[];
}

interface ActionData {
  foodName?: string;
  portions?: {
    [key: string]: {
      calories: number;
      dogIntakePercentage: number;
      humanEquivalent: number;
      humanIntakePercentage: number;
    }
  };
  error?: string;
}

function findMatchingFood(foodData: FoodData[], searchTerm: string): FoodData | undefined {
  if (!foodData || foodData.length === 0) return undefined;
  
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  const words = lowerSearchTerm.split(' ');

  // First, try to find an exact match
  const exactMatch = foodData.find(item => 
    item.FoodItem.toLowerCase() === lowerSearchTerm
  );
  if (exactMatch) return exactMatch;

  // If no exact match, look for items containing all search terms
  return foodData.find(item => {
    const lowerFoodItem = item.FoodItem.toLowerCase();
    return words.every(word => lowerFoodItem.includes(word)) &&
           !lowerFoodItem.includes('brand') &&
           !lowerFoodItem.includes('restaurant');
  });
}

export const loader: LoaderFunction = async () => {
  try {
    const filePath = path.join(process.cwd(), 'calories.csv');
    console.log('Attempting to read file:', filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log('File content length:', fileContent.length);
    const foodData = parse(fileContent, { columns: true, skip_empty_lines: true }) as FoodData[];
    console.log('Parsed food data length:', foodData.length);
    return json<LoaderData>({ foodData });
  } catch (error) {
    console.error('Error in loader function:', error);
    return json<LoaderData>({ foodData: [] });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const foodName = form.get('foodName');
  const foodDataJson = form.get('foodData');
  
  if (typeof foodName !== 'string' || typeof foodDataJson !== 'string') {
    return json<ActionData>({ error: "Invalid input" });
  }

  let foodData;
  try {
    foodData = JSON.parse(foodDataJson) as FoodData[];
  } catch (error) {
    return json<ActionData>({ error: "Invalid food data" });
  }

  const food = findMatchingFood(foodData, foodName);
  
  if (food) {
    const caloriesPer100g = parseFloat(food.Cals_per100grams);
    const portions = {
      bite: 5,
      piece: 30,
      slice: 50
    };

    const results: ActionData['portions'] = {};

    for (const [portionName, grams] of Object.entries(portions)) {
      const calories = (caloriesPer100g / 100) * grams;
      const dogIntakePercentage = (calories / 400) * 100;
      const humanEquivalent = (dogIntakePercentage / 100) * 2200;
      const humanIntakePercentage = (humanEquivalent / 2200) * 100;

      results[portionName] = {
        calories,
        dogIntakePercentage,
        humanEquivalent,
        humanIntakePercentage
      };
    }

    return json<ActionData>({ 
      foodName: food.FoodItem,
      portions: results
    });
  }

  return json<ActionData>({ error: "Food not found" });
};

export default function Index() {
  const { foodData } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const fetcher = useFetcher<ActionData>();

  useEffect(() => {
    console.log('Food data loaded:', foodData.length);
  }, [foodData]);

  useEffect(() => {
    console.log('Action data updated:', actionData);
    if (actionData && 'error' in actionData) {
      setError(actionData.error || null);
    } else if (actionData && !('error' in actionData) && actionData.portions) {
      setError(null);
      const portionData = Object.values(actionData.portions)[0]; // Use the first portion for the chart
      setChartData({
        labels: ['Dog Calories', 'Human Equivalent'],
        datasets: [
          {
            label: 'Calories',
            data: [portionData.calories, portionData.humanEquivalent],
            backgroundColor: ['rgba(86, 235, 255, 0.5)', 'rgba(254, 224, 64, 0.5)'],
            borderColor: ['rgba(86, 235, 255, 1)', 'rgba(254, 224, 64, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [actionData]);

  useEffect(() => {
    setError(null);
  }, [foodName]);

  useEffect(() => {
    console.log('Fetcher state:', fetcher.state);
    console.log('Fetcher data:', fetcher.data);
    if (fetcher.data && 'error' in fetcher.data) {
      setError(fetcher.data.error || null);
    } else if (fetcher.data && !('error' in fetcher.data) && fetcher.data.portions) {
      setError(null);
      const portionData = Object.values(fetcher.data.portions)[0]; // Use the first portion for the chart
      setChartData({
        labels: ['Dog Calories', 'Human Equivalent'],
        datasets: [
          {
            label: 'Calories',
            data: [portionData.calories, portionData.humanEquivalent],
            backgroundColor: ['rgba(86, 235, 255, 0.5)', 'rgba(254, 224, 64, 0.5)'],
            borderColor: ['rgba(86, 235, 255, 1)', 'rgba(254, 224, 64, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [fetcher]);

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
    const formData = new FormData(event.currentTarget);
    formData.append('foodData', JSON.stringify(foodData));
    fetcher.submit(formData, { method: 'post' });
  };

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
              placeholder="Search for a food..."
              className="w-full p-4 border-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-waggel-blue focus:border-transparent transition-all duration-300 ease-in-out"
            />
            <svg className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
        {fetcher.data && !('error' in fetcher.data) && fetcher.data.foodName && fetcher.data.portions && (
          <div className="mt-8 bg-gray-700 rounded-lg p-6 shadow-inner transition-all duration-300 ease-in-out">
            <h2 className="text-center font-bold text-white mb-4 text-xl">
              Calorie comparison for {fetcher.data.foodName}:
            </h2>
            {Object.entries(fetcher.data.portions).map(([portionName, data]) => (
              <div key={portionName} className="mb-6 border-b border-gray-600 pb-4">
                <h3 className="text-center font-bold text-waggel-blue mb-2 text-lg capitalize">
                  {portionName}
                </h3>
                <p className="text-center text-white">
                  <span className="font-semibold">Dog:</span> {Math.round(data.calories)} calories
                  <br />
                  ({data.dogIntakePercentage.toFixed(2)}% of daily intake)
                </p>
                <p className="text-center text-white mt-2">
                  <span className="font-semibold">Human equivalent:</span> {Math.round(data.humanEquivalent)} calories
                  <br />
                  ({data.humanIntakePercentage.toFixed(2)}% of daily intake)
                </p>
              </div>
            ))}
            <ClientOnly fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-waggel-blue"></div></div>}>
              {() => chartData && (
                <div className="mt-6 bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" style={{height: '300px'}}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
            </ClientOnly>
            <div className="mt-6 text-white text-sm">
              <p className="mb-2">This calculation is based on the average daily calorie intake for dogs (400 calories) and humans (2200 calories). The tool provides a rough estimate to help you understand the impact of human food on your dog's diet.</p>
              <p className="mb-2">Remember, many human foods can be harmful or even toxic to dogs. Always consult with your veterinarian before introducing new foods to your pet's diet.</p>
              <p>This tool is for educational purposes only and should not replace professional veterinary advice.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}