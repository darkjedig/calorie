# 

| Landing Page Build Request Template |  |
| :---- | ----- |

**Landing Page Summary**

| Objective? | Build an interactive tool that shows the impact of feeding human foods to dogs by translating a dog’s calorie load into a human-equivalent calorie amount.  This provides education, safety guidance, and engaging, evergreen content with internal links to relevant pages. |
| :---- | :---- |
| **Landing Page Title** | H1: Dog Calorie Calculator with Human-Equivalent Comparison |
| **Section Headers** | **H2: How much could this treat impact your dog?**   **H2: What’s the human equivalent?**   **H2: Results and safety guidance**   **H3: Impact comparison (Dog vs Human)**   **H2: How we calculate it** **H2: Disclaimer** |
| **Page Content** | Human foods can be surprisingly calorie-dense for dogs.  Use this calculator to see how a portion of a human food (e.g., pizza, cheese, chocolate) translates into your dog’s daily calorie intake and what that would be in human terms.  This helps put “just a bite” into perspective. Choose your dog’s breed, search for a human food, pick a portion (bite, piece, slice, or whole item where available), and get a clear comparison plus safety warnings for toxic foods. |
| **Landing Page Owner/Champion** | Ryan, Concept/SEO, Grace/PR/Outreach |
| **Link to Existing Page** | Can link to breed guide pages like the breed calculator page does. |
| **Parent Page / Customer Journey** | Link from breed guides and breed insurance pages, other posts. PR campaigns and outreach for back links, increased brand awareness.  |
| **Key Considerations** | Clear warnings about human foods and toxicity Educational purpose disclaimer (not veterinary advice) \- Accessible, mobile-first UI  Proposal Uses CSV datasets for breeds and human foods  Internal linking opportunities to breed guides and safety content Evergreen content means the concept can be repurposed seasonally for ongoing PR campaigns. |

## 

## **Dog Calorie Impact Calculator PRD/Concept Idea**

### **Overview**

The Dog Calorie Impact Calculator estimates how human-food impacts a dog’s daily caloric needs. It then translates that “impact” into a human-equivalent calorie amount. It uses:

* Breed data (avg weight) to estimate daily dog calories based on average 30kcal per pound of weight. (Source: [https://www.uk.pedigree.com/feeding-calculator](https://www.uk.pedigree.com/feeding-calculator))https://www.petmd.com/dog/nutrition/how-many-calories-does-a-dog-need There are other calculations available for this though.  
* Human food calories per 100g, with optional average whole item weights  
* Portion sizes (bite, piece, slice, whole item, or 100g) to calculate treat calories  
* A visual bar chart to compare: Dog % of daily intake vs. Human equivalent in kcal (scaled to a 2,200 kcal daily intake)  
* Toxicity warnings from the dataset when applicable

This tool supports safe, relatable education with SEO-friendly content and internal links.

### **Demo Key Features**

1\) Calorie Impact Engine

* **Dog Daily Calories:** avg\_weight × 30 (kcal/day)  
* **Treat Calories:** (Cals\_per100grams / 100\) × portionGrams  
* **Dog Percent Impact:** (treatCalories / dogDailyCalories) × 100  
* **Human-Equivalent Calories:** dogPercent × 2200 (assuming 2,200 kcal/day human baseline)  
* **Portion Sizes:**  
  * bite: 5g, piece: 15g, slice: 30g  
  * whole\_item: use Average\_Whole\_Item\_Weight\_g if \> 0; otherwise fall back to 100g  
  * 100g Portion: fixed 100g  
* **Rounding & Display:**  
  * Percent values shown to one decimal place for readability  
  * Human-equivalent calories rounded to nearest whole kcal  
  * All calculations avoid negative values and guard against missing data

2\) Human-Equivalent Food Matching (relatable context)

