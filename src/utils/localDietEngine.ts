import {
  UserProfile,
  PersonalPlan,
  DietaryPreference,
  FitnessGoal,
  BudgetTier,
  LocalDietRecommendation,
  LocalFoodItem,
} from '../types/user';

export function calculateTargets(profile: {
  age: number;
  currentWeightKg: number;
  targetWeightKg: number;
  currentHeightCm: number;
  gender?: string;
  primaryGoal: FitnessGoal;
}) {
  const { age, currentWeightKg, targetWeightKg, currentHeightCm, primaryGoal } = profile;
  
  // Basal Metabolic Rate (Mifflin-St Jeor formula)
  const isFemale = profile.gender === 'Female';
  const s = isFemale ? -161 : 5;
  const bmr = 10 * currentWeightKg + 6.25 * currentHeightCm - 5 * age + s;
  
  // Moderate active multiplier (~1.35)
  const tdee = Math.round(bmr * 1.35);

  let dailyCalories: number;
  let proteinMultiplier: number; // grams per kg

  if (age < 18) {
    // Adolescent: Focus strictly on healthy development, wellness, and growth - NEVER caloric deficit
    dailyCalories = Math.max(2050, Math.round(tdee + 100)); // Zero deficit; maintenance or gentle healthy growth surplus
    proteinMultiplier = 1.6; // Bioavailable amino acids for growth and tissue repair
  } else {
    switch (primaryGoal) {
      case 'Healthy Weight Management':
        // Sustained safe deficit (approx 400-500 kcal deficit)
        dailyCalories = Math.max(1600, tdee - 500);
        proteinMultiplier = 1.6; // High protein to spare lean tissue
        break;
      case 'Muscle Building':
        dailyCalories = tdee + 300;
        proteinMultiplier = 1.8;
        break;
      case 'Strength Development':
        dailyCalories = tdee + 150;
        proteinMultiplier = 1.7;
        break;
      case 'Improving Fitness':
        dailyCalories = tdee;
        proteinMultiplier = 1.4;
        break;
      case 'General Health and Wellness':
      default:
        dailyCalories = tdee;
        proteinMultiplier = 1.3;
        break;
    }
  }

  // Protein targets
  const dailyProtein = Math.round(currentWeightKg * proteinMultiplier);
  // Healthy fats (~25% of calories)
  const dailyFat = Math.round((dailyCalories * 0.25) / 9);
  // Remainder in complex carbohydrates
  const proteinCals = dailyProtein * 4;
  const fatCals = dailyFat * 9;
  const carbsCals = Math.max(400, dailyCalories - proteinCals - fatCals);
  const dailyCarbs = Math.round(carbsCals / 4);

  // Daily Water Intake (35-45 ml per kg, minimum 3.0L for active fitness)
  const dailyHydration = Math.min(5000, Math.max(3000, Math.round(currentWeightKg * 40 / 250) * 250));

  // Movement burn target
  const dailyMovement = primaryGoal === 'Healthy Weight Management' ? 550 : 450;

  return {
    dailyCalorieTarget: dailyCalories,
    dailyProteinTargetG: dailyProtein,
    dailyCarbsTargetG: dailyCarbs,
    dailyFatTargetG: dailyFat,
    dailyHydrationTargetMl: dailyHydration,
    dailyMovementTargetKcal: dailyMovement,
  };
}

