import { PostureExercise, GrowthScheduleItem, GrowthGuidelineItem, GrowthSpurtEducationalFact } from '../types/growth';

export const POSTURE_EXERCISES: PostureExercise[] = [
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    sanskritName: 'Marjaryasana & Bitilasana',
    category: 'Spine Decompression',
    youtubeVideoId: 'v7AYKMP6rOE', // Yoga with Adriene - Cat Cow
    videoChannel: 'Yoga With Adriene',
    durationOrReps: '10–12 slow synchronized breaths (2–3 mins)',
    targetArea: 'Cervical, thoracic, and lumbar spine mobility, pelvis tilt',
    suitableAgeRange: 'All ages (Teenagers 12+ & Adults)',
    difficulty: 'Gentle',
    benefits: [
      'Relieves compression between vertebral discs',
      'Encourages proper natural spinal curvature',
      'Improves circulation to spinal nerves and muscles',
      'Eases stiffness from prolonged studying or screen desk time'
    ],
    stepByStepInstructions: [
      'Begin on all fours on a padded mat with hands directly under shoulders and knees directly under hips.',
      'Inhale slowly as you drop your belly toward the mat, gently lifting your chest and tailbone (Cow Pose).',
      'Exhale deeply while arching your spine toward the ceiling, tucking your tailbone and releasing your neck (Cat Pose).',
      'Move fluidly with your breath, never forcing end-ranges or straining your cervical neck.'
    ],
    safetyPrecautions: [
      'Keep shoulders pulled away from ears.',
      'Avoid hyperextending your lower back if you feel pinching.',
      'If you have sensitive wrists, make fists or rest on forearms.'
    ]
  },
  {
    id: 'cobra-pose',
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    category: 'Thoracic Mobility',
    youtubeVideoId: 'fOdrW7nf9gw', // Yoga With Adriene - Cobra Pose
    videoChannel: 'Yoga With Adriene',
    durationOrReps: '3 sets of 20–30 second holds',
    targetArea: 'Thoracic spine extension, anterior chest opening, erector spinae',
    suitableAgeRange: 'All ages (Teenagers 12+ & Adults)',
    difficulty: 'Beginner',
    benefits: [
      'Reverses slouching and forward-rolled shoulder posture',
      'Strengthens deep spinal stabilizer muscles',
      'Expands lung capacity and diaphragmatic breathing'
    ],
    stepByStepInstructions: [
      'Lie face down on the mat with legs extended straight behind you, tops of the feet pressing gently into the floor.',
      'Place your palms flat on the mat directly beneath your shoulders, hugging elbows close to your torso.',
      'Press through pubic bone and slowly engage your upper back to peel your chest off the floor using back muscles, not just arm pressure.',
      'Maintain a neutral neck looking slightly forward and down; hold for 20-30 seconds with calm breaths.'
    ],
    safetyPrecautions: [
      'Do not push all the way up if your lower back pinches.',
      'Engage glutes gently to stabilize the sacrum.',
      'Avoid locking your elbows.'
    ]
  },
  {
    id: 'childs-pose',
    name: 'Child’s Pose',
    sanskritName: 'Balasana',
    category: 'Spine Decompression',
    youtubeVideoId: '2MJGg-dUKh0', // Yoga With Adriene - Child's Pose
    videoChannel: 'Yoga With Adriene',
    durationOrReps: 'Hold for 1–3 minutes with deep belly breathing',
    targetArea: 'Spine lengthening, latissimus dorsi, hip flexion, parasympathetic relaxation',
    suitableAgeRange: 'All ages (Teenagers & Adults)',
    difficulty: 'Gentle',
    benefits: [
      'Gently decompresses the entire vertebral column',
      'Lengthens the lat muscles that pull the shoulders forward',
      'Lowers cortisol and promotes nervous system rest essential for growth hormone release'
    ],
    stepByStepInstructions: [
      'Kneel on the mat, bring your big toes together and separate your knees hips-distance or mat-width apart.',
      'Exhale and fold your torso forward between your thighs.',
      'Extend your arms long in front of you with palms flat on the floor, or rest arms back alongside your torso.',
      'Rest your forehead gently on the mat, breathing deeply into your back ribs.'
    ],
    safetyPrecautions: [
      'Place a cushion or folded blanket under knees or under hips if knee flexion feels tight.',
      'Do not strain your shoulders; keep them relaxed away from your neck.'
    ]
  },
  {
    id: 'mountain-pose',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    category: 'Postural Alignment',
    youtubeVideoId: 'g_tea8ZNk5A', // Yoga With Adriene - Mountain Pose
    videoChannel: 'Yoga With Adriene',
    durationOrReps: 'Hold for 60–90 seconds, repeated 3 times daily',
    targetArea: 'Axial elongation, foot arches, kinetic chain alignment, postural proprioception',
    suitableAgeRange: 'All ages (Essential for teenagers forming posture habits)',
    difficulty: 'Beginner',
    benefits: [
      'Teaches the nervous system the sensation of true vertical spinal alignment',
      'Distributes body weight evenly across all four corners of both feet',
      'Helps reclaim 1–2 cm of height lost to habitual slumping'
    ],
    stepByStepInstructions: [
      'Stand upright with feet hip-width apart or big toes touching, spreading toes wide to ground firmly.',
      'Stack your joints: ankles, knees, hips, shoulders, and ears aligned vertically.',
      'Engage quadriceps lightly, draw the navel gently toward the spine, and roll shoulders back and down.',
      'Imagine a light thread gently pulling the crown of your head toward the sky, elongating the back of your neck.'
    ],
    safetyPrecautions: [
      'Do not lock your knees back; keep a soft micro-bend.',
      'Avoid flaring your lower ribcage or tilting pelvis anteriorly.'
    ]
  },
  {
    id: 'downward-dog',
    name: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'Spine Decompression',
    youtubeVideoId: 'ECbpe821r04', // Yoga With Adriene - Downward Dog
    videoChannel: 'Yoga With Adriene',
    durationOrReps: 'Hold for 5–8 slow breaths, 2–3 rounds',
    targetArea: 'Posterior kinetic chain, calves, hamstrings, latissimus dorsi, spinal traction',
    suitableAgeRange: 'All ages (Teenagers 12+ & Adults)',
    difficulty: 'Beginner',
    benefits: [
      'Produces natural gravity-assisted axial decompression along the spine',
      'Stretches tight hamstrings and calves that cause pelvic tilt',
      'Builds foundational shoulder stabilizer strength'
    ],
    stepByStepInstructions: [
      'From hands and knees, tuck your toes and lift your knees off the mat.',
      'Send your sitting bones up and back toward where the wall meets the ceiling, creating an inverted V shape.',
      'Press firmly through your palms and fingertips, rotating inner elbows slightly toward each other.',
      'Keep knees softly bent if hamstrings are tight so that your spine remains straight and long.'
    ],
    safetyPrecautions: [
      'Prioritize a long, flat spine over forcing heels to touch the mat.',
      'Distribute weight evenly so wrists do not bear the entire load.'
    ]
  },
  {
    id: 'standing-side-stretch',
    name: 'Standing Side Stretch',
    sanskritName: 'Tiryak Tadasana',
    category: 'Thoracic Mobility',
    youtubeVideoId: 'U8CZZC_2bLg', // Lateral flexion stretch
    videoChannel: 'Tone and Tighten / Physical Therapy',
    durationOrReps: 'Hold 25–30 seconds per side, 2 rounds',
    targetArea: 'Quadratus lumborum, obliques, intercostal rib cage muscles, lats',
    suitableAgeRange: 'All ages',
    difficulty: 'Beginner',
    benefits: [
      'Expands intercostal spaces between ribs to improve thoracic mobility',
      'Releases asymmetrical tightness from carrying heavy backpacks on one shoulder',
      'Enhances natural lateral spinal flexibility'
    ],
    stepByStepInstructions: [
      'Stand tall in Mountain Pose with feet grounded hip-width apart.',
      'Inhale and reach both arms overhead, clasping your left wrist with your right hand.',
      'Exhale and gently lean your torso toward the right side, anchoring both feet evenly into the floor.',
      'Feel the deep, soothing stretch through your left ribs and side body; hold for 25 seconds, switch sides.'
    ],
    safetyPrecautions: [
      'Do not twist or rotate your chest down toward the floor; keep chest facing forward.',
      'Avoid collapsing into the compressed side.'
    ]
  },
  {
    id: 'gentle-hamstring-stretch',
    name: 'Gentle Hamstring & Pelvic Stretch',
    sanskritName: 'Supta Padangusthasana Variation',
    category: 'Core & Pelvis',
    youtubeVideoId: '2_eTq5iF3nI', // AskDoctorJo - Safe Hamstring Stretches
    videoChannel: 'AskDoctorJo (Physical Therapist)',
    durationOrReps: '30–45 seconds per leg, 2 sets',
    targetArea: 'Hamstrings, sacrotuberous ligament, posterior pelvic tilt correction',
    suitableAgeRange: 'All ages',
    difficulty: 'Gentle',
    benefits: [
      'Relieves posterior pelvic tilt that forces the lumbar spine to flatten or hunch',
      'Prevents lower-back strain during growth spurts',
      'Promotes balanced hip and leg alignment'
    ],
    stepByStepInstructions: [
      'Lie flat on your back on a comfortable exercise mat with both knees bent and feet flat on the floor.',
      'Loop a towel or strap around the ball of your right foot, holding the ends with both hands.',
      'Slowly straighten your right leg toward the ceiling until you feel a gentle, warm stretch down the back of your thigh.',
      'Keep your head, shoulders, and lower back resting flat and relaxed on the mat; hold for 30-45 seconds, then repeat on left.'
    ],
    safetyPrecautions: [
      'Never bounce or jerk the leg.',
      'Stop if you feel tingling or numbness behind the knee; keep a slight knee micro-bend.'
    ]
  },
  {
    id: 'thoracic-extension',
    name: 'Thoracic Extension & Foam Roller Release',
    category: 'Thoracic Mobility',
    youtubeVideoId: 'pU67W75V0bY', // Physical therapy thoracic extension
    videoChannel: 'Bob & Brad (Physical Therapists)',
    durationOrReps: '8–10 gentle extensions or 60 seconds with towel roll',
    targetArea: 'Mid-back (T1–T12 thoracic vertebrae), pectoral fascia',
    suitableAgeRange: 'Teenagers 13+ & Adults',
    difficulty: 'Gentle',
    benefits: [
      'Combats excessive kyphosis (the rounded upper-back "tech neck" hump)',
      'Directly restores natural vertical height lost to habitual hunching',
      'Increases thoracic extension needed for calisthenics and athletic performance'
    ],
    stepByStepInstructions: [
      'Place a rolled bath towel or soft foam roller horizontally across your mid-back while seated on the floor.',
      'Lie back so your mid-back rests comfortably on the roll, with knees bent and feet flat on the floor.',
      'Interlace fingers behind your neck to gently support your head.',
      'Slowly drape your upper spine over the roll on an exhale, feeling the mid-chest expand upward; repeat for 8 gentle repetitions.'
    ],
    safetyPrecautions: [
      'Do not place the roller on your lower back (lumbar spine) or neck.',
      'Keep your head supported by your hands throughout the exercise.'
    ]
  },
  {
    id: 'wall-posture-exercise',
    name: 'Wall Posture & Wall Angels',
    category: 'Postural Alignment',
    youtubeVideoId: 'k1Zp29R0fFE', // Wall Angels & Posture
    videoChannel: 'Jeremy Ethier',
    durationOrReps: '2 sets of 10–12 smooth repetitions against a flat wall',
    targetArea: 'Lower trapezius, rhomboids, deep cervical flexors, scapular retraction',
    suitableAgeRange: 'All ages (Crucial for teenage desk and screen posture)',
    difficulty: 'Beginner',
    benefits: [
      'Rewires postural neuromuscular control against a vertical flat reference',
      'Strengthens mid-back muscles that keep you standing tall all day without fatiguing',
      'Immediately opens the chest and aligns the cervical spine'
    ],
    stepByStepInstructions: [
      'Stand with your heels, glutes, upper back, and back of your head resting flat against an empty wall.',
      'Tuck your chin slightly so the back of your neck feels long (avoid looking up).',
      'Bend elbows at 90 degrees in a "goalpost" position against the wall at shoulder height.',
      'Slowly slide your forearms and back of your hands upward along the wall without letting your lower back arch excessively off the wall.',
      'Glide back down smoothly to starting position for 10 controlled reps.'
    ],
    safetyPrecautions: [
      'If your hands or head cannot touch the wall without arching your back, move your feet 2–3 inches away from the wall.',
      'Do not hold your breath during the movement.'
    ]
  },
  {
    id: 'yoga-mobility-flow',
    name: 'Full Body Mobility Flow (Surya Namaskar)',
    sanskritName: 'Surya Namaskar (Gentle Sun Salutation)',
    category: 'Spine Decompression',
    youtubeVideoId: '6IUxflOC3Xo', // Gentle Sun Salutation flow
    videoChannel: 'Ventuno Yoga',
    durationOrReps: '3–5 gentle cycles (5–8 mins every morning)',
    targetArea: 'Entire kinetic chain: spine, hips, shoulders, chest, hamstrings',
    suitableAgeRange: 'All ages (Great morning routine for teenagers & adults)',
    difficulty: 'Beginner',
    benefits: [
      'Warms up synovial joint fluid across all 24 articulating vertebrae',
      'Coordinates rhythmic breathing with continuous spinal elongation',
      'Provides a consistent, energizing morning wellness anchor'
    ],
    stepByStepInstructions: [
      'Start in Mountain Pose (Pranamasana) with hands in prayer at chest center.',
      'Inhale: sweep arms overhead into gentle Hastauttanasana, lifting through the sternum.',
      'Exhale: hinge at hips into Padahastasana (forward fold with knees softly bent).',
      'Step right foot back into equestrian pose (Ashwa Sanchalanasana), opening hips.',
      'Transition through plank to Ashtanga Namaskar, then glide forward into gentle Cobra Pose.',
      'Push up and back into Downward Dog, then step forward to complete the cycle.'
    ],
    safetyPrecautions: [
      'Never force sudden stretches when muscles are cold.',
      'Bend knees as much as needed during forward folds.'
    ]
  }
];