* **Goal:** Show “That’s like eating: 1 pizza slice” or “half a cheeseburger”, etc.  
* **Approach in demo:**  
  * Start from humanEquivalentCalories  
  * Use a curated list of common foods with typical kcal per serving  
  * Sort by priority (most relatable items) and closeness to target kcal  
  * Generate friendly serving phrases (e.g., “half a …”, “1 …”, “2 …”) for 0.1–5 servings  
  * Return the top 1–3 most relatable matches  
* **Future option:** Match from a larger, editorially curated dataset or CMS content.

3\) Toxic Food Warnings

* The calories.csv includes a DogWarning column for known toxic foods.  
* If a selected food has a warning, display a clear “⚠️ Important” notice near results.  
* Show a general banner warning at the top: “Human foods can be dangerous for pets…”

4\) Results Visualisation (Recharts)

* **Bar chart with two bars:**  
  * Dog: % of dog’s daily intake (e.g., 2.2%)  
  * Human Equivalent: absolute kcal (e.g., 49 kcal), plotted as a % of 2,200 kcal for visual scale, but labeled with kcal prominently  
* **Y-axis:** % scale with dynamic domain (min 0, max above peak value)  
* **Bar labels:** custom label component to show clear on-bar text  
* **Tooltip:** shows both kcal and % context  
* **Emphasis**: Avoid showing the same % for both species; highlight dog % vs human absolute kcal

5\) Search & Selection UX

* **Breed:** searchable dropdown using parsed breeds.csv (name, min\_weight, max\_weight, avg\_weight)  
* **Food:** input with suggestions from calories.csv (FoodItem)  
* **Portion Size:** selector that adapts (shows “Whole item” only if Average\_Whole\_Item\_Weight\_g is present and \> 0\)  
* **Error states:**  
  * “No matching foods found” appears only when there are no matches and clears upon selection  
  * Disabled “Calculate” button until breed and food are selected

6\) Data & Files (demo)

* public/data/breeds.csv  
  * **Columns:** name, min\_weight, max\_weight; avg\_weight computed as (min+max)/2  
* public/data/calories.csv  
  * Columns (demo): FoodCategory, FoodItem, per100grams, Cals\_per100grams, KJ\_per100grams, Average\_Whole\_Item\_Weight\_g, DogWarning  
  * Calories parsed to numeric; supports values like “62 cal” or “62”

7\) Accessibility & Content

* Clear headings and labels  
* Keyboard and screen-reader friendly controls (native elements and aria where needed)  
* Use semantic HTML where possible  
* Copy guidelines emphasize education, safety, and non-veterinary advice

8\) Analytics (suggested)

* **Capture events for:**  
  * Breed selected  
  * Food selected  
  * Portion size changed  
  * Calculate clicked  
  * Toxic warning shown  
* Use these to improve content and dataset quality over time.

### **Page Structure & Copy (example)**

* **H1:** Dog Calorie Impact Calculator | Human-Equivalent Comparison  
* Intro paragraph: explain idea and general safety note  
* **Controls:** Breed select, Food search \+ suggestions, Portion size select, Calculate button  
* **Results:**  
  * Summary lines: Breed, Daily Calorie Need, Food, Portion, Calories (for breed), Equivalent for Human (kcal and % of 2200\)  
  * Toxicity notice (if present)  
  * “That’s like eating …” relatable items (1–3 options)  
* **Chart:** Dog % vs Human kcal bar chart  
* How we calculate it: concise explanation of formulas and assumptions  
* **Disclaimer:** education only, consult a vet for advice

### **Technical Implementation (demo)**

* **Framework:** Next.js (App Router), TypeScript, TailwindCSS, Recharts  
* **Component strategy:**  
  * Page and layout as server components  
  * Calculator as a small client component due to user input, state, and charts  
* **Data loading:**  
  * Fetch breeds.csv and calories.csv from /public/data at runtime in the client demo  
  * Robust CSV parsing with validation, filtering malformed rows, numeric conversions  
* **State & effects:**  
  * Memoised submit handler to avoid re-render loops  
  * Recalculate on portion change only when results are visible  
