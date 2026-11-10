import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const port = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Multi-turn Gemini Chat Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, model, role, userTelemetry } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        return res.status(503).json({
          error:
            'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in the environment secrets.',
        });
      }

      // Role-specific system instructions
      const roleInstructions: Record<string, string> = {
        sports_scientist: `You are Dr. Auramorph, an elite Sports Scientist and Biomechanical Engineer representing AURAMORPH (Transform Your Habits. Elevate Your Potential). You specialize in hypertrophy, progressive overload, mechanical tension, motor unit recruitment, and exercise kinematics. Provide concise, high-density scientific explanations with actionable guidance. Maintain professional athletic coaching authority.`,
        indian_nutrition: `You are the Lead Sports Nutritionist at AURAMORPH specializing in Indian nutritional science. You specialize in maximizing bioavailability of vegetarian proteins (soya chunks, low-fat paneer, sprouted moong, sattu, dal, dahi) and lean non-veg items (tandoori chicken, egg whites). You calculate leucine thresholds (>=2.7g/meal) and solve digestive comfort (ajwain, hing, digestion pacing). Provide concrete meal macros and practical kitchen tips.`,
        recovery_cns: `You are the Neuromuscular Recovery & Circadian Specialist at AURAMORPH. You analyze sleep architecture (deep and REM phases), resting heart rate, autonomic balance, lumbar decompression routines, and electrolyte hydration (sodium/potassium/magnesium balance). Advise when to push or deload.`,
        transformation_coach: `You are the AURAMORPH Transformation Head Coach. You focus on aggressive consistency, caloric deficit/surplus calibration, adherence under pressure, and physique milestone tracking without metabolic slowdown.`
      };

      let systemInstruction = roleInstructions[role] || roleInstructions.sports_scientist;

      // Append live telemetry context if provided
      if (userTelemetry) {
        systemInstruction += `\n\nAthlete Live Telemetry Context:
- Active Streak: ${userTelemetry.streakDays ?? 14} days
- Body Weight: ${userTelemetry.weightKg ?? 77.0} kg
- Target Protein: ${userTelemetry.proteinTarget ?? 160}g (Current Logged: ${userTelemetry.currentProtein ?? 118.5}g)
- Hydration: ${userTelemetry.currentHydrationMl ?? 3250}ml / ${userTelemetry.hydrationTargetMl ?? 4000}ml
- Movement Burn: ${userTelemetry.currentMovementKcal ?? 440} kcal
- Neuromuscular Readiness Score: ${userTelemetry.recoveryScore ?? 91}/100`;
      }

      // Select valid model according to task:
      // gemini-4-argon for complex tasks, gemini-3.8-flash for general tasks, gemini-3.1-flash-lite for fast tasks
      const validModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
      const selectedModel = validModels.includes(model) ? model : 'gemini-3.8-flash';

      // Format previous history for chat contents
      const formattedContents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history) {
          if (item.text && item.role) {
            formattedContents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Append current message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      const responseText = response.text || 'No response returned from model.';

      return res.json({
        text: responseText,
        modelUsed: selectedModel,
        roleUsed: role || 'sports_scientist',
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      const status = err.status || 500;
      const errorMessage = err.message || 'Error processing request with Gemini';
      return res.status(status).json({
        error: errorMessage,
      });
    }
  });

  // AI-Powered Personalised Diet and Training Plan Generator
  app.all(['/api/generate-personal-plan', '/api/generate-personal-plan/'], async (req, res) => {
    try {
      const userProfile = req.body?.profile || {};

      const {
        fullName = 'Athlete',
        age = 22,
        country = 'India',
        state = '',
        city = '',
        locality = '',
        currentWeightKg = 98.0,
        targetWeightKg = 82.0,
        currentHeightCm = 178,
        desiredHeightCm = 178,
        primaryGoal = 'Healthy Weight Management',
        experienceLevel = 'Beginner',
        equipment = 'Dumbbells',
        dietaryPreference = 'Vegetarian',
        allergies = [],
        dislikedFoods = [],
        dailyBudget = 'Budget Friendly (₹120–250/day)',
        mealsPerDay = 3,
        regularFoods = [],
      } = userProfile;

      const hasCity = Boolean(city && city.trim());
      const hasState = Boolean(state && state.trim());
      const locationText = hasCity
        ? `${locality && locality.trim() ? locality.trim() + ', ' : ''}${city.trim()}${hasState ? ', ' + state.trim() : ''}, ${country}`
        : 'All-India General (City not specified by user)';

      const isHeightGoal = desiredHeightCm > currentHeightCm;
      const isTeenager = age < 18;

      // Construct high-precision sports nutrition and exercise prompt
      const prompt = `You are the Chief Exercise Physiologist and Sports Nutritionist for AURAMORPH - Transform Your Habits. Elevate Your Potential.
Analyze this user profile and generate a comprehensive, highly personalized diet and training plan.

USER BIOMETRIC & LIFESTYLE DOSSIER:
- Name: ${fullName}
- Age: ${age} years (${isTeenager ? 'Teenager (Under 18)' : 'Adult (18+)'})
- Location: ${locationText}
- Current Weight: ${currentWeightKg} kg
- Target Weight: ${targetWeightKg} kg (Net Delta: ${(targetWeightKg - currentWeightKg).toFixed(1)} kg)
- Current Height: ${currentHeightCm} cm
- Desired Height: ${desiredHeightCm} cm ${isHeightGoal ? '(User desires height improvement)' : ''}
- Primary Fitness Goal: ${primaryGoal}
- Experience Level: ${experienceLevel}
- Available Equipment: ${equipment}
- Dietary Preference: ${dietaryPreference}
- Known Food Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None reported'}
- Disliked Foods: ${dislikedFoods.length > 0 ? dislikedFoods.join(', ') : 'None'}
- Daily Food Budget: ${dailyBudget}
- Preferred Meal Frequency: ${mealsPerDay} meals per day
- Regular Foods Consumed: ${regularFoods.length > 0 ? regularFoods.join(', ') : 'Roti, Dal, Rice, Sabzi, Curd'}

CRITICAL GUIDELINES:
1. AGE-BASED PERSONALIZATION (TWO AGE GROUPS):
   ${isTeenager ? `* TEENAGER PROTOCOL (UNDER 18 YEARS):
     - Focus strictly on healthy natural development, foundational fitness, athletic strength, mobility, and overall wellness.
     - Provide age-appropriate exercise routines: bodyweight calisthenics, movement skills, spinal decompression, posture alignment, and safe athletic conditioning.
     - NEVER recommend extreme weight loss, restrictive diets, or calorie-deficit challenges. Caloric target MUST be maintenance or a gentle healthy growth surplus.
     - Encourage wholesome, balanced Indian meals rich in calcium and protein: whole milk, curd, paneer, chana, dal, ragi, and fresh seasonal green vegetables.
     - Include parental/guardian guidance where appropriate.
     - NEVER promise guaranteed weight or height changes.` : `* ADULT PROTOCOL (18+ YEARS):
     - Provide personalized fitness, nutrition, and workout guidance based strictly on the user's specific goals (${primaryGoal}).
     - Progressive resistance training, metabolic conditioning, and tailored macronutrient partitioning.`}

2. DIET PERSONALISATION & LOCATION INTEGRITY:
   - Regional Foods & Location Discipline:
     ${hasCity ? `The user is located in ${city.trim()}${hasState ? ', ' + state.trim() : ''}. You MUST recommend affordable, culturally authentic foods and agricultural staples commonly available in local markets (mandis and kirana stores) in ${city.trim()}${hasState ? ', ' + state.trim() : ''}. Never assume or invent another location.` : `The user skipped their city/location. DO NOT assume or invent a location. Offer a well-balanced, general Indian diet plan utilizing nationally ubiquitous, affordable staples (such as whole wheat roti, yellow toor/moong dal, homemade curd/dahi, low-fat paneer/soya chunks, seasonal sabzi, and steamed rice). You MUST explicitly state in the summary and safety notes: "Local recommendations require a city. You are currently viewing a general Indian balanced nutrition plan. Please add your city in My Profile anytime to unlock regional mandi prices and local staples."`}
   - Budget Discipline: Keep the total daily estimated food cost strictly within the user's budget tier (${dailyBudget}).
   - Safety First: Absolutely NO extreme starvation (for adults, deficit should be a sustainable 300-500 kcal; for teenagers, ZERO deficit), safe protein intake (1.4g - 1.8g per kg target weight), balanced micronutrients.
   - Respect Meal Frequency: Provide exactly ${mealsPerDay} meals (e.g., Breakfast, Lunch, Dinner${mealsPerDay > 3 ? ', plus designated healthy snacks' : ''}).

3. WORKOUT PERSONALISATION:
   - Calibrated strictly for ${experienceLevel} level and equipment (${equipment}).
   - Progressive overload parameters, realistic sets and repetitions, rest intervals.
   - Include Warm-up protocols, Cool-down mobility, Rest/Recovery days.
   - Provide beginner-friendly exercise alternatives for every major movement.

4. HEIGHT & HEALTHY GROWTH GUIDANCE:
   - ${isHeightGoal || isTeenager ? `Address height improvement scientifically: Explain unequivocally that final adult height is genetically regulated through long-bone epiphyseal growth plates which fuse after puberty (typically ages 16-21). State clearly that exercises, stretches, or pills cannot increase bone length once plates have fused. For growing teens, provide guidance on adequate sleep (8-10 hours for growth hormone synthesis), calcium/Vitamin D3, spinal posture, and recommend consulting a physician or pediatric endocrinologist for clinical growth evaluation.` : `Briefly note that adult height is genetically predetermined and maintained with optimal spinal decompression and core posture.`}

OUTPUT FORMAT:
Return valid, parseable JSON conforming to this schema without markdown fences:
{
  "summary": "string - 2-3 sentence executive scientific summary of the plan",
  "heightGuidance": "string - science-based height and growth plate advice",
  "dietPlan": {
    "dailyCalorieTarget": number,
    "dailyProteinG": number,
    "dailyCarbsG": number,
    "dailyFatG": number,
    "estimatedDailyCostInr": number,
    "meals": [
      {
        "mealName": "string (e.g. Breakfast / Lunch / Evening Snack / Dinner)",
        "time": "string (e.g. 8:30 AM)",
        "items": [
          {
            "name": "string (e.g. Paneer Bhurji with Whole Wheat Roti)",
            "quantity": "string (e.g. 100g low-fat paneer + 2 medium rotis)",
            "calories": number,
            "proteinG": number,
            "costEstInr": number,
            "notes": "string (e.g. High leucine bioavailability, cooked with minimal mustard oil)"
          }
        ],
        "approxCalories": number,
        "approxProteinG": number
      }
    ],
    "proteinSources": [
      {
        "food": "string",
        "proteinPerServing": "string",
        "affordability": "string"
      }
    ],
    "localAlternatives": [
      {
        "original": "string",
        "localReplacement": "string",
        "benefit": "string"
      }
    ],
    "safetyNotes": ["string"]
  },
  "workoutPlan": {
    "experienceLevel": "${experienceLevel}",
    "weeklyFrequency": number,
    "schedule": [
      { "day": "string (e.g. Monday)", "focus": "string", "type": "string", "isRest": boolean }
    ],
    "sessions": [
      {
        "id": "string",
        "title": "string",
        "day": "string",
        "category": "string",
        "durationMinutes": number,
        "isRestDay": boolean,
        "warmup": ["string"],
        "cooldown": ["string"],
        "exercises": [
          {
            "name": "string",
            "targetMuscle": "string",
            "sets": number,
            "reps": "string",
            "restSeconds": number,
            "equipment": "string",
            "beginnerAlternative": "string",
            "formCues": "string"
          }
        ]
      }
    ],
    "recoveryGuidelines": ["string"]
  }
}`;

      if (ai) {
        try {
          console.log('[AURAMORPH] Initiating plan generation with Gemini 3.8 Flash for', locationText);
          const geminiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API call timed out after 15s')), 15000)
          );

          const response = await Promise.race([geminiPromise, timeoutPromise]);
          const rawText = response.text || '';
          const cleanedText = rawText.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
          const parsedPlan = JSON.parse(cleanedText);

          console.log('[AURAMORPH] Successfully generated AI plan with Gemini 3.8 Flash');
          return res.json({
            success: true,
            plan: {
              id: `plan-${Date.now()}`,
              userId: userProfile.id || 'current-user',
              createdAt: new Date().toISOString(),
              ...parsedPlan,
            },
            source: 'gemini-3.8-flash',
          });
        } catch (geminiErr) {
          console.error('Gemini generation failed, falling back to precision rules generator:', geminiErr);
        }
      }

      // Rule-based high-precision fallback generator
      const fallbackPlan = generateRuleBasedPlan(userProfile);
      return res.json({
        success: true,
        plan: fallbackPlan,
        source: 'precision-engine',
      });
    } catch (err: any) {
      console.error('Plan generation endpoint error:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate personal plan' });
    }
  });

  // Scientific fallback generator helper
  function generateRuleBasedPlan(profile: any) {
    const isLoss = profile.targetWeightKg < profile.currentWeightKg;
    const targetCalories = isLoss ? Math.max(1600, Math.round(profile.currentWeightKg * 22)) : Math.round(profile.currentWeightKg * 30);
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
      : `a general Indian balanced nutrition protocol (Note: Local recommendations require a city; please add your city in My Profile anytime to unlock regional mandi prices)`;

    return {
      id: `plan-${Date.now()}`,
      userId: profile.id || 'user-1',
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
          {
            id: 'session-pull',
            title: 'Pull Strength & Scapular Control',
            day: 'Tuesday',
            category: 'Upper Pull',
            durationMinutes: 45,
            isRestDay: false,
            warmup: [
              'Cat-Cow spinal waves (10 cycles)',
              'Band pull-aparts or prone Y-T-W raises (2 sets of 12)',
              'Shoulder dislocations with broomstick or towel (10 reps)',
            ],
            cooldown: [
              'Dead hang or table lat stretch (45s)',
              'Biceps wall stretch (30s per side)',
              'Spinal decompression deep breathing (2 mins)',
            ],
            exercises: [
              {
                name: profile.equipment === 'No equipment' ? 'Inverted Table Rows / Doorframe Rows' : 'Dumbbell Bent-Over Row',
                targetMuscle: 'Latissimus Dorsi & Rhomboids',
                sets: 3,
                reps: '10-12 reps',
                restSeconds: 90,
                equipment: profile.equipment,
                beginnerAlternative: 'Single-arm supported dumbbell row on knee',
                formCues: 'Hinge at hips with flat spine, pull towards hip crease, squeeze shoulder blades.',
              },
              {
                name: 'Prone Cobra / Floor Hyper-Extensions',
                targetMuscle: 'Erector Spinae & Mid-Back',
                sets: 3,
                reps: '12-15 reps',
                restSeconds: 60,
                equipment: 'Floor / Mat',
                beginnerAlternative: 'Bird-Dog alternating extensions',
                formCues: 'Lift chest gently using upper back musculature, avoid neck straining.',
              },
              {
                name: profile.equipment === 'No equipment' ? 'Towel Bicep Curls (Isometrics)' : 'Dumbbell Hammer Curls',
                targetMuscle: 'Biceps Brachii & Brachioradialis',
                sets: 3,
                reps: '12 reps',
                restSeconds: 60,
                equipment: profile.equipment,
                beginnerAlternative: 'Light resistance band bicep curls',
                formCues: 'Lock elbows by your sides, slow 2-second eccentric lowering phase.',
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

  // Prevent any API request from falling through to Vite/SPA HTML fallback
  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
