import React, { useState } from 'react';
import { MealCategory, NutritionItem } from '../types/fitness';
import { UserProfile, PersonalPlan } from '../types/user';
import { INDIAN_FOOD_DATABASE } from '../data/initialData';
import { ProgressionBar } from './ProgressionBar';
import { MetricChip } from './MetricChip';
import { Plus, Search, Trash2, Droplets, Utensils, Sparkles, Check, MapPin, DollarSign, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NutritionViewProps {
  mealCategories: MealCategory[];
  onUpdateMeals: (meals: MealCategory[]) => void;
  waterIntakeMl: number;
  onUpdateWater: (ml: number) => void;
  userProfile?: UserProfile;
  aiPlan?: PersonalPlan | null;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  mealCategories,
  onUpdateMeals,
  waterIntakeMl,
  onUpdateWater,
  userProfile,
  aiPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(userProfile?.dietaryPreference === 'Vegetarian');
  const [activeMealTargetId, setActiveMealTargetId] = useState<string>('breakfast');
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState<NutritionItem | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  // Daily Nutritional Targets calibrated from UserProfile or defaults
  const CALORIE_TARGET = userProfile?.dailyCalorieTarget || 2000;
  const PROTEIN_TARGET = userProfile?.dailyProteinTargetG || 145;
  const CARBS_TARGET = userProfile?.dailyCarbsTargetG || 200;
  const FAT_TARGET = userProfile?.dailyFatTargetG || 50;
  const WATER_TARGET = userProfile?.dailyHydrationTargetMl || 4000;

  // Aggregate current macro totals across all meals
  const allItems = mealCategories.flatMap((m) => m.items);
  const totalCalories = Math.round(allItems.reduce((sum, item) => sum + item.calories, 0));
  const totalProtein = Math.round(allItems.reduce((sum, item) => sum + item.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(allItems.reduce((sum, item) => sum + item.carbs, 0) * 10) / 10;
  const totalFat = Math.round(allItems.reduce((sum, item) => sum + item.fat, 0) * 10) / 10;

  // Filter food database
  const filteredFoods = INDIAN_FOOD_DATABASE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(searchQuery));
    const matchesCategory =
      selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    const matchesVeg = !vegOnlyFilter || item.isVegetarian;
    return matchesSearch && matchesCategory && matchesVeg;
  });

  const handleOpenAddModal = (mealId: string) => {
    setActiveMealTargetId(mealId);
    setSelectedFoodItem(INDIAN_FOOD_DATABASE[0]);
    setPortionMultiplier(1);
    setIsAddFoodModalOpen(true);
  };

  const handleConfirmAddFood = () => {
    if (!selectedFoodItem) return;

    const newItem = {
      id: `m-item-${Date.now()}`,
      foodId: selectedFoodItem.id,
      name: selectedFoodItem.name,
      servings: portionMultiplier,
      portionGrams: Math.round(selectedFoodItem.portionGrams * portionMultiplier),
      calories: Math.round(selectedFoodItem.calories * portionMultiplier),
      protein: Math.round(selectedFoodItem.protein * portionMultiplier * 10) / 10,
      carbs: Math.round(selectedFoodItem.carbs * portionMultiplier * 10) / 10,
      fat: Math.round(selectedFoodItem.fat * portionMultiplier * 10) / 10,
    };

    const updated = mealCategories.map((cat) => {
      if (cat.id !== activeMealTargetId) return cat;
      return {
        ...cat,
        items: [...cat.items, newItem],
      };
    });

    onUpdateMeals(updated);
    setIsAddFoodModalOpen(false);

    if (totalProtein + newItem.protein >= PROTEIN_TARGET) {
      confetti({
        particleCount: 30,
        spread: 50,
        colors: ['#A3E635', '#10B981', '#5bed8d'],
      });
    }
  };

  const handleDeleteItem = (catId: string, itemId: string) => {
    const updated = mealCategories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter((i) => i.id !== itemId),
      };
    });
    onUpdateMeals(updated);
  };

  const handleQuickWater = (amountMl: number) => {
    onUpdateWater(Math.min(6000, waterIntakeMl + amountMl));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Macro Telemetry Hub */}
      <div className="telemetry-card rounded-2xl p-5 sm:p-6 bg-[#111618]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10B981]/15 gap-3 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
                {userProfile?.fullName || 'Athlete'} · {userProfile?.dietaryPreference || 'Vegetarian'} Nutrition Architecture
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs text-[#94A3B8]">
                {userProfile?.city && userProfile.city.trim() ? `${userProfile.city}, ${userProfile.state}` : 'All-India General (City not specified)'}
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <a
                href="https://www.instagram.com/dr.monomaniac/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] text-[10px] font-mono text-[#A3E635] font-bold inline-flex items-center gap-1 transition-all"
              >
                <span>MADE BY AARAV JAKHAR</span>
                <span className="text-[9px] text-[#4ADE80]">(@dr.monomaniac)</span>
              </a>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[10px] font-mono text-[#10B981] font-semibold">
                {userProfile ? userProfile.dietaryPreference.toUpperCase() : '100% VEGETARIAN'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
              {userProfile?.primaryGoal || 'Healthy Weight Management'} & Localized Fueling
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Engineered for {userProfile?.fullName || 'Athlete'}: {CALORIE_TARGET} kcal metabolic target, {PROTEIN_TARGET}g high-BV protein floor, and {userProfile?.city ? `locally available foods in ${userProfile.city}` : 'locally available Indian whole foods (Paneer, Curd, Dal, Sattu, Roti, Chana)'} with zero imported gimmicks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddModal('breakfast')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Desi Food</span>
            </button>
          </div>
        </div>

        {/* Local Diet Personalisation Card (Requirement 6) */}
        {userProfile?.localDiet && (
          <div className="mb-6 p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/25 space-y-3">
            {!userProfile?.city && (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Local recommendations require a city. You are currently viewing a general Indian balanced nutrition plan. Update your city in My Profile to unlock regional mandi prices and local staples.
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A3E635]" />
                <span className="text-xs font-mono font-bold text-[#A3E635] uppercase">
                  {userProfile.localDiet.region} · Local Mandi Intel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[11px] font-mono text-[#4ADE80]">
                  {userProfile.dailyBudget}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {userProfile.localDiet.staples.map((staple) => (
                <span
                  key={staple}
                  className="px-2.5 py-1 rounded bg-[#182022] border border-[#10B981]/20 text-xs font-mono text-[#F8FAFC]"
                >
                  {staple}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-[#94A3B8] space-y-1 pt-1 border-t border-[#10B981]/15">
              {userProfile.localDiet.localShoppingTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#A3E635] font-bold">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Macro chips with 6px neon dot indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MetricChip
            label="Total Calories"
            value={totalCalories}
            unit={`/ ${CALORIE_TARGET} KCAL`}
            dotColor="#A3E635"
          />
          <MetricChip
            label="Protein Intake"
            value={totalProtein}
            unit={`/ ${PROTEIN_TARGET} G`}
            dotColor="#10B981"
            subLabel={`${Math.round((totalProtein / PROTEIN_TARGET) * 100)}%`}
          />
          <MetricChip
            label="Complex Carbs"
            value={totalCarbs}
            unit={`/ ${CARBS_TARGET} G`}
            dotColor="#4ADE80"
          />
          <MetricChip
            label="Healthy Lipids (Fats)"
            value={totalFat}
            unit={`/ ${FAT_TARGET} G`}
            dotColor="#ccff80"
          />
        </div>

        {/* Macro Progression Bars with glowing pulse heads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressionBar
            progressPercentage={(totalProtein / PROTEIN_TARGET) * 100}
            label="Protein Target (High Nitrogen Balance)"
            currentValue={`${totalProtein}g`}
            targetValue={`${PROTEIN_TARGET}g`}
            heightClass="h-2.5"
            showPulseHead={true}
          />
          <ProgressionBar
            progressPercentage={(totalCarbs / CARBS_TARGET) * 100}
            label="Carbohydrate Target (Muscle Glycogen)"
            currentValue={`${totalCarbs}g`}
            targetValue={`${CARBS_TARGET}g`}
            heightClass="h-2.5"
            showPulseHead={true}
          />
          <ProgressionBar
            progressPercentage={(totalFat / FAT_TARGET) * 100}
            label="Dietary Lipids (Hormone Health)"
            currentValue={`${totalFat}g`}
            targetValue={`${FAT_TARGET}g`}
            heightClass="h-2.5"
            showPulseHead={true}
          />
        </div>
      </div>

      {/* Hydration Telemetry Strip */}
      <div className="glass-panel-elevated rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#10B981]/25">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#111618] border border-[#10B981]/30 flex items-center justify-center text-[#4ADE80] shrink-0">
            <Droplets className="w-5 h-5 text-[#4ADE80]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-sm sm:text-base text-[#F8FAFC]">
                Hydration Telemetry
              </span>
              <span className="text-xs font-mono text-[#A3E635]">
                {waterIntakeMl} ml / {WATER_TARGET} ml
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Optimal cellular hydration for muscle volumization & sodium/potassium balance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => handleQuickWater(250)}
            className="px-3 py-1.5 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-mono text-[#F8FAFC] hover:border-[#4ADE80] hover:text-[#4ADE80] transition-colors"
          >
            +250 ml (1 Glass)
          </button>
          <button
            onClick={() => handleQuickWater(500)}
            className="px-3 py-1.5 rounded-lg bg-[#182022] border border-[#10B981]/30 text-xs font-mono text-[#A3E635] hover:bg-[#A3E635] hover:text-[#0A0D0E] transition-all font-semibold"
          >
            +500 ml (Shaker)
          </button>
        </div>
      </div>

      {/* Meals Breakdown & Logging List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
            Daily Nutrient Breakdown by Meal
          </h2>
          <span className="text-xs text-[#94A3B8]">
            5 Scheduled Anabolic Windows
          </span>
        </div>

        <div className="space-y-3">
          {mealCategories.map((meal) => {
            const mealCalories = Math.round(meal.items.reduce((sum, i) => sum + i.calories, 0));
            const mealProtein = Math.round(meal.items.reduce((sum, i) => sum + i.protein, 0) * 10) / 10;
            const mealCarbs = Math.round(meal.items.reduce((sum, i) => sum + i.carbs, 0) * 10) / 10;
            const mealFat = Math.round(meal.items.reduce((sum, i) => sum + i.fat, 0) * 10) / 10;

            return (
              <div
                key={meal.id}
                className="telemetry-card rounded-xl p-4 sm:p-5 bg-[#111618]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#10B981]/15 gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#10B981]/25 flex items-center justify-center text-[#A3E635]">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm text-[#F8FAFC]">
                        {meal.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {meal.timeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
                      <span className="text-[#A3E635] font-semibold">{mealProtein}g P</span>
                      <span>·</span>
                      <span>{mealCarbs}g C</span>
                      <span>·</span>
                      <span>{mealFat}g F</span>
                      <span>·</span>
                      <span className="text-[#F8FAFC] font-semibold">{mealCalories} kcal</span>
                    </div>

                    <button
                      onClick={() => handleOpenAddModal(meal.id)}
                      className="p-1.5 rounded-md bg-[#182022] border border-[#10B981]/20 text-[#A3E635] hover:border-[#A3E635] transition-colors"
                      title="Add food to this meal"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items in meal */}
                {meal.items.length === 0 ? (
                  <p className="text-xs text-[#64748B] italic py-2">
                    No items logged for this window yet. Click + to add Indian food.
                  </p>
                ) : (
                  <div className="divide-y divide-[#10B981]/10">
                    {meal.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-[#F8FAFC] block truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {item.portionGrams}g ({item.servings} serving{item.servings > 1 ? 's' : ''})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right font-mono">
                            <span className="text-[#A3E635] font-semibold">{item.protein}g P</span>
                            <span className="text-[#64748B] ml-2">{item.calories} kcal</span>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(meal.id, item.id)}
                            className="p-1 text-[#64748B] hover:text-[#ffb4ab] transition-colors"
                            title="Remove food"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal with Curated Indian Database */}
      {isAddFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl glass-panel-elevated p-6 border border-[#10B981]/30 shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#10B981]/15 mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  Add Indian Nutrition Item
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Select verified high-bioavailability staples from the database
                </p>
              </div>
              <button
                onClick={() => setIsAddFoodModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#ffb4ab] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Indian foods (e.g. Sattu, Paneer, Tikka, Dal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 pl-9 pr-4 py-2 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              {/* Segmented filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    vegOnlyFilter
                      ? 'bg-[#10B981] text-[#0A0D0E] font-bold'
                      : 'bg-[#111618] text-[#94A3B8] border border-[#10B981]/20 hover:text-[#F8FAFC]'
                  }`}
                >
                  🌱 Pure Veg Only
                </button>
                {['All', 'Vegetarian High-Protein', 'Dairy & Soya', 'Lentils & Pulses', 'Non-Veg Protein', 'Grains & Carbs'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#A3E635] text-[#0A0D0E] font-semibold'
                        : 'bg-[#111618] text-[#94A3B8] border border-[#10B981]/20 hover:text-[#F8FAFC]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Selection Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4 min-h-[220px]">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#94A3B8]">
                  No items match search. Try searching "Paneer", "Sattu", or "Chicken".
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const isSelected = selectedFoodItem?.id === food.id;
                  return (
                    <button
                      key={food.id}
                      onClick={() => setSelectedFoodItem(food)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#182022] border-[#A3E635] shadow-[0_0_15px_-3px_rgba(163,230,53,0.2)]'
                          : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-display font-semibold text-sm text-[#F8FAFC]">
                            {food.name}
                          </span>
                          {food.hindiName && (
                            <span className="text-[11px] text-[#A3E635] font-normal">
                              ({food.hindiName})
                            </span>
                          )}
                          {food.isVegetarian ? (
                            <span className="text-[10px] text-[#4ADE80] border border-[#4ADE80]/30 px-1 rounded">
                              VEG
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#ffb4ab] border border-[#ffb4ab]/30 px-1 rounded">
                              NON-VEG
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          {food.servingSize} · {food.highlight}
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-xs">
                        <div className="text-[#A3E635] font-bold">{food.protein}g P</div>
                        <div className="text-[#64748B] text-[11px]">{food.calories} kcal</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Serving / Multiplier Controls & Confirm */}
            {selectedFoodItem && (
              <div className="pt-4 border-t border-[#10B981]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-[#94A3B8]">Portion:</span>
                  <div className="flex items-center gap-1.5">
                    {[0.5, 1, 1.5, 2].map((m) => (
                      <button
                        key={m}
                        onClick={() => setPortionMultiplier(m)}
                        className={`px-2.5 py-1 rounded text-xs font-mono ${
                          portionMultiplier === m
                            ? 'bg-[#A3E635] text-[#0A0D0E] font-bold'
                            : 'bg-[#111618] text-[#94A3B8] border border-[#10B981]/20'
                        }`}
                      >
                        {m}x
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[#F8FAFC] ml-1">
                    ({Math.round(selectedFoodItem.portionGrams * portionMultiplier)}g)
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsAddFoodModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAddFood}
                    className="px-5 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Log to Meal</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