* **Charting:**  
  * Recharts BarChart with custom label via the label prop  
  * Tooltip that emphasises kcal for human equivalent

### **Error Handling & Warnings**

* Input validation for breed & food selection  
* Guard against missing or non-numeric calories  
* **Fallbacks:**  
  * Whole item weight missing → use 100g  
  * No relatable foods found → show at least the human-equivalent kcal

### 

### **Data Governance & Content**

* CSVs are source-of-truth for demo. We need to consider:  
  * A CMS or database for foods, warnings, and editorial descriptions  
  * Versioning and provenance of calorie and toxicity data  
  * Regular reviews by content and veterinary contact or other regulatory requirements

### **SEO & Internal Linking**

* Title and meta description focused on “Dog Calorie Impact,” “Human Equivalent,” and “human foods for dogs” themes  
* Internal links to breed guides, toxic food content, and insurance pages  
* Structured data (FAQ or HowTo) or our “can dogs eat” blog posts as related info in a nice component

### **Privacy & Performance**

* No personal data collected in demo  
* Defer chart rendering until results are ready (Or remove, it is not essential here)

### **Risks & Assumptions**

* This is an educational tool; it does not replace veterinary advice  
* Toxic food list is not exhaustive; “DogWarning” column or wherever we get this data from must be maintained   
* Human-equivalent calories use a 2,200 kcal baseline; actual human needs vary

## **Demo: Screens & Flow (reference)**

* Inputs: Breed select, Food search, Portion select, Calculate button  
* Results card:  
  * Daily need, treat kcal, human equivalent kcal & %  
  * Toxic warning if applicable  
  * “That’s like eating …” relatable items  
* Impact Comparison chart (Dog % vs Human kcal)

## **How We Calculate (public copy ready)**

* Your dog’s daily calories are estimated as: average breed weight × 30  
* We calculate the treat calories from the selected food’s calories per 100g and the portion size  
* We show the dog’s % of daily intake for that treat  
* We translate that same % to a human-equivalent kcal using 2,200 kcal/day  
* We find a relatable human food example with about the same calories

## **Disclaimer (public copy ready)**

This tool is for education only and is not veterinary advice. Human foods can be dangerous for pets. Avoid toxic foods and consult your vet if you are unsure.

## **Data Sources (for this demo)**

* Internal CSVs: public/data/breeds.csv and public/data/calories.csv  
* Example research (for broader content context):  
  * CSV Breed dataset sources: [https://www.kaggle.com/datasets/warcoder/dog-breeds-details](https://www.kaggle.com/datasets/warcoder/dog-breeds-details)  
  * [https://www.kaggle.com/datasets/sujaykapadnis/dog-breeds](https://www.kaggle.com/datasets/sujaykapadnis/dog-breeds)   
  * [https://www.kaggle.com/datasets/warcoder/dog-breeds-details](https://www.kaggle.com/datasets/warcoder/dog-breeds-details)   
  * [https://www.kaggle.com/datasets/edoardoba/dog-breeds](https://www.kaggle.com/datasets/edoardoba/dog-breeds)   
  * [https://www.kaggle.com/datasets/waqi786/dogs-dataset-3000-records](https://www.kaggle.com/datasets/waqi786/dogs-dataset-3000-records)   
  * [https://www.kaggle.com/datasets/mexwell/dog-breeds-dataset](https://www.kaggle.com/datasets/mexwell/dog-breeds-dataset)   
  * [https://www.kaggle.com/datasets/thedevastator/canine-intelligence-and-size](https://www.kaggle.com/datasets/thedevastator/canine-intelligence-and-size)   
  * Best list with mixed breeds too: [https://www.kaggle.com/datasets/yonkotoshiro/dogs-breeds](https://www.kaggle.com/datasets/yonkotoshiro/dogs-breeds)   
  * OR, we can just use the data on our breed pages ☺️

---

## **Final Notes:**

* Keep the warnings prominent and compassionate  
* Keep language clear, relatable, and non-judgmental  
* Encourage safer alternatives and links to relevant guides and content