export const DAILY_GROWTH_SCHEDULE: GrowthScheduleItem[] = [
  {
    id: 'sch-1',
    timeWindow: '06:30 AM – 07:30 AM',
    title: 'Morning Sunlight, Hydration & Mobility',
    category: 'Activity & Sunshine',
    description: 'Kickstart circadian alignment and synthesize natural Vitamin D for calcium absorption.',
    recommendedActions: [
      'Drink 400–500 ml room temperature water to rehydrate spinal discs after 8 hours of sleep.',
      'Spend 15–20 minutes in morning outdoor sunlight (7:00 AM – 9:00 AM) to synthesize natural Vitamin D3.',
      'Complete 5 minutes of Cat-Cow and gentle Mountain Pose posture elongation.'
    ],
    scientificReason: 'Vertebral discs rehydrate and decompress when hydrated. Sunlight activates 7-dehydrocholesterol into active Vitamin D3, which is biologically required for calcium deposition into long bones.',
    isTeenagerFocused: true
  },
  {
    id: 'sch-2',
    timeWindow: '08:00 AM – 09:00 AM',
    title: 'Nourishing Indian Growth Breakfast',
    category: 'Nutrition',
    description: 'Deliver rich bioavailable protein, calcium, and complex carbs to fuel morning activity.',
    recommendedActions: [
      '200 ml boiled cow milk or fortified curd with almonds and walnuts.',
      'Paneer bhurji (75g) or 2 boiled eggs with 2 whole wheat rotis or vegetable oats porridge.',
      'Include 1 seasonal whole fruit (banana, orange, or papaya).'
    ],
    scientificReason: 'Bone matrix is over 50% protein by volume (type 1 collagen). Adequate morning amino acids prevent muscle breakdown and supply building blocks for cartilage growth.',
    isTeenagerFocused: true
  },
  {
    id: 'sch-3',
    timeWindow: '01:00 PM – 02:00 PM',
    title: 'Balanced Indian Lunch & Desk Ergonomics',
    category: 'Nutrition',
    description: 'Sustain continuous macronutrient delivery while actively breaking prolonged study/sitting slumps.',
    recommendedActions: [
      '2 warm rotis or brown rice, 1 bowl dal (moong/chana/toor), 1 cup green seasonal sabzi (spinach, methi, bhindi), fresh cucumber-tomato salad.',
      'Sit with hips against back of chair, feet flat on floor, and computer/book at eye level.',
      'Do 1 minute of Wall Angels or Thoracic Extensions after sitting for 2 hours.'
    ],
    scientificReason: 'Prolonged slumped sitting compresses intervertebral discs by up to 1.5 cm by afternoon. Intermittent posture resets restore disc height.',
    isTeenagerFocused: false
  },
  {
    id: 'sch-4',
    timeWindow: '04:30 PM – 06:00 PM',
    title: 'Outdoor Active Play, Sports & Calisthenics',
    category: 'Activity & Sunshine',
    description: 'Engage in dynamic weight-bearing activity that stimulates bone mineral density and growth plates.',
    recommendedActions: [
      '45–60 minutes of enjoyable physical activity: basketball, badminton, swimming, football, cycling, or calisthenics (pull-ups, push-ups, hanging).',
      'Pre-workout light snack: 1 banana with 1 handful roasted chana (gram).',
      'Drink plenty of clean water before, during, and after play.'
    ],
    scientificReason: 'Dynamic impact and multi-directional forces apply piezo-electric stimulation across epiphyseal growth plates, signaling osteoblasts to lay down healthy bone matrix.',
    isTeenagerFocused: true
  },
  {
    id: 'sch-5',
    timeWindow: '07:30 PM – 08:30 PM',
    title: 'Nourishing Dinner & Calming Wind-Down',
    category: 'Nutrition',
    description: 'Supply slow-digesting nutrients to repair tissues during the overnight restorative window.',
    recommendedActions: [
      'Light, nutritious dinner: Khichdi with ghee, or dal-roti with paneer or chicken, plus a warm vegetable soup.',
      'Avoid heavy fried foods or caffeine after 5 PM.',
      'Turn off high-intensity blue light screens (phones/tablets) 45 minutes before sleeping.'
    ],
    scientificReason: 'Melatonin secretion peaks when blue light is extinguished, signaling the pituitary gland for optimal overnight endocrine cycling.',
    isTeenagerFocused: false
  },
  {
    id: 'sch-6',
    timeWindow: '09:30 PM – 10:30 PM',
    title: 'Consistent 8–10 Hour Deep Sleep Window',
    category: 'Sleep',
    description: 'The single most vital window for human growth hormone (HGH) secretion in adolescents.',
    recommendedActions: [
      'Aim for 8.5 to 10 hours for teenagers (7.5 to 8.5 hours for adults).',
      'Drink 1 cup of warm turmeric milk (haldi doodh) 30 minutes before bed.',
      'Sleep on a medium-firm mattress with a supportive pillow that keeps the neck in neutral alignment.'
    ],
    scientificReason: 'Over 60–75% of daily pulsatile Human Growth Hormone (HGH) is released during Stage 3 and Stage 4 deep Slow-Wave Sleep (SWS), primarily between 10:00 PM and 2:00 AM.',
    isTeenagerFocused: true
  }
];