export function generateLocalDietPlan(params: {
  state: string;
  city: string;
  locality?: string;
  dietaryPreference: DietaryPreference;
  budget: BudgetTier;
  allergies: string[];
  dislikedFoods: string[];
  mealsPerDay: number;
  targetCalories: number;
  proteinTargetG: number;
}): LocalDietRecommendation {
  const { state, city, dietaryPreference, allergies = [], dislikedFoods = [] } = params;
  const stateLower = (state || '').toLowerCase();
  const cityLower = (city || '').toLowerCase();

  const isNorth =
    stateLower.includes('haryana') ||
    stateLower.includes('punjab') ||
    stateLower.includes('delhi') ||
    stateLower.includes('uttar pradesh') ||
    stateLower.includes('up') ||
    stateLower.includes('rajasthan') ||
    stateLower.includes('himachal') ||
    stateLower.includes('uttarakhand') ||
    cityLower.includes('gurugram') ||
    cityLower.includes('gurgaon') ||
    cityLower.includes('faridabad') ||
    cityLower.includes('noida') ||
    cityLower.includes('chandigarh') ||
    cityLower.includes('jaipur');

  const isWest =
    stateLower.includes('maharashtra') ||
    stateLower.includes('gujarat') ||
    stateLower.includes('goa') ||
    cityLower.includes('mumbai') ||
    cityLower.includes('pune') ||
    cityLower.includes('ahmedabad');

  const isSouth =
    stateLower.includes('karnataka') ||
    stateLower.includes('tamil nadu') ||
    stateLower.includes('kerala') ||
    stateLower.includes('andhra') ||
    stateLower.includes('telangana') ||
    cityLower.includes('bengaluru') ||
    cityLower.includes('bangalore') ||
    cityLower.includes('chennai') ||
    cityLower.includes('hyderabad');

  const isEast =
    stateLower.includes('west bengal') ||
    stateLower.includes('bihar') ||
    stateLower.includes('odisha') ||
    stateLower.includes('jharkhand') ||
    stateLower.includes('assam') ||
    cityLower.includes('kolkata') ||
    cityLower.includes('patna');

  const hasCity = Boolean(city && city.trim());
  const allowsEggs = dietaryPreference === 'Eggetarian' || dietaryPreference === 'Non-vegetarian';
  const allowsChicken = dietaryPreference === 'Non-vegetarian';
  const isVegan = dietaryPreference === 'Vegan';

  let regionName = 'All-India General Nutrition (No City Specified)';
  let staples = ['Whole Wheat Phulka / Roti', 'Lentils (Moong, Toor, Masoor Dal)', 'Desi Curd / Dahi', 'Low-Fat Paneer / Soya Chunks', 'Seasonal Sabzi', 'Steamed Rice'];
  let shoppingTips = [
    'Local recommendations require a city. Please add your city in My Profile to unlock localized mandi prices and regional crops.',
    'Buy whole grains and pulses in bulk from your local wholesale Kirana or mandi for maximum affordability.',
    'Rely on nationally ubiquitous protein staples: boiled chana, sprouted moong, fresh dahi, and paneer or soya chunks.',
  ];

  if (hasCity) {
    if (isWest) {
      regionName = `${city}, ${state} (Western Mandi Staples)`;
      staples = ['Jowar / Bajra Bhakri', 'Sprouted Moong Usal', 'Toor Dal & Kadi', 'Poha', 'Peanut / Sesame Thecha', 'Chaas'];
      shoppingTips = [
        `Jowar and Bajra flours from local chakkis in ${city} are nutrient dense, rich in minerals, and cost less than ₹45/kg.`,
        'Make overnight sprouted whole moong or matki: doubles digestible enzymes and provides affordable 24g protein per 100g dry weight.',
        'Fresh homemade buttermilk (chaas) with roasted jeera aids gut microflora under warm weather.',
      ];
    } else if (isSouth) {
      regionName = `${city}, ${state} (Southern Regional Staples)`;
      staples = ['Steamed Idli / Dosa with Sambar', 'Ragi Mudde / Ragi Roti', 'Toor Dal Rasam', 'Sundal (Boiled Chana)', 'Fresh Curd', 'Seasonal Gourd Sabzi'];
      shoppingTips = [
        'Ragi (Finger Millet) is an incredible low-cost superfood packed with calcium and slow-digesting complex carbs.',
        'Sundal (boiled seasoned chickpeas/black chana) is a revered local protein powerhouse costing pennies per serving.',
        'Combine lentils and fermented batter for high bioavailability without needing expensive foreign health foods.',
      ];
    } else if (isEast) {
      regionName = `${city}, ${state} (Eastern Regional Staples)`;
      staples = ['Roasted Chana Sattu Drink', 'Yellow Moong Dal & Chana Dal', 'Steamed Rice with Shorshe or Posto Veg', 'Ghugni (White/Yellow Peas)', 'Curd'];
      shoppingTips = [
        'Roasted Chana Sattu is one of the highest protein-per-rupee foods in India (~26g protein per 100g at ₹90/kg).',
        'Local seasonal river fish (Rohu/Katla) or Paneer from local sweetmeat artisans delivers clean lean macros.',
        'Ghugni prepared with minimal oil provides high dietary fiber, iron, and slow burning energy.',
      ];
    } else if (isNorth) {
      regionName = `${city}, ${state} (Northern Mandi Staples)`;
      staples = ['Whole Wheat Roti', 'Dal (Yellow Toor / Moong)', 'Basmati Rice', 'Paneer', 'Desi Curd / Dahi', 'Seasonal Greens'];
      shoppingTips = [
        `Procure fresh cow/buffalo milk or fresh block paneer from local dairies in ${city} — significantly fresher and 35% cheaper than packaged brands.`,
        `Buy whole grains (chana, toor dal, whole wheat) in 5kg bags from the wholesale Kirana market or local Mandi in ${city} for maximum affordability.`,
        'Prioritize seasonal local greens (Palak, Methi, Bhindi, Torai, Gobhi) instead of imported broccoli or zucchini.',
      ];
    } else {
      regionName = `${city}, ${state} (Regional Indian Crops & Dairy)`;
      staples = ['Whole Wheat Roti', 'Dal (Toor / Moong)', 'Local Fresh Dairy / Paneer', 'Seasonal Sabzi', 'Steamed Rice', 'Sprouts'];
      shoppingTips = [
        `Procure fresh dairy and produce from local mandis in ${city} for peak freshness and lowest cost.`,
        'Buy regional pulses and whole grains in bulk from local wholesale grain merchants.',
        'Rely on seasonal vegetables native to your district rather than packaged supermarket imports.',
      ];
    }
  }

  // Generate recommended foods based on location & preferences
  const recommendedFoods: LocalFoodItem[] = [];

  // 1. Dairy or Vegan alternatives
  if (!isVegan && !allergies.includes('Dairy') && !allergies.includes('Lactose')) {
    recommendedFoods.push({
      id: 'local-paneer',
      name: 'Fresh Local Low-Fat Paneer',
      localName: 'Taza Paneer',
      serving: '100g',
      calories: 220,
      proteinG: 22,
      carbsG: 3.5,
      fatG: 13,
      category: 'Dairy Protein',
      affordabilityScore: 'Low Cost',
      regionReason: isNorth ? 'Easily sourced from any local Haryana/Punjab dairy at ₹320–380/kg.' : 'Freshly available across local dairies.',
    });

    recommendedFoods.push({
      id: 'local-curd',
      name: 'Desi Dahi / Homemade Fresh Curd',
      localName: 'Ghar Ka Dahi',
      serving: '200g (1 bowl)',
      calories: 124,
      proteinG: 7.2,
      carbsG: 8.8,
      fatG: 6.2,
      category: 'Dairy & Probiotic',
      affordabilityScore: 'Low Cost',
      regionReason: 'Crucial for Indian gut microbiome and nutrient absorption; costs under ₹20/bowl.',
    });
  } else {
    // Vegan alternatives
    recommendedFoods.push({
      id: 'local-soya-chunks',
      name: 'Soya Chunks / Mealmaker',
      localName: 'Badi / Soya Wadi',
      serving: '50g (dry)',
      calories: 172,
      proteinG: 26,
      carbsG: 16,
      fatG: 0.5,
      category: 'Plant Protein',
      affordabilityScore: 'Low Cost',
      regionReason: 'The absolute king of plant-based protein per rupee in India (52% protein, ~₹50 for 200g).',
    });

    recommendedFoods.push({
      id: 'local-tofu',
      name: 'Local Fresh Soya Paneer (Tofu)',
      localName: 'Soya Paneer',
      serving: '100g',
      calories: 140,
      proteinG: 16,
      carbsG: 2.5,
      fatG: 7.5,
      category: 'Plant Protein',
      affordabilityScore: 'Moderate',
      regionReason: 'Great zero-lactose dairy replacement for curries and stir-fries.',
    });
  }

  // 2. Pulses and Legumes
  recommendedFoods.push({
    id: 'local-chana',
    name: 'Roasted Bengal Gram / Kala Chana',
    localName: 'Bhuna Chana & Sprouted Chana',
    serving: '60g',
    calories: 215,
    proteinG: 13.5,
    carbsG: 35,
    fatG: 3.2,
    category: 'Lentils & Legumes',
    affordabilityScore: 'Low Cost',
    regionReason: isNorth ? 'Classic Haryana/Delhi evening staple; keeps you full for hours.' : 'Readily available everywhere in India.',
  });

  recommendedFoods.push({
    id: 'local-dal',
    name: 'Yellow Toor / Moong Dal Tadka (Low Oil)',
    localName: 'Ghar Ki Peeli Dal',
    serving: '250ml bowl',
    calories: 185,
    proteinG: 11.5,
    carbsG: 28,
    fatG: 3.5,
    category: 'Lentils & Legumes',
    affordabilityScore: 'Low Cost',
    regionReason: 'Daily staple rich in folate, iron, and steady sustained glucose release.',
  });

  // 3. Sattu / Besan
  recommendedFoods.push({
    id: 'local-sattu',
    name: 'Roasted Chana Sattu',
    localName: 'Chana Sattu Sharbat / Chilla',
    serving: '40g powder',
    calories: 155,
    proteinG: 10.2,
    carbsG: 24,
    fatG: 2.1,
    category: 'Traditional Functional Superfood',
    affordabilityScore: 'Low Cost',
    regionReason: 'Natural indigenous protein drink. Beat heat and fuel workouts without expensive supplements.',
  });

  // 4. Eggs (if permitted)
  if (allowsEggs) {
    recommendedFoods.push({
      id: 'local-eggs',
      name: 'Whole Farm Eggs & Egg Whites',
      localName: 'Desi / Farm Anda',
      serving: '2 whole eggs + 2 whites',
      calories: 175,
      proteinG: 20,
      carbsG: 1.2,
      fatG: 10,
      category: 'Animal Protein',
      affordabilityScore: 'Low Cost',
      regionReason: 'Gold standard complete amino acid profile; ₹6–7 per egg at your neighborhood retail store.',
    });
  }

  // 5. Chicken (if permitted)
  if (allowsChicken) {
    recommendedFoods.push({
      id: 'local-chicken',
      name: 'Fresh Skinless Chicken Breast / Curry Cut',
      localName: 'Desi Chicken Curry (Low Oil)',
      serving: '150g',
      calories: 220,
      proteinG: 36,
      carbsG: 1.5,
      fatG: 6,
      category: 'Lean Poultry',
      affordabilityScore: 'Moderate',
      regionReason: 'Procured fresh from trusted local butcher; 100% lean muscle building block.',
    });
  }

  // 6. Grains & Seasonal Veg
  recommendedFoods.push({
    id: 'local-roti',
    name: isNorth ? 'Whole Wheat / Multigrain Phulka Roti' : 'Fresh Phulka / Ragi Roti',
    localName: 'Ghar Ki Roti',
    serving: '2 rotis (70g total)',
    calories: 160,
    proteinG: 5.5,
    carbsG: 32,
    fatG: 1.2,
    category: 'Complex Carbohydrate',
    affordabilityScore: 'Low Cost',
    regionReason: 'Zero-preservative traditional staple; rich in fiber and slow carbs.',
  });

  recommendedFoods.push({
    id: 'local-seasonal-veg',
    name: 'Local Mandi Seasonal Green Sabzi (Palak, Methi, Bhindi, Torai)',
    localName: 'Mausami Hari Sabzi',
    serving: '150g bowl',
    calories: 75,
    proteinG: 3.5,
    carbsG: 9,
    fatG: 2.5,
    category: 'Micronutrients & Fiber',
    affordabilityScore: 'Low Cost',
    regionReason: 'Freshly harvested from regional farms, retaining maximum vitamin C, potassium, and lutein.',
  });

  // Filter out any explicitly disliked items
  const finalFoods = recommendedFoods.filter((f) => {
    return !dislikedFoods.some((d) => f.name.toLowerCase().includes(d.toLowerCase()) || (f.localName && f.localName.toLowerCase().includes(d.toLowerCase())));
  });

  // Construct meal-by-meal schedule
  const sampleMealPlan = [
    {
      mealName: 'Breakfast (8:30 AM)',
      items: isVegan
        ? ['Besan / Moong Chilla (2 pcs) with mint chutney', '1 cup Black Tea or Sattu Drink', '1 seasonal fruit (Banana / Guava)']
        : allowsEggs
        ? ['2 Whole Eggs Bhurji + 2 Roti or Multigrain Toast', '1 cup Green Tea / Milk Tea (low sugar)', 'Handful of roasted chana']
        : ['Sprouted Moong & Paneer Salad (100g paneer)', '2 Phulka Roti or Poha with roasted peanuts', '1 glass Fresh Curd Lassi or Chaas'],
      approxCalories: 480,
      proteinG: 26,
    },
    {
      mealName: 'Lunch (1:30 PM)',
      items: allowsChicken
        ? ['Chicken Curry or Chicken Stir-fry (150g)', '2 Whole Wheat Roti + 1 small katori rice', 'Big bowl of cucumber-tomato salad', '1 glass Buttermilk (Chaas)']
        : isVegan
        ? ['Soya Chunks Curry (50g dry badi) with peas', '2 Whole Wheat Roti + 1 bowl Dal', 'Seasonal green sabzi (Palak/Bhindi)', 'Salad with lemon']
        : ['100g Fresh Low-Fat Paneer Bhurji / Palak Paneer', '1 bowl Thick Dal (Toor / Moong)', '2 Phulka Rotis', '1 bowl Homemade Fresh Dahi (Curd)', 'Fresh cucumber-radish salad'],
      approxCalories: 580,
      proteinG: 38,
    },
    {
      mealName: 'Pre/Post Workout Evening Snack (5:30 PM)',
      items: [
        'Roasted Chana (40g) or Chana Sattu Drink (30g powder in water with jeera & black salt)',
        '1 Local Seasonal Fruit (Guava / Papaya / Apple)',
        'Black Coffee or Warm Green Tea',
      ],
      approxCalories: 260,
      proteinG: 14,
    },
    {
      mealName: 'Dinner (8:30 PM)',
      items: allowsEggs
        ? ['3 Egg White + 1 Whole Egg Omelette with veggies', '1-2 Roti or Quinoa/Brown Rice', 'Steamed vegetable soup']
        : isVegan
        ? ['Tofu or Sprouted Chana Bhurji with capsicum', '1 large bowl Yellow Moong Dal', '2 Phulkas with light ghee', 'Warm turmeric cinnamon water']
        : ['1 bowl Yellow Dal Tadka with 100g light Paneer cubes', '2 Phulka Rotis', '1 bowl Seasonal Hari Sabzi', '1 glass Warm Haldi Milk (skimmed) before bed'],
      approxCalories: 520,
      proteinG: 34,
    },
  ];

  return {
    region: regionName,
    staples,
    recommendedFoods: finalFoods,
    sampleMealPlan,
    localShoppingTips: shoppingTips,
  };
}

