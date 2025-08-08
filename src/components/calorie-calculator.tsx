'use client'

import { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Updated Interface for calories.csv
interface FoodData {
  FoodCategory: string
  FoodItem: string
  per100grams: string
  Cals_per100grams: string
  KJ_per100grams: string
  Average_Whole_Item_Weight_g: string
  DogWarning: string
}

interface BreedData {
  name: string
  min_weight: number
  max_weight: number
  avg_weight: number
}

// Chart removed

// Type for human food references
interface Ref {
  name: string;
  servings: number;
}

const PORTION_SIZES = {
  bite: 5,
  piece: 15,
  slice: 30,
  'whole_item': -1, // Special value to use the food's actual whole item weight
  '100g Portion': 100,
}

const HUMAN_DAILY_CALORIES = 2200
const CALORIES_PER_POUND_PER_DAY = 30

// Chart removed

export function CalorieCalculator() {
  const [foodName, setFoodName] = useState('')
  const [portionSize, setPortionSize] = useState<keyof typeof PORTION_SIZES>('bite')
  const [selectedBreed, setSelectedBreed] = useState<BreedData | null>(null)
  const [foodData, setFoodData] = useState<FoodData[]>([])
  const [breedData, setBreedData] = useState<BreedData[]>([])
  const [selectedFood, setSelectedFood] = useState<FoodData | null>(null)
  // Chart removed
  const [suggestions, setSuggestions] = useState<FoodData[]>([])
  const [humanRefs, setHumanRefs] = useState<Ref[]>([]); 
  const [showResults, setShowResults] = useState(false); // New state to control when results show
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define handleSubmit before effects that may depend on it
  const handleSubmit = useCallback((revealResults: boolean = true) => {
    if (selectedFood && selectedBreed && foodData.length > 0) {
      let portionGrams = PORTION_SIZES[portionSize];
      if (portionGrams === -1) {
        const wholeItemWeight = Number(selectedFood.Average_Whole_Item_Weight_g);
        portionGrams = wholeItemWeight > 0 ? wholeItemWeight : 100;
      }
      const caloriesForDog = (Number(selectedFood.Cals_per100grams) / 100) * portionGrams;
      const breedDailyCalories = selectedBreed.avg_weight * CALORIES_PER_POUND_PER_DAY;
      const dogPercentageImpact = (caloriesForDog / breedDailyCalories) * 100;
      const humanEquivalentKcal = (dogPercentageImpact / 100) * HUMAN_DAILY_CALORIES;


      // Create relatable refs using humanEquivalentKcal (existing logic below remains)
      const createRelatableFoodRefs = (targetCalories: number) => {
        const commonFoods = [
          { name: 'Pizza Slice', calories: 285 },
          { name: 'Cheeseburger', calories: 540 },
          { name: 'Hamburger', calories: 250 },
          { name: 'Hot Dog', calories: 150 },
          { name: 'Chicken Breast', calories: 165 },
          { name: 'Fish and Chips', calories: 585 },
          { name: 'Sandwich', calories: 320 },
          { name: 'Bacon', calories: 43 },
          { name: 'Sausage', calories: 300 },
          { name: 'French Fries', calories: 365 },
          { name: 'Apple', calories: 95 },
          { name: 'Banana', calories: 105 },
          { name: 'Orange', calories: 62 },
          { name: 'Egg', calories: 70 },
          { name: 'Slice of Bread', calories: 80 },
          { name: 'Slice of Toast', calories: 80 },
          { name: 'Bowl of Rice', calories: 200 },
          { name: 'Bowl of Pasta', calories: 200 },
          { name: 'Glass of Milk', calories: 150 },
          { name: 'Yogurt', calories: 150 },
          { name: 'Ice Cream Scoop', calories: 250 },
          { name: 'Chocolate Bar', calories: 240 },
          { name: 'Cookie', calories: 50 },
          { name: 'Biscuit', calories: 50 },
          { name: 'Can of Soda', calories: 150 },
          { name: 'Beer', calories: 150 },
          { name: 'Glass of Wine', calories: 125 },
          { name: 'Bag of Popcorn', calories: 30 },
          { name: 'Bag of Chips', calories: 150 },
          { name: 'Mashed Potatoes', calories: 237 },
          { name: 'Bowl of Cereal', calories: 120 },
          { name: 'Bowl of Oatmeal', calories: 150 },
          { name: 'Cheese', calories: 113 },
          { name: 'Crackers', calories: 80 },
          { name: 'Nuts', calories: 160 },
          { name: 'Granola Bar', calories: 150 },
          { name: 'Peanut Butter Sandwich', calories: 350 },
          { name: 'Donut', calories: 250 },
          { name: 'Muffin', calories: 360 },
          { name: 'Pancake', calories: 175 },
          { name: 'Waffle', calories: 220 },
          { name: 'Slice of Cake', calories: 235 },
          { name: 'Slice of Pie', calories: 320 },
          { name: 'Bagel', calories: 250 },
          { name: 'Croissant', calories: 230 },
          { name: 'Danish Pastry', calories: 330 },
          { name: 'Energy Bar', calories: 200 },
          { name: 'Protein Bar', calories: 190 },
          { name: 'Candy Bar', calories: 240 },
          { name: 'Ice Cream Bar', calories: 160 },
          { name: 'Milkshake', calories: 530 },
          { name: 'Smoothie', calories: 180 },
          { name: 'Latte', calories: 190 },
          { name: 'Cappuccino', calories: 120 },
          { name: 'Meatball', calories: 50 },
          { name: 'Chicken Wing', calories: 100 },
          { name: 'Chicken Nugget', calories: 50 },
          { name: 'Onion Ring', calories: 40 },
          { name: 'Garlic Bread', calories: 150 },
          { name: 'Breadstick', calories: 120 },
          { name: 'Pretzel', calories: 380 }
        ];

        // Use all foods as they're now realistic
        const relatableFoods = commonFoods;
        
        // Prioritize the most relatable foods first
        const priorityFoods = [
          'Pizza Slice', 'Cheeseburger', 'Hamburger', 'Hot Dog', 'Sandwich', 'Apple', 'Banana', 'Orange', 
          'Egg', 'Slice of Bread', 'Chocolate Bar', 'Cookie', 'Can of Soda', 
          'Beer', 'Glass of Wine', 'Ice Cream Scoop', 'French Fries',
          'Bag of Popcorn', 'Bag of Chips', 'Chicken Wing', 'Chicken Nugget'
        ];
        
        // Sort foods by priority first, then by how close to target calories
        const sortedFoods = relatableFoods.sort((a, b) => {
          const aPriority = priorityFoods.includes(a.name) ? 0 : 1;
          const bPriority = priorityFoods.includes(b.name) ? 0 : 1;
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          const aDiff = Math.abs(targetCalories - a.calories);
          const bDiff = Math.abs(targetCalories - b.calories);
          return aDiff - bDiff;
        });

        const refs: Ref[] = [];
        
        for (const food of sortedFoods) {
          const servings = targetCalories / food.calories;
          
          // Only include if it's a reasonable portion (0.1 to 5 servings)
          if (servings >= 0.1 && servings <= 5) {
            let displayText = '';
            
            if (servings < 0.25) {
              displayText = `a tiny bit of ${food.name}`;
            } else if (servings < 0.5) {
              displayText = `a quarter of a ${food.name}`;
            } else if (servings < 0.75) {
              displayText = `half a ${food.name}`;
            } else if (servings < 1.25) {
              displayText = `1 ${food.name}`;
            } else if (servings < 2) {
              const roundedServings = Math.round(servings * 2) / 2;
              const plural = roundedServings !== 1 && !food.name.endsWith('s') ? 's' : '';
              displayText = `${roundedServings} ${food.name}${plural}`;
            } else {
              const roundedServings = Math.round(servings);
              const plural = !food.name.endsWith('s') ? 's' : '';
              displayText = `${roundedServings} ${food.name}${plural}`;
            }
            
            refs.push({
              name: displayText,
              servings: servings
            });
          }
        }
        
        // Sort by how close to 1 serving (most relatable)
        refs.sort((a, b) => Math.abs(a.servings - 1) - Math.abs(b.servings - 1));
        
        return refs.slice(0, 3); // Return top 3 most relatable
      };

      const calculatedHumanRefs = createRelatableFoodRefs(humanEquivalentKcal);
      
      console.log('Target calories:', humanEquivalentKcal);
      console.log('Final human refs:', calculatedHumanRefs);
      setHumanRefs(calculatedHumanRefs);
      
      // No fallback needed - the createRelatableFoodRefs function should always return results
      
      if (revealResults) setShowResults(true);
    }
  }, [selectedFood, selectedBreed, portionSize, foodData]);

  // Effect for closing suggestions on outside click (remains the same)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsContainerRef.current &&
        !suggestionsContainerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionsContainerRef, inputRef]);

  // Fetch breeds data
  useEffect(() => {
    fetch('/data/breeds.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.trim().split('\n').slice(1); // Skip header
        const data = rows
          .map((row) => {
            const parts = row.split(',');
            if (parts.length < 3) return null; // Need at least 3 columns: name, min_weight, max_weight
            
            const name = parts[0]?.trim(); // Breed name is in first column
            const minWeightStr = parts[1]?.trim(); // min_weight column (second column)
            const maxWeightStr = parts[2]?.trim(); // max_weight column (third column)
            
            if (!name || !minWeightStr || !maxWeightStr) return null;
            
            const minWeight = parseFloat(minWeightStr);
            const maxWeight = parseFloat(maxWeightStr);
            
            if (isNaN(minWeight) || isNaN(maxWeight) || minWeight <= 0 || maxWeight <= 0) return null;
            
            return {
              name: name,
              min_weight: minWeight,
              max_weight: maxWeight,
              avg_weight: (minWeight + maxWeight) / 2
            };
          })
          .filter((item): item is BreedData => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        
        console.log("Parsed breed data count:", data.length);
        setBreedData(data);
      })
      .catch(error => console.error("Error fetching or parsing breeds.csv:", error));
  }, []);

  // Updated CSV Fetching Effect for calories.csv
  useEffect(() => {
    fetch('/data/calories.csv')
      .then((response) => response.text())
      .then((text) => {
        const rows = text.trim().split('\n').slice(1).filter(row => row.trim() !== ''); // Skip header
        
        const data = rows
          .map((row) => {
            const parts = row.split(',');
            
            if (parts.length < 5) {
              console.warn('Skipping malformed CSV row (not enough columns):', row);
              return null;
            }
            
            const foodCategory = parts[0]?.trim();
            const foodItem = parts[1]?.trim();
            const per100grams = parts[2]?.trim();
            const caloriesStr = parts[3]?.trim();
            const kjStr = parts[4]?.trim();
            const wholeItemWeightStr = parts[5]?.trim();
            const warningStr = parts[6]?.trim() || '';

            if (!foodItem || !caloriesStr) {
              console.warn('Skipping row due to missing food item or calories:', row);
              return null;
            }

            // Extract numeric value from calories string (e.g., "62 cal" -> "62" or just "62")
            let calories = caloriesStr;
            
            // Check if it's in "62 cal" format
            const caloriesMatch = caloriesStr.match(/(\d+)\s*cal/);
            if (caloriesMatch) {
              calories = caloriesMatch[1];
            } else {
              // If no "cal" suffix, assume it's just the number
              calories = caloriesStr;
            }
            
            if (isNaN(Number(calories))) {
              console.warn('Skipping row due to invalid calorie number:', row);
              return null;
            }

            return {
              FoodCategory: foodCategory,
              FoodItem: foodItem,
              per100grams: per100grams,
              Cals_per100grams: calories,
              KJ_per100grams: kjStr,
              Average_Whole_Item_Weight_g: wholeItemWeightStr || '',
              DogWarning: warningStr || '',
            };
          })
          .filter((item): item is FoodData => item !== null);
        
        console.log("Parsed food data count:", data.length);
        console.log("Sample foods:", data.slice(0, 10).map(f => f.FoodItem));
        
        // Debug: Check for foods with whole item weights
        const foodsWithWeights = data.filter(f => f && f.Average_Whole_Item_Weight_g && Number(f.Average_Whole_Item_Weight_g) > 0);
        console.log("Foods with whole item weights:", foodsWithWeights.length);
        console.log("Sample foods with weights:", foodsWithWeights.slice(0, 5).map(f => `${f.FoodItem} (${f.Average_Whole_Item_Weight_g}g)`));
        
        setFoodData(data);
      })
      .catch(error => console.error("Error fetching or parsing calories.csv:", error));
  }, [])

  // Updated Suggestions Filtering Effect - no auto-selection
  useEffect(() => {
    if (foodName.length > 1 && foodData.length > 0) { 
      const lowercasedFoodName = foodName.toLowerCase();
      const matches = foodData
        .filter((food) =>
          food.FoodItem && 
          food.FoodItem.toLowerCase().includes(lowercasedFoodName)
        )
        .sort((a, b) => { 
          if (a.FoodItem < b.FoodItem) return -1;
          if (a.FoodItem > b.FoodItem) return 1;
          return 0;
        });
      
      console.log(`Found ${matches.length} matches for "${foodName}":`, matches.map(m => m.FoodItem));
      setSuggestions(matches);
      
      // Clear selection if no matches or multiple matches (user must choose)
      if (matches.length === 0) {
        setSelectedFood(null);
      }
    } else {
      setSuggestions([]);
      if (foodName.length === 0) {
        setSelectedFood(null);
      }
    }
  }, [foodName, foodData])

  // Recalculate results when portion size changes
  useEffect(() => {
    if (showResults && selectedFood && selectedBreed) {
      handleSubmit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portionSize])

  // Calculate humanPercentageOfDailyIntake for the text display
  let humanPercentageOfDailyIntakeText = "0.0%";
  let breedDailyCalories = 0;
  let currentPortionGrams = 0;
  if (selectedFood && selectedBreed && showResults) {
    let portionGrams = PORTION_SIZES[portionSize];
    
    // If whole_item is selected, use the food's actual whole item weight
    if (portionGrams === -1) {
      const wholeItemWeight = Number(selectedFood.Average_Whole_Item_Weight_g);
      if (wholeItemWeight > 0) {
        portionGrams = wholeItemWeight;
      } else {
        // Fallback to 100g if no whole item weight is available
        portionGrams = 100;
      }
    }
    
    currentPortionGrams = portionGrams;
    const caloriesForDog = (Number(selectedFood.Cals_per100grams) / 100) * portionGrams;
    breedDailyCalories = selectedBreed.avg_weight * CALORIES_PER_POUND_PER_DAY;
    const dogPercentageImpact = (caloriesForDog / breedDailyCalories) * 100;
    const humanEquivalentKcal = (dogPercentageImpact / 100) * HUMAN_DAILY_CALORIES;
    humanPercentageOfDailyIntakeText = ((humanEquivalentKcal / HUMAN_DAILY_CALORIES) * 100).toFixed(1) + "%";
  }

  return (
    <div className="space-y-8">
      <style jsx global>{`
        ::selection {
          background: #56EBFF; /* Waggel Blue */
          color: #181E24; /* Penny Black for contrast */
        }
      `}</style>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#34465b] mb-4">How much could this treat impact your dog?</h2>
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Human foods can be dangerous for pets. This tool is for education only and not veterinary advice. Avoid foods marked as toxic and consult your vet if unsure.
        </div>
      </div>
      <div className="grid gap-6 p-6 bg-[#EEF7FD] rounded-xl shadow-lg">
        <div className="space-y-3">
          <Label htmlFor="breed" className="text-[#34465b] font-semibold">
            Dog Breed
          </Label>
          <Select value={selectedBreed?.name || ""} onValueChange={(value) => {
            const breed = breedData.find(b => b.name === value);
            setSelectedBreed(breed || null);
          }}>
            <SelectTrigger className="border-2 border-[#C1D8EE] focus:border-[#56EBFF] focus:ring-[#56EBFF]">
              <SelectValue placeholder="Select a breed" />
            </SelectTrigger>
            <SelectContent className="bg-[#EEF7FD] max-h-60">
              {breedData.map((breed) => (
                <SelectItem key={breed.name} value={breed.name}>
                  {breed.name} ({breed.avg_weight.toFixed(1)} lbs avg)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="food" className="text-[#34465b] font-semibold">
            Food Item
          </Label>
          <div className="relative" ref={suggestionsContainerRef}>
            <Input
              id="food"
              ref={inputRef}
              placeholder="Enter a food item (e.g., pizza, cheese)"
              value={foodName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFoodName(e.target.value)}
              className={`border-2 focus:ring-[#56EBFF] selection:bg-[#56EBFF] selection:text-[#181E24] ${
                foodName.length > 1 && suggestions.length === 0 && !selectedFood
                  ? 'border-red-300 focus:border-red-400' 
                  : 'border-[#C1D8EE] focus:border-[#56EBFF]'
              }`}
            />
            {selectedFood?.DogWarning && selectedFood.DogWarning.trim().length > 0 && (
              <p className="mt-2 rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                ⚠️ {selectedFood.DogWarning}
              </p>
            )}
            {foodName.length > 1 && suggestions.length === 0 && !selectedFood && (
              <p className="text-red-500 text-sm mt-1">
                No matching foods found. Please select from the suggestions below or try a different search term.
              </p>
            )}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#EEF7FD] rounded-lg shadow-lg border border-[#C1D8EE] max-h-60 overflow-y-auto">
                {suggestions.map((food, index) => (
                  <button
                    key={`${food.FoodItem}-${index}`}
                    className="w-full px-4 py-2 text-left hover:bg-[#C1D8EE] focus:bg-[#C1D8EE] focus:outline-none"
                    onClick={() => {
                      setSelectedFood(food)
                      setFoodName(food.FoodItem) // Display the cleaned name in the input upon selection
                      setSuggestions([])
                    }}
                  >
                    <span className="font-medium text-[#34465b]">{food.FoodItem}</span> 
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="portion" className="text-[#34465b] font-semibold">
            Portion Size
          </Label>
          <Select value={portionSize} onValueChange={(value: keyof typeof PORTION_SIZES) => setPortionSize(value)}>
            <SelectTrigger className="border-2 border-[#C1D8EE] focus:border-[#56EBFF] focus:ring-[#56EBFF]">
              <SelectValue placeholder="Select portion size" />
            </SelectTrigger>
            <SelectContent className="bg-[#EEF7FD]">
              <SelectItem value="bite">Bite (5g)</SelectItem>
              <SelectItem value="piece">Piece (15g)</SelectItem>
              <SelectItem value="slice">Slice (30g)</SelectItem>
              {selectedFood && selectedFood.Average_Whole_Item_Weight_g && Number(selectedFood.Average_Whole_Item_Weight_g) > 0 && (
                <SelectItem value="whole_item">
                  Slice of {selectedFood.FoodItem} ({selectedFood.Average_Whole_Item_Weight_g}g)
                </SelectItem>
              )}
              <SelectItem value="100g Portion">100g Portion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={() => handleSubmit()}
            disabled={!selectedBreed || !selectedFood}
            className="w-full bg-[#56EBFF] hover:bg-[#4DD8F0] disabled:bg-[#C1D8EE] disabled:cursor-not-allowed text-[#181E24] font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
          >
            {!selectedBreed 
              ? 'Please select a dog breed' 
              : !selectedFood 
                ? 'Please select a food from the suggestions' 
                : 'Calculate Calorie Impact'
            }
          </button>
        </div>
      </div>

      {showResults && selectedFood && selectedBreed && (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#34465b] mb-4">What&apos;s the human equivalent?</h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-[#C1D8EE]">
            <h3 className="text-xl font-semibold text-[#34465b] mb-4">Results and safety guidance</h3>
            <div className="space-y-2">
              <p className="text-[#34465b]">
                <span className="font-medium">Breed:</span> {selectedBreed.name} (Average weight: {selectedBreed.avg_weight.toFixed(1)} lbs)
              </p>
              <p className="text-[#34465b]">
                <span className="font-medium">Daily Calorie Need:</span> {breedDailyCalories.toFixed(0)} kcal
              </p>
              <p className="text-[#34465b]">
                <span className="font-medium">Food:</span> {selectedFood.FoodItem}
              </p>
              <p className="text-[#34465b]">
                <span className="font-medium">Portion:</span> {
                  portionSize === 'whole_item' 
                    ? `Slice of ${selectedFood.FoodItem} (${selectedFood.Average_Whole_Item_Weight_g}g)`
                    : `${portionSize.charAt(0).toUpperCase() + portionSize.slice(1)} (${currentPortionGrams}g)`
                }
              </p>
              <p className="text-[#34465b]">
                <span className="font-medium">Calories (for {selectedBreed.name}):</span>{' '}
                {((Number(selectedFood.Cals_per100grams) / 100) * currentPortionGrams).toFixed(0)} kcal
              </p>
              <p className="text-[#34465b]">
                <span className="font-medium">Equivalent for Human:</span>{' '}
                {(((Number(selectedFood.Cals_per100grams) / 100) * currentPortionGrams) / breedDailyCalories * HUMAN_DAILY_CALORIES).toFixed(0)} kcal
                 <span className="text-sm text-[#34465b]/70"> (This is {humanPercentageOfDailyIntakeText} of a human&#39;s typical daily intake)</span>
              </p>
              {selectedFood?.DogWarning && selectedFood.DogWarning.trim().length > 0 && (
                <div className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-red-800">
                  ⚠️ Important: {selectedFood.DogWarning}
                </div>
              )}
              {humanRefs.length > 0 && (
                <div className="mt-3 p-3 bg-[#F0F8FF] rounded-lg border border-[#C1D8EE]">
                  <p className="text-[#34465b] font-medium mb-2">
                    🍽️ That&apos;s like eating:
                  </p>
                  <div className="space-y-1">
                    {humanRefs.map((r, i) => (
                      <p key={`${r.name}-${i}`} className="text-[#34465b] text-sm">
                        {r.name}
                        {i < humanRefs.length - 1 && <span className="text-[#34465b]/60"> or</span>}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Impact chart removed */}
        </div>
      )}
    </div>
  )
} 