export const DAILY_DOS: GrowthGuidelineItem[] = [
  {
    id: 'do-1',
    title: 'Eat balanced and nutritious meals',
    summary: 'Adequate protein, calcium and vitamin D through wholesome food.',
    details: 'Bones consist of an organic collagen matrix reinforced with calcium-phosphate crystals (hydroxyapatite). Daily balanced Indian meals rich in milk, curd, paneer, chana, dal, ragi, and leafy greens supply essential macronutrients and micronutrients for healthy musculoskeletal development.',
    category: 'Nutrition',
    evidenceLevel: 'Clinical Recommendation'
  },
  {
    id: 'do-2',
    title: 'Maintain a consistent sleep schedule',
    summary: '8 to 10 hours of restorative sleep supports natural growth hormone release.',
    details: 'Over 60–75% of daily Human Growth Hormone (HGH) is released during slow-wave deep sleep (Stage 3 and 4 SWS). Going to bed and waking at consistent hours maintains optimal circadian endocrine rhythm for adolescents and adults alike.',
    category: 'Sleep & Recovery',
    evidenceLevel: 'Physiological Fact'
  },
  {
    id: 'do-3',
    title: 'Participate in regular physical activity',
    summary: 'Weight-bearing sports, calisthenics, and active play strengthen bones.',
    details: 'Regular dynamic movement, running, jumping, and recreational calisthenics apply beneficial mechanical loads that stimulate osteoblasts to build stronger bone density according to Wolff’s Law.',
    category: 'Physical Activity',
    evidenceLevel: 'Physiological Fact'
  },
  {
    id: 'do-4',
    title: 'Spend time outdoors',
    summary: 'Natural morning sunshine enables biological Vitamin D synthesis.',
    details: 'Spending 15–20 minutes in morning sunlight triggers cutaneous synthesis of Vitamin D3, which is required for the body to absorb calcium from your diet. Without vitamin D, less than 15% of dietary calcium is absorbed.',
    category: 'Activity & Sunshine',
    evidenceLevel: 'Clinical Recommendation'
  },
  {
    id: 'do-5',
    title: 'Maintain good posture',
    summary: 'Stand and sit with neutral spinal curvature to avoid disc compression.',
    details: 'Forward-head posture and slouched shoulders compress vertebral discs and produce excessive kyphosis. Practicing Mountain Pose, Wall Angels, and ergonomic desk habits reclaims 1–2 cm of height lost to daily spinal slump.',
    category: 'Posture & Ergonomics',
    evidenceLevel: 'Physiological Fact'
  },
  {
    id: 'do-6',
    title: 'Follow safe exercise techniques',
    summary: 'Focus on proper form, progressive overload, and joint mobility.',
    details: 'Prioritize controlled movement over heavy spinal loading. Warming up properly, keeping joints aligned, and avoiding hyperextension protects growth cartilage and connective tissue from injury.',
    category: 'Physical Activity',
    evidenceLevel: 'Safety Protocol'
  },
  {
    id: 'do-7',
    title: 'Consult a healthcare professional about growth concerns',
    summary: 'Board-certified pediatricians and endocrinologists provide safe medical evaluation.',
    details: 'If you or your guardian have clinical concerns regarding growth velocity, pubertal timing, or percentiles, consult a certified pediatrician or pediatric endocrinologist for evidence-based bone-age radiography and hormone assessment.',
    category: 'Medical Safety',
    evidenceLevel: 'Clinical Recommendation'
  }
];