export const INDIAN_STATES = [
  'Haryana',
  'Punjab',
  'Delhi NCR',
  'Maharashtra',
  'Uttar Pradesh',
  'Karnataka',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Telangana',
  'Kerala',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Andhra Pradesh',
  'Chandigarh',
  'Himachal Pradesh',
  'Uttarakhand',
  'Goa',
  'Assam',
];

export const COMMON_ALLERGIES = [
  'None',
  'Lactose / Dairy',
  'Peanuts',
  'Tree Nuts (Almonds/Walnuts)',
  'Gluten / Wheat',
  'Soy',
  'Eggs',
  'Fish / Shellfish',
];

export const COMMON_DISLIKED_FOODS = [
  'Karela (Bitter Gourd)',
  'Baingan (Eggplant)',
  'Lauki (Bottle Gourd)',
  'Tinda',
  'Tofu / Soya',
  'Raw Onions',
  'Mushrooms',
  'Spicy Food',
];

export const REGULAR_STAPLE_OPTIONS = [
  'Whole Wheat Roti',
  'White / Brown Rice',
  'Yellow Moong Dal',
  'Toor Dal',
  'Homemade Curd (Dahi)',
  'Fresh Paneer',
  'Roasted Chana',
  'Sprouted Moong',
  'Chana Sattu',
  'Eggs',
  'Poha / Upma',
  'Besan Chilla',
  'Green Vegetables',
  'Chicken',
];

export function getDefaultAaravProfile(): UserProfile {
  const targets = calculateTargets({
    age: 24,
    currentWeightKg: 98.0,
    targetWeightKg: 82.0,
    currentHeightCm: 178,
    gender: 'Male',
    primaryGoal: 'Healthy Weight Management',
  });

  const localDiet = generateLocalDietPlan({
    state: 'Haryana',
    city: 'Gurugram',
    locality: 'Sector 14',
    dietaryPreference: 'Vegetarian',
    budget: 'Budget Friendly (₹120–250/day)',
    allergies: ['None'],
    dislikedFoods: ['Karela (Bitter Gourd)', 'Baingan (Eggplant)'],
    mealsPerDay: 3,
    targetCalories: 2000,
    proteinTargetG: 145,
  });

  return {
    id: 'usr-aarav-default',
    email: 'aarav.precision@auramorph.fit',
    fullName: 'Aarav Jakhar',
    age: 24,
    gender: 'Male',
    country: 'India',
    state: 'Haryana',
    city: 'Gurugram',
    locality: 'Sector 14',
    weightUnit: 'kg',
    heightUnit: 'cm',
    currentWeightKg: 98.0,
    targetWeightKg: 82.0,
    currentHeightCm: 178,
    desiredHeightCm: 178,
    primaryGoal: 'Healthy Weight Management',
    experienceLevel: 'Intermediate',
    equipment: 'Full gym access',
    dietaryPreference: 'Vegetarian',
    allergies: ['None'],
    dislikedFoods: ['Karela (Bitter Gourd)', 'Baingan (Eggplant)'],
    dailyBudget: 'Budget Friendly (₹120–250/day)',
    mealsPerDay: 3,
    regularFoods: ['Whole Wheat Roti', 'Yellow Moong Dal', 'Homemade Curd (Dahi)', 'Fresh Paneer', 'Green Vegetables'],
    dailyCalorieTarget: 2000,
    dailyProteinTargetG: 145,
    dailyCarbsTargetG: 200,
    dailyFatTargetG: 50,
    dailyHydrationTargetMl: 4000,
    dailyMovementTargetKcal: 550,
    localDiet,
    hasCompletedOnboarding: true,
    createdAt: new Date().toISOString(),
    isTeenager: false,
  };
}