export const DAILY_DONTS: GrowthGuidelineItem[] = [
  {
    id: 'dont-1',
    title: 'Avoid skipping meals',
    summary: 'Growing bodies require steady, uncompromised nutritional fuel throughout the day.',
    details: 'Skipping breakfast or major meals deprives bones, muscles, and the brain of vital glucose, amino acids, and micronutrients needed for cellular growth and hormonal homeostasis.',
    category: 'Nutrition',
    evidenceLevel: 'Safety Protocol'
  },
  {
    id: 'dont-2',
    title: 'Avoid extreme dieting',
    summary: 'Never use aggressive caloric deficits, starvation fasts, or restrictive cuts under 18.',
    details: 'Severe calorie restriction during adolescence can blunt growth velocity, impair bone mineral accrual, and disrupt endocrine signaling. Adolescents need nutritional sufficiency, not aggressive deficits.',
    category: 'Nutrition',
    evidenceLevel: 'Safety Protocol'
  },
  {
    id: 'dont-3',
    title: 'Avoid unverified height-increasing supplements',
    summary: 'Commercial "growth powders", pills, and tonics are fraudulent and potentially dangerous.',
    details: 'There are no over-the-counter supplements or Ayurvedic powders clinically proven to increase bone length. Many unregulated formulas contain concealed steroids, heavy metals, or toxic contaminants.',
    category: 'Medical Safety',
    evidenceLevel: 'Safety Protocol'
  },
  {
    id: 'dont-4',
    title: 'Avoid excessive exercise',
    summary: 'Allow adequate rest and recovery between training and sporting activities.',
    details: 'Overtraining without adequate recovery elevates chronic cortisol, interferes with slow-wave sleep, and risks epiphyseal overuse injuries. Balance physical activity with structured rest days.',
    category: 'Physical Activity',
    evidenceLevel: 'Clinical Recommendation'
  },
  {
    id: 'dont-5',
    title: 'Avoid comparing your height with others',
    summary: 'Growth happens at different rates; puberty timing varies naturally among individuals.',
    details: 'Genetics account for 70–80% of final adult stature. Some adolescents hit peak height velocity earlier (age 11–13) while late bloomers experience their spurt between 14–17. Stature is an individual genetic journey.',
    category: 'Medical Safety',
    evidenceLevel: 'Physiological Fact'
  },
  {
    id: 'dont-6',
    title: 'Do not expect hanging or stretching to lengthen bones',
    summary: 'Hanging decompresses spinal discs, but does not alter fused or growing long bones.',
    details: 'Bar hanging is wonderful for shoulder mobility, grip strength, and temporary intervertebral decompression (reclaiming compressed disc space), but it cannot stimulate longitudinal bone elongation once growth plates fuse.',
    category: 'Physical Activity',
    evidenceLevel: 'Physiological Fact'
  },
  {
    id: 'dont-7',
    title: 'Do not follow routines that promise guaranteed height increases',
    summary: 'Genetics set structural potential; no internet exercise program can guarantee added inches.',
    details: 'Claims promising 2–4 inches of guaranteed height through special exercises or stretches are misleading. Legitimate routines focus on posture optimization, core strength, and natural spinal alignment.',
    category: 'Medical Safety',
    evidenceLevel: 'Clinical Recommendation'
  }
];