export function generateRuleBasedPlan(profile: UserProfile): PersonalPlan {
  const isLoss = profile.targetWeightKg < profile.currentWeightKg;
  const targetCalories = isLoss
    ? Math.max(1600, Math.round(profile.currentWeightKg * 22))
    : Math.round(profile.currentWeightKg * 30);
  const targetProtein = Math.round(profile.targetWeightKg * 1.6);
  const targetFat = Math.round((targetCalories * 0.25) / 9);
  const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFat * 9)) / 4);

  const isVeg = profile.dietaryPreference === 'Vegetarian' || profile.dietaryPreference === 'Vegan';
  const isTeen = (profile.age || 20) < 20;
  const hasHeightGoal = (profile.desiredHeightCm || 178) > (profile.currentHeightCm || 178);

  const heightGuidance = hasHeightGoal || isTeen
    ? `Final adult height is primarily governed by genetics (80-85%) and the biological state of long-bone epiphyseal growth plates, which naturally fuse following puberty between ages 16 and 21. No exercises, hanging routines, or nutritional supplements can lengthen long bones once growth plates are fused. ${
        isTeen
          ? 'For adolescents who are still growing: Prioritize 8.5–9.5 hours of high-quality sleep for peak nocturnal growth hormone secretion, consume sufficient calcium, vitamin D3, and balanced protein, and consult a pediatrician or endocrinologist to monitor bone age.'
          : 'For adults: You can maximize your functional posture through thoracic extension, spinal decompression, and core stabilization exercises, which can optimize visible standing height by 1–2 cm.'
      }`
    : 'Adult height is anatomically stabilized post-epiphyseal closure. Maintain spinal alignment and thoracic mobility for optimal postural stature.';

  const hasCity = Boolean(profile.city && profile.city.trim());
  const locationSummary = hasCity
    ? `localized ${profile.city}${profile.state ? ', ' + profile.state : ''} nutrition`
    : `a general Indian balanced nutrition protocol (Note: Local recommendations require a city; please add your city in My Profile anytime to unlock regional mandi recommendations)`;

  return {
    id: `plan-${Date.now()}`,
    userId: profile.id || 'current-user',
    createdAt: new Date().toISOString(),
    summary: `Calibrated ${profile.primaryGoal || 'fitness'} protocol for ${profile.fullName || 'Athlete'} (${profile.currentWeightKg}kg → ${profile.targetWeightKg}kg). Combines ${locationSummary} with a progressive ${profile.experienceLevel || 'Beginner'} training program using ${profile.equipment || 'available equipment'}.`,
    heightGuidance,
    dietPlan: {
      dailyCalorieTarget: targetCalories,
      dailyProteinG: targetProtein,
      dailyCarbsG: targetCarbs,
      dailyFatG: targetFat,
      estimatedDailyCostInr: profile.dailyBudget?.includes('Budget') ? 180 : 320,
      meals: [
        {
          mealName: 'Energizing Morning Breakfast',
          time: '8:30 AM',
          items: [
            {
              name: isVeg ? 'Low-Fat Paneer Bhurji & Multigrain Rotis' : 'Egg Whites Omelette & Whole Wheat Toast',
              quantity: isVeg ? '120g paneer + 2 rotis' : '4 egg whites + 2 slices toast',
              calories: 420,
              proteinG: 28,
              costEstInr: 45,
              notes: 'Rich in leucine; cooked in 1 tsp cold-pressed mustard oil with turmeric and green chilies.',
            },
            {
              name: 'Warm Milk / Spiced Chaas (Buttermilk)',
              quantity: '250 ml with roasted cumin & mint',
              calories: 90,
              proteinG: 7,
              costEstInr: 15,
              notes: 'Provides natural calcium and probiotics for gut microbiome efficiency.',
            },
          ],
          approxCalories: 510,
          approxProteinG: 35,
        },
        {
          mealName: 'High-Bioavailability Lunch',
          time: '1:30 PM',
          items: [
            {
              name: 'Slow-Cooked Dal Tadka (Moong & Masoor Blend)',
              quantity: '1 large bowl (250g)',
              calories: 220,
              proteinG: 14,
              costEstInr: 25,
              notes: 'Dual-pulse blend creates a complete essential amino acid profile.',
            },
            {
              name: 'Steamed Rice & Whole Wheat Roti',
              quantity: '1 cup steamed rice + 1 fresh phulka',
              calories: 260,
              proteinG: 6,
              costEstInr: 15,
              notes: 'Complex carbohydrates to replenish hepatic glycogen.',
            },
            {
              name: 'Fresh Curd (Dahi) & Cucumber-Tomato Salad',
              quantity: '150g fresh curd + 1 bowl raw salad',
              calories: 120,
              proteinG: 6,
              costEstInr: 20,
              notes: 'Dietary fiber and natural digestive probiotics.',
            },
          ],
          approxCalories: 600,
          approxProteinG: 26,
        },
        {
          mealName: 'Post-Workout / Evening Power Refuel',
          time: '5:30 PM',
          items: [
            {
              name: 'Roasted Chana & Sprouted Moong Chaat',
              quantity: '1 bowl (80g chana + sprouts with lemon)',
              calories: 240,
              proteinG: 16,
              costEstInr: 25,
              notes: 'Affordable, crunchy local protein powerhouse with low glycemic index.',
            },
          ],
          approxCalories: 240,
          approxProteinG: 16,
        },
        {
          mealName: 'Restorative Dinner',
          time: '8:30 PM',
          items: [
            {
              name: isVeg ? 'Soya Chunks Curry with Seasonal Vegetables' : 'Lean Chicken Breast / Soya Curry with Greens',
              quantity: isVeg ? '50g soya chunks + seasonal sabzi' : '150g lean chicken breast + sabzi',
              calories: 320,
              proteinG: 32,
              costEstInr: 40,
              notes: 'Over 50% protein density by dry weight in soya; excellent muscle protein synthesis.',
            },
            {
              name: 'Warm Roti with pinch of Ajwain',
              quantity: '2 rotis',
              calories: 180,
              proteinG: 5,
              costEstInr: 10,
              notes: 'Ajwain aids overnight gastric comfort and prevents bloating.',
            },
          ],
          approxCalories: 500,
          approxProteinG: 37,
        },
      ],
      proteinSources: [
        { food: 'Low-Fat Cow Milk Paneer', proteinPerServing: '18g per 100g', affordability: 'Moderate (₹40-50/100g)' },
        { food: 'Soya Chunks (Textured Veg Protein)', proteinPerServing: '52g per 100g dry', affordability: 'Very High (₹15/100g)' },
        { food: 'Sprouted Green Moong & Roasted Chana', proteinPerServing: '22g per 100g', affordability: 'High (₹20/100g)' },
        { food: 'Fresh Farm Curd / Dahi', proteinPerServing: '7g per 150g', affordability: 'High (₹15/cup)' },
        { food: 'Dual Dal Blends (Moong + Masoor)', proteinPerServing: '14g per bowl', affordability: 'High (₹18/serving)' },
      ],
      localAlternatives: [
        { original: 'Imported Quinoa', localReplacement: 'Dalia (Broken Wheat) / Foxtail Millet', benefit: 'Equal complex carbs and fiber at 1/5th the grocery cost' },
        { original: 'Avocado', localReplacement: 'Cold-pressed Mustard Oil + Roasted Peanuts', benefit: 'Optimal monounsaturated fatty acids and Vitamin E locally sourced' },
        { original: 'Greek Yogurt', localReplacement: 'Hung Curd (Dahi drained in muslin cloth)', benefit: 'Identical thick protein density at fraction of cost' },
        { original: 'Whey Protein Isolate', localReplacement: 'Roasted Sattu or 100g Paneer + Chaas', benefit: 'Real-food amino acids with high digestive satiety' },
      ],
      safetyNotes: [
        ...(!hasCity
          ? ['Local recommendations require a city. You are currently viewing a general Indian balanced nutrition plan. Please add your city in My Profile anytime to unlock regional mandi recommendations.']
          : []),
        'No extreme caloric cuts; maintain a moderate deficit with adequate hydration (3.5 - 4.0L/day).',
        'Include 1 tsp of ajwain or jeera water post-meals to support natural digestion.',
        'Rotate seasonal vegetables (palak, methi, tori, lauki) to ensure broad micronutrient intake.',
      ],
    },
    workoutPlan: {
      experienceLevel: profile.experienceLevel || 'Beginner',
      weeklyFrequency: 4,
      schedule: [
        { day: 'Monday', focus: 'Push (Chest, Anterior Deltoids, Triceps)', type: 'Strength / Hypertrophy', isRest: false },
        { day: 'Tuesday', focus: 'Pull (Latissimus Dorsi, Trapezius, Biceps)', type: 'Strength / Hypertrophy', isRest: false },
        { day: 'Wednesday', focus: 'Active Recovery & Spinal Mobility Flow', type: 'Restoration', isRest: true },
        { day: 'Thursday', focus: 'Legs & Posterior Chain Compound Work', type: 'Lower Hypertrophy', isRest: false },
        { day: 'Friday', focus: 'Full Body Conditioning & Core Resilience', type: 'Metabolic Volume', isRest: false },
        { day: 'Saturday', focus: 'Zone-2 Steady State Cardio (8,000 steps walk)', type: 'Cardiovascular Health', isRest: true },
        { day: 'Sunday', focus: 'Full CNS & Myofascial Restoration', type: 'Rest Day', isRest: true },
      ],
      sessions: [
        {
          id: 'session-push',
          title: 'Push Power & Hypertrophy',
          day: 'Monday',
          category: 'Upper Push',
          durationMinutes: 45,
          isRestDay: false,
          warmup: [
            'Arm Circles & Cross-body shoulder swings (2 mins)',
            'Band or Bodyweight Scapular Push-ups (2 sets of 10)',
            'Wrist and Rotator Cuff warm-up rotations (2 mins)',
          ],
          cooldown: [
            'Chest doorway stretch (30s per side)',
            'Overhead triceps stretch (30s per side)',
            'Slow diaphragmatic breathing in child pose (2 mins)',
          ],
          exercises: [
            {
              name: profile.equipment === 'No equipment' ? 'Decline / Standard Push-Ups' : 'Dumbbell Floor Press / Bench Press',
              targetMuscle: 'Pectoralis Major & Triceps',
              sets: 3,
              reps: '8-12 reps',
              restSeconds: 90,
              equipment: profile.equipment,
              beginnerAlternative: 'Incline Push-ups against a sturdy table or wall',
              formCues: 'Tuck elbows at 45 degrees, squeeze chest at top, control 3-second descent.',
            },
            {
              name: profile.equipment === 'No equipment' ? 'Pike Push-ups' : 'Dumbbell Overhead Shoulder Press',
              targetMuscle: 'Anterior & Lateral Deltoids',
              sets: 3,
              reps: '10-12 reps',
              restSeconds: 90,
              equipment: profile.equipment,
              beginnerAlternative: 'Seated Dumbbell Press with light weight or resistance band press',
              formCues: 'Keep ribs pulled down, brace glutes and core, avoid excessive lumbar arching.',
            },
            {
              name: 'Bodyweight Chair / Bench Triceps Dips',
              targetMuscle: 'Triceps Brachii',
              sets: 3,
              reps: '10-15 reps',
              restSeconds: 60,
              equipment: 'Chair / Bench',
              beginnerAlternative: 'Bench dips with bent knees close to body',
              formCues: 'Keep back close to bench edge, lower until elbows reach 90 degrees.',
            },
          ],
        },
      ],
      recoveryGuidelines: [
        'Hydrate with minimum 3.5 Liters of water daily to maintain intervertebral disc hydration.',
        'Perform 5 minutes of passive hanging or lumbar decompression daily.',
        'Aim for 7 to 8 hours of uninterrupted nocturnal sleep for central nervous system restoration.',
      ],
    },
  };
}