export const GROWTH_PLATE_SCIENCE_TOPICS: GrowthSpurtEducationalFact[] = [
  {
    id: 'sci-1',
    title: 'The Role of Genetics (70–80% of Final Height)',
    summary: 'Your DNA sets the biological height range; lifestyle determines where you land in that range.',
    details: 'Scientific genome-wide association studies show hundreds of genetic loci influence adult stature. The Mid-Parental Height formula provides an approximate genetic target window: for boys, [(father’s height + mother’s height + 13 cm) / 2], and for girls, [(father’s height - 13 cm + mother’s height) / 2] with a natural variation range of ±5 to 7 cm.',
    mythBuster: 'MYTH: "If your parents are average height, you have zero control over your health." FACT: Proper nutrition, sleep, and posture ensure you reach the absolute top end of your genetic potential.',
    scientificExplanation: 'While polygenic heritage determines the structural boundary, environmental insults like chronic malnutrition, severe childhood illness, or sleep deprivation can cause adolescents to miss their target potential by several centimeters.'
  },
  {
    id: 'sci-2',
    title: 'Epiphyseal Growth Plates & Physis Closure',
    summary: 'How long bones actually grow during childhood and adolescence.',
    details: 'Near the ends of long bones (such as the femur and tibia) lie specialized zones of hyaline cartilage known as epiphyseal plates. Chondrocytes (cartilage cells) continuously divide and organize into columns, which then undergo mineralization (ossification) into hard bone tissue.',
    mythBuster: 'MYTH: "You can reopen growth plates in your late 20s with special exercises." FACT: Once growth plates undergo ossification and fuse (typically between ages 16–18 for biological females and 18–21 for biological males), longitudinal bone growth ceases permanently.',
    scientificExplanation: 'Rising levels of estrogen and testosterone toward the end of puberty signal the chondrocytes to stop dividing, and the cartilage zone is completely replaced by solid trabecular bone, forming the epiphyseal line.'
  },
  {
    id: 'sci-3',
    title: 'Postural Decompression vs. Real Bone Growth',
    summary: 'Why posture stretches can add 1 to 3 cm to your standing stature.',
    details: 'Between your 24 articulating vertebrae lie soft fibrocartilaginous discs filled with a gel-like nucleus pulposus. Throughout the day, gravity and slumping compress these discs, making most humans 1–2 cm shorter by evening.',
    mythBuster: 'MYTH: "Doing yoga lengthened my leg bones by 2 inches!" FACT: Yoga did not lengthen your leg bones, but it unlocked thoracic extension, corrected pelvic tilt, and hydrated spinal discs so you stand at your true maximum height.',
    scientificExplanation: 'Correcting an exaggerated forward head tilt (tech neck), rounded thoracic kyphosis, and an anterior pelvic tilt reclaims the full vertical height of your existing skeletal framework without altering bone dimensions.'
  },
  {
    id: 'sci-4',
    title: 'Pubertal Spurt Timing & Growth Velocity Curves',
    summary: 'Understanding peak height velocity (PHV) during teenage years.',
    details: 'During peak height velocity (PHV), adolescents can grow up to 7–10 cm per year. In girls, PHV typically occurs between ages 11 and 13 (often preceding menarche); in boys, PHV typically occurs between ages 13 and 16.',
    mythBuster: 'MYTH: "Growth happens steadily at the exact same rate every month." FACT: Adolescent growth happens in sudden episodic spurts followed by periods of consolidation.',
    scientificExplanation: 'Pulsatile increases in GnRH stimulate pituitary LH and FSH, amplifying sex steroid hormones that synergize with Growth Hormone and Insulin-like Growth Factor-1 (IGF-1) to accelerate cellular proliferation at growth plates.'
  }
];
