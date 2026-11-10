import { CalisthenicsExercise, CalisthenicsRoutine } from '../types/calisthenics';

export const CALISTHENICS_SKILLS: CalisthenicsExercise[] = [
  // ==========================================
  // BEGINNER TIER (8 Major Skills)
  // ==========================================
  {
    id: 'skill-push-ups',
    name: 'Push-ups',
    tier: 'beginner',
    category: 'push',
    prerequisites: [],
    nextProgressions: ['skill-dips', 'skill-handstand'],
    repsTarget: '3 sets of 12–15 strict reps',
    description: 'The definitive horizontal pushing foundation for pecs, anterior deltoids, and triceps with locked core stability.',
    youtubeVideoId: 'IODxDxX7oi4',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'The Perfect Push Up Technique',
    stepByStepInstructions: [
      'Position hands slightly wider than shoulder-width, fingers spread firmly into the floor.',
      'Establish a solid high-plank position: squeeze glutes, brace abdominals in posterior pelvic tilt.',
      'Inhale and lower under control until your chest touches 1-2 cm above the floor, elbows tracking at a 45° angle.',
      'Keep your neck neutral and gaze at the floor.',
      'Exhale and forcefully drive the floor away, protracting your shoulder blades at full lockout.'
    ],
    formCues: [
      'Screw your palms into the ground for active external shoulder torque',
      'Never flare elbows out 90° to protect shoulder rotator cuffs',
      'Maintain rigid plank tension: do not allow hips to sag or pike'
    ],
    commonMistakes: [
      'Sagging lumbar spine due to loose glutes',
      'Flaring elbows out horizontally causing shoulder impingement',
      'Half repetitions without touching full depth or locking out'
    ],
    safetyPrecautions: [
      'Warm up wrists thoroughly with gentle circular stretches before loading',
      'If wrists ache, use push-up handles or parallettes to maintain neutral alignment'
    ],
    easierAlternatives: ['Incline push-ups on elevated surface', 'Knee push-ups', 'Hands elevated on parallettes'],
    harderVariations: ['Diamond push-ups', 'Decline push-ups', 'Archer push-ups'],
    musclesTargeted: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior', 'Core']
  },
  {
    id: 'skill-pull-ups',
    name: 'Pull-ups',
    tier: 'beginner',
    category: 'pull',
    prerequisites: ['skill-australian-rows'],
    nextProgressions: ['skill-muscle-up', 'skill-tuck-front-lever'],
    repsTarget: '3 sets of 8–10 strict dead-hang reps',
    description: 'The golden standard vertical bodyweight pull, developing wide lats, upper back thickness, and tremendous grip strength.',
    youtubeVideoId: 'eGo4IYlbE5g',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How To Do Pull Ups with Perfect Form',
    stepByStepInstructions: [
      'Grip the pull-up bar with an overhand (pronated) grip, slightly wider than shoulder width.',
      'Hang with full arm extension in a relaxed passive hang, then engage active hang by depressing and retracting scapulae.',
      'Pull your elbows down towards your hips while driving your chest toward the bar.',
      'Clear the bar with your chin without craning your neck or swinging your legs.',
      'Lower under complete eccentric control for 2–3 seconds back to dead-hang.'
    ],
    formCues: [
      'Lead with your sternum, pulling your chest to the bar',
      'Keep legs straight and slightly in front (hollow body tension)',
      'Pause for a split second at the bottom to reset momentum'
    ],
    commonMistakes: [
      'Kicking legs or kipping for artificial momentum',
      'Cutting the bottom range of motion short (half reps)',
      'Craning the neck upward over the bar rather than pulling chest high'
    ],
    safetyPrecautions: [
      'Do not violently dismount from the bottom of the movement',
      'Ensure thumb is wrapped around bar if grip fatigue sets in'
    ],
    easierAlternatives: ['Resistance band assisted pull-ups', 'Negative eccentric pull-ups (5s descent)', 'Australian horizontal rows'],
    harderVariations: ['L-sit pull-ups', 'Chest-to-bar pull-ups', 'Weighted pull-ups'],
    musclesTargeted: ['Latissimus Dorsi', 'Teres Major', 'Rhomboids', 'Biceps', 'Brachialis', 'Forearm Grip']
  },
  {
    id: 'skill-chin-ups',
    name: 'Chin-ups',
    tier: 'beginner',
    category: 'pull',
    prerequisites: ['skill-australian-rows'],
    nextProgressions: ['skill-pull-ups', 'skill-tuck-back-lever'],
    repsTarget: '3 sets of 8–12 strict reps',
    description: 'Underhand (supinated) vertical pull recruiting maximal bicep activation alongside powerful lat development.',
    youtubeVideoId: 'm38B_6Qp1p0',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'The Proper Way to Chin Up',
    stepByStepInstructions: [
      'Grip the bar with palms facing towards you (supinated), shoulder-width apart.',
      'Engage scapulae down and back before bending elbows.',
      'Pull smoothly until your chin clears the bar and chest approaches the bar.',
      'Squeeze biceps and upper back at peak contraction.',
      'Lower with control through full arm extension without bouncing.'
    ],
    formCues: [
      'Keep elbows tracking forward and tucked close to the ribs',
      'Brace core to prevent swinging or hyperextending low back',
      'Control the descent to protect the elbow tendons'
    ],
    commonMistakes: [
      'Bouncing out of the bottom dead-hang, straining biceps tendons',
      'Shrugging shoulders into ears at the top of the pull'
    ],
    safetyPrecautions: [
      'If you feel inner elbow strain (medial epicondyle), substitute with neutral-grip chin-ups or rings'
    ],
    easierAlternatives: ['Band-assisted chin-ups', 'Eccentric chin-up lowers (5 seconds)', 'Inverted underhand rows'],
    harderVariations: ['L-sit chin-ups', 'Slow tempo 4-second eccentric chin-ups', 'Weighted chin-ups'],
    musclesTargeted: ['Biceps Brachii', 'Brachialis', 'Latissimus Dorsi', 'Lower Trapezius', 'Pectoralis Minor']
  },
  {
    id: 'skill-dips',
    name: 'Dips',
    tier: 'beginner',
    category: 'push',
    prerequisites: ['skill-push-ups'],
    nextProgressions: ['skill-muscle-up', 'skill-handstand'],
    repsTarget: '3 sets of 10–12 controlled reps',
    description: 'The heavyweight compound bodyweight pusher for lower chest, front shoulders, and explosive triceps strength.',
    youtubeVideoId: '2z8JmcrW-As',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How to Do Dips - Master the Technique',
    stepByStepInstructions: [
      'Mount parallel bars with locked elbows, actively depressing shoulders down (pushing bars away from ears).',
      'Lean torso slightly forward at a 15–20° angle to load chest and stabilize shoulders.',
      'Inhale and descend until upper arms are at least parallel to the floor (90° elbow bend).',
      'Hold position momentarily at the bottom without resting into passive joint collapse.',
      'Drive aggressively upward, locking arms and pushing chest forward.'
    ],
    formCues: [
      'Keep forearms vertical to the ground throughout the movement',
      'Pack shoulders down; never let shoulders shrug up toward ears',
      'Maintain slight forward torso lean for joint comfort'
    ],
    commonMistakes: [
      'Dipping excessively deep without shoulder capsule mobility, risking anterior impingement',
      'Flaring elbows outward rather than tracking back',
      'Shrugging shoulders upward at the bottom'
    ],
    safetyPrecautions: [
      'Do not drop quickly into the stretch. Always earn shoulder extension mobility gradually'
    ],
    easierAlternatives: ['Bench dips with feet elevated', 'Band-assisted parallel bar dips', 'Dip static hold at top (30s)'],
    harderVariations: ['Straight bar dips', 'Ring dips (extreme stabilizer demand)', 'L-sit dips'],
    musclesTargeted: ['Pectoralis Major (Lower)', 'Triceps Brachii', 'Anterior Deltoids', 'Latissimus Dorsi']
  },
  {
    id: 'skill-australian-rows',
    name: 'Australian Rows (Inverted Rows)',
    tier: 'beginner',
    category: 'pull',
    prerequisites: [],
    nextProgressions: ['skill-pull-ups', 'skill-tuck-front-lever'],
    repsTarget: '3 sets of 12–15 strict reps',
    description: 'Horizontal pulling benchmark essential for postural balance, scapular retraction, and building base strength for pull-ups.',
    youtubeVideoId: 'tAM3TswBpmE',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'How To Inverted Row / Australian Pull Ups',
    stepByStepInstructions: [
      'Position yourself underneath a waist-height bar or gymnastic rings, heels on the ground.',
      'Grip the bar slightly wider than shoulder-width with arms fully extended.',
      'Form a straight rigid plank line from heels to ears.',
      'Retract your scapulae and pull your lower chest up to touch the bar.',
      'Squeeze mid-back blades together at peak, then lower under control.'
    ],
    formCues: [
      'Drive elbows backward past your torso',
      'Keep glutes clamped and hips high (do not break at the hips)',
      'Touch the bar to your chest on every repetition'
    ],
    commonMistakes: [
      'Sagging hips turning the exercise into a hip thrust',
      'Not touching the bar, losing top retraction benefits'
    ],
    safetyPrecautions: ['Ensure bar is firmly supported in racks or rings are anchored securely'],
    easierAlternatives: ['High-incline bodyweight rows (elevated bar)', 'Bent-knee Australian rows'],
    harderVariations: ['Feet-elevated inverted rows on box', 'Single-arm Australian rows', 'Archer inverted rows'],
    musclesTargeted: ['Rhomboids', 'Middle Trapezius', 'Latissimus Dorsi', 'Posterior Deltoids', 'Biceps']
  },
  {
    id: 'skill-plank',
    name: 'Hollow Plank (PPT Plank)',
    tier: 'beginner',
    category: 'core',
    prerequisites: [],
    nextProgressions: ['skill-hollow-body-hold', 'skill-l-sit'],
    repsTarget: '3 sets of 45–60 seconds hold',
    description: 'The foundation of all calisthenics static holds, enforcing active scapular protraction and posterior pelvic tilt.',
    youtubeVideoId: 'ynUw0YsRM4s',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'The Perfect Plank - Stop Making These Mistakes',
    stepByStepInstructions: [
      'Rest on forearms with elbows directly under shoulders, feet together.',
      'Squeeze glutes maximally to tuck pelvis forward into Posterior Pelvic Tilt (flattening lower back).',
      'Push forearms into the floor to round and protract upper back (dome-like shape).',
      'Pull belly button toward spine and breathe steadily through the diaphragm.',
      'Hold position with 100% active muscular tension.'
    ],
    formCues: [
      'Think of dragging your elbows toward your toes and toes toward elbows',
      'Glutes must be rock hard to lock pelvis',
      'Protract shoulder blades: push chest away from floor'
    ],
    commonMistakes: [
      'Arched lower back with relaxed glutes (hanging on lumbar spine)',
      'Winged or collapsed shoulder blades',
      'Looking up, hyperextending cervical spine'
    ],
    safetyPrecautions: ['Stop immediately if you feel pressure in lower back rather than core abdominal wall'],
    easierAlternatives: ['Knee plank with posterior tilt', 'Incline forearm plank on bench'],
    harderVariations: ['Long-lever extended plank', 'Single-arm plank', 'RKC hardstyle plank'],
    musclesTargeted: ['Rectus Abdominis', 'Transverse Abdominis', 'Serratus Anterior', 'Gluteus Maximus', 'Obliques']
  },
  {
    id: 'skill-hollow-body-hold',
    name: 'Hollow Body Hold',
    tier: 'beginner',
    category: 'core',
    prerequisites: ['skill-plank'],
    nextProgressions: ['skill-l-sit', 'skill-dragon-flag'],
    repsTarget: '3 sets of 30–45 seconds hold',
    description: 'Gymnastics core gold standard. Creates the unyielding banana-shaped body tension required for handstands and levers.',
    youtubeVideoId: '44ScXWFaVBs',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'Hollow Body Hold - Step By Step Progression',
    stepByStepInstructions: [
      'Lie flat on your back with legs straight, feet together, and arms reaching overhead.',
      'Flatten your lower back completely against the floor by pulling navel to spine (zero daylight under low back).',
      'Lift your head, shoulder blades, and straight legs 10–15 cm off the floor.',
      'Point your toes and squeeze quads and glutes tightly.',
      'Maintain rhythmic shallow breathing while keeping lower back glued to the floor.'
    ],
    formCues: [
      'Lower back MUST stay completely flush against the floor at all costs',
      'Glue inner thighs together and point toes',
      'Reach arms back past your ears'
    ],
    commonMistakes: [
      'Allowing lower back to arch off the floor when legs are lowered too far',
      'Holding breath instead of diaphragmatic bracing'
    ],
    safetyPrecautions: ['If lower back lifts, immediately tuck knees into chest to shorten the lever'],
    easierAlternatives: ['Tuck hollow body hold (knees bent at 90°)', 'Single-leg hollow body hold', 'Hollow body hold with arms at sides'],
    harderVariations: ['Hollow body rocks', 'Hollow body pull-overs with light dumbbell'],
    musclesTargeted: ['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors', 'Quadriceps', 'Serratus']
  },
  {
    id: 'skill-l-sit',
    name: 'L-Sit Progression',
    tier: 'beginner',
    category: 'core',
    prerequisites: ['skill-dips', 'skill-hollow-body-hold'],
    nextProgressions: ['skill-dragon-flag', 'skill-tuck-front-lever'],
    repsTarget: '3 sets of 15–20 seconds hold',
    description: 'Premier compression strength exercise combining scapular depression, hip flexor compression, and isometric triceps power.',
    youtubeVideoId: 'yK88X3gZJ3A',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How to L-Sit - Full Progression Tutorial',
    stepByStepInstructions: [
      'Sit on floor or parallettes with hands placed beside hips.',
      'Push down firmly into the ground to depress shoulders and lift hips off the floor.',
      'Pull knees tightly into chest to form a Tuck L-Sit.',
      'Once tuck is held 20s+, extend one leg forward, alternating sides.',
      'Progress to extending both legs fully out parallel to the floor with locked knees and pointed toes.'
    ],
    formCues: [
      'Drive hands down into the floor: push your shoulders as far from your ears as possible',
      'Lock your quadriceps hard to keep knees completely straight',
      'Lean slightly forward over hands for optimal center of gravity'
    ],
    commonMistakes: [
      'Shoulders shrugging up into ears due to lack of scapular depression',
      'Bent knees during full variation'
    ],
    safetyPrecautions: ['Use parallettes if wrist mobility restricts floor palm placement'],
    easierAlternatives: ['Tuck L-sit on parallettes', 'One-leg extended L-sit', 'Floor seated leg lifts'],
    harderVariations: ['Floor L-sit (zero elevation clearance)', 'V-sit / Manna progression'],
    musclesTargeted: ['Rectus Abdominis', 'Iliopsoas (Hip Flexors)', 'Quadriceps', 'Triceps', 'Lower Trapezius']
  },

  // ==========================================
  // INTERMEDIATE TIER (7 Major Skills)
  // ==========================================
  {
    id: 'skill-muscle-up',
    name: 'Muscle-up Progression',
    tier: 'intermediate',
    category: 'dynamics',
    prerequisites: ['skill-pull-ups', 'skill-dips'],
    nextProgressions: ['skill-advanced-muscle-up'],
    repsTarget: '3 sets of 3–5 clean reps',
    description: 'The iconic calisthenics rite of passage: transitioning explosive vertical pulling power into a straight-bar dip above the bar.',
    youtubeVideoId: 'ocS_kK4lG0E',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How to Muscle Up - 5 Easy Steps',
    stepByStepInstructions: [
      'Adopt a false grip or strong overhand grip on high pull-up bar.',
      'Initiate with a controlled hollow body arch swing for slight backward trajectory.',
      'Pull explosively around the bar, driving elbows back and up toward the ceiling.',
      'Throw your chest and shoulders over the bar in a rapid forward transition.',
      'Press out the top straight-bar dip to full lockout, then lower under control.'
    ],
    formCues: [
      'Pull to your lower ribs or sternum, not just chin height',
      'Both elbows MUST transition over the bar simultaneously (no chicken winging)',
      'Fast head flick over the bar at the apex of the pull'
    ],
    commonMistakes: [
      'Single-arm "chicken wing" transition which severely damages shoulder labrum',
      'Relying purely on excessive momentum without base explosive pull strength'
    ],
    safetyPrecautions: [
      'NEVER perform single-arm chicken wing muscle-ups. Master high chest-to-bar pull-ups first'
    ],
    easierAlternatives: ['Explosive chest-to-bar pull-ups', 'Banded muscle-ups', 'Jumping transition muscle-ups on low bar'],
    harderVariations: ['Strict slow muscle-up (zero swing)', 'Ring muscle-up', 'L-sit muscle-up'],
    musclesTargeted: ['Latissimus Dorsi', 'Pectoralis Major', 'Triceps', 'Biceps', 'Rotator Cuff', 'Forearms']
  },
  {
    id: 'skill-handstand',
    name: 'Handstand Progression (Wall-Assisted)',
    tier: 'intermediate',
    category: 'statics',
    prerequisites: ['skill-push-ups', 'skill-plank'],
    nextProgressions: ['skill-freestanding-handstand', 'skill-handstand-pushups'],
    repsTarget: '4 sets of 45–60 seconds wall hold',
    description: 'Developing shoulder overhead flexion, scapular elevation, hollow body line, and wrist conditioning inverted against the wall.',
    youtubeVideoId: 'Y3FSeDc74yc',
    videoChannel: 'Tom Merrick',
    videoTitle: 'Complete Handstand Progression - Beginner to Advanced',
    stepByStepInstructions: [
      'Place hands 15–20 cm away from wall, fingers spread with index fingers pointing forward.',
      'Walk feet up wall into a Chest-to-Wall Handstand (preferred for straight line mechanics).',
      'Push the floor away aggressively, elevating scapulae up toward your ears.',
      'Squeeze glutes, tuck ribs in, and point toes toward ceiling.',
      'Grip the floor with fingertips ("spider fingers") to micro-adjust balance.'
    ],
    formCues: [
      'Open shoulders fully: armpits should face the wall',
      'Never allow lower back to banana arch: keep hollow core tension',
      'Fingertips are your brakes; heel of hand is your gas pedal'
    ],
    commonMistakes: [
      'Banana back (back-to-wall kickup with hyper-arched spine)',
      'Relaxing shoulders and sinking into joints',
      'Holding breath'
    ],
    safetyPrecautions: [
      'Learn how to pirouette bail (stepping one hand out to twist safely to feet) before fatigue'
    ],
    easierAlternatives: ['Wall-walks up to 45°', 'Box handstand pike hold', 'Forearm headstand'],
    harderVariations: ['Chest-to-wall toe pulls (floating off wall)', 'Handstand wall taps', 'Freestanding balance attempts'],
    musclesTargeted: ['Anterior/Medial Deltoids', 'Trapezius (Upper & Serratus)', 'Triceps', 'Core', 'Wrists']
  },
  {
    id: 'skill-pistol-squats',
    name: 'Pistol Squats (Single Leg Squat)',
    tier: 'intermediate',
    category: 'legs',
    prerequisites: [],
    nextProgressions: ['skill-dragon-flag'],
    repsTarget: '3 sets of 6–8 reps per leg',
    description: 'Unilateral lower-body apex combining tremendous quad strength, ankle dorsiflexion, and balance control.',
    youtubeVideoId: '1-nc58m9oA4',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'Master The Pistol Squat - Full Progression',
    stepByStepInstructions: [
      'Stand on one leg with arms extended forward for counterbalance.',
      'Extend the non-working leg straight out in front off the floor.',
      'Hinge hips slightly back and descend smoothly on working leg into a full deep squat.',
      'Keep heel firmly anchored on the ground throughout.',
      'Drive through mid-foot and heel to return to full upright standing lockout.'
    ],
    formCues: [
      'Ankle mobility is key: lean torso forward to counterbalance hips',
      'Actively contract quad of the floating leg to keep it off the ground',
      'Control the eccentric: do not collapse into the bottom'
    ],
    commonMistakes: [
      'Heel peeling off the ground due to poor ankle dorsiflexion',
      'Knee caving inward (valgus collapse)',
      'Bouncing out of the bottom position'
    ],
    safetyPrecautions: ['Warm up knees and ankles with deep bodyweight squats and calf stretches first'],
    easierAlternatives: ['Box pistol squats (squatting to chair/bench)', 'Counterbalance pistol squat holding light weight', 'Assisted pole pistol squats'],
    harderVariations: ['Deficit pistol squat on box', 'Slow 5-second tempo pistol squats', 'Weighted pistol squats'],
    musclesTargeted: ['Quadriceps', 'Gluteus Medius & Maximus', 'Hamstrings', 'Soleus / Calves', 'Core']
  },
  {
    id: 'skill-dragon-flag',
    name: 'Dragon Flag Progression',
    tier: 'intermediate',
    category: 'core',
    prerequisites: ['skill-hollow-body-hold', 'skill-l-sit'],
    nextProgressions: ['skill-tuck-front-lever'],
    repsTarget: '3 sets of 5–8 controlled reps',
    description: 'Bruce Lee legendary core strength movement. Lowers the entire rigid body in a straight lever pivoting from the upper back.',
    youtubeVideoId: 'Tbxw118V69E',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How to Dragon Flag (Bruce Lee Exercise)',
    stepByStepInstructions: [
      'Lie flat on bench or floor, gripping a sturdy pole or bench edge behind your ears.',
      'Roll up onto your upper traps and shoulders, lifting your entire body vertically.',
      'Form a straight rigid plank from shoulders to toes; do not bend at the hips.',
      'Slowly lower your body toward the bench under strict eccentric control (3-4 seconds).',
      'Hover right above bench without letting lower back or hips touch down, then pull back up.'
    ],
    formCues: [
      'The ONLY pivot point is your upper thoracic spine/shoulders',
      'Squeeze glutes with maximum force to prevent hip sagging or piking',
      'Actively pull down with lats through your hand grip'
    ],
    commonMistakes: [
      'Bending at the hips (piking) to reduce lever length unintentionally',
      'Dropping quickly onto lower back'
    ],
    safetyPrecautions: ['Maintain neck in neutral alignment without excessive cervical compression on floor'],
    easierAlternatives: ['Tuck dragon flag', 'Single-leg extended dragon flag', 'Dragon flag eccentric lowers only'],
    harderVariations: ['Full dragon flag holds (isometrics)', 'Dragon flag raises (concentric pull)', 'Dragon flag leg flutters'],
    musclesTargeted: ['Rectus Abdominis', 'Transverse Abdominis', 'Latissimus Dorsi', 'Glutes', 'Hamstrings']
  },
  {
    id: 'skill-tuck-front-lever',
    name: 'Tuck Front Lever',
    tier: 'intermediate',
    category: 'statics',
    prerequisites: ['skill-pull-ups', 'skill-australian-rows'],
    nextProgressions: ['skill-full-front-lever'],
    repsTarget: '4 sets of 15–20 seconds hold',
    description: 'Straight-arm pulling milestone. Suspends the horizontal torso beneath the bar using immense scapular depression and lat strength.',
    youtubeVideoId: '92Kj1h7zC30',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'Front Lever Tutorial - Beginner to Advanced Progressions',
    stepByStepInstructions: [
      'Hang from bar with overhand grip and locked, straight elbows.',
      'Engage scapulae down and retract back (pushing bar down toward hips).',
      'Pull knees tightly into chest and rotate body until back is completely parallel to floor.',
      'Keep arms straight with zero elbow bend; maintain chest proud and horizontal spine.',
      'Hold the static position with steady breathing.'
    ],
    formCues: [
      'Keep elbows 100% straight: this is a straight-arm scapular pull, not a row',
      'Think of doing a straight-arm lat pulldown to the hips',
      'Keep hips at the exact same horizontal height as your shoulders'
    ],
    commonMistakes: [
      'Bending elbows to cheat lever mechanics',
      'Hips sagging below shoulder level',
      'Protracted, hunched shoulders instead of active retraction'
    ],
    safetyPrecautions: ['Build straight-arm tendon resilience with inverted rows and band pull-downs first'],
    easierAlternatives: ['Scapular pull-ups', 'Inverted hang holds on bar', 'Band-assisted tuck front lever'],
    harderVariations: ['Advanced tuck front lever (knees at 90° from torso)', 'One-leg front lever', 'Straddle front lever'],
    musclesTargeted: ['Latissimus Dorsi', 'Teres Major', 'Posterior Deltoids', 'Rhomboids', 'Core', 'Forearms']
  },
  {
    id: 'skill-tuck-back-lever',
    name: 'Tuck Back Lever',
    tier: 'intermediate',
    category: 'statics',
    prerequisites: ['skill-chin-ups', 'skill-dips'],
    nextProgressions: ['skill-full-back-lever'],
    repsTarget: '4 sets of 15–20 seconds hold',
    description: 'Horizontal inverted hold facing the floor, demanding intense biceps tendon resilience, shoulder extension, and posterior chain tension.',
    youtubeVideoId: '9ZzE4Nl6RjA',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'How to Back Lever - Safe Progressions',
    stepByStepInstructions: [
      'Hang from bar and skin the cat: rotate feet through arms into an inverted German hang.',
      'From German hang, contract glutes and pull torso up until back is parallel to the ground.',
      'Keep knees tucked tight to chest and arms locked straight.',
      'Protract scapulae and squeeze glutes to keep hips level with shoulders.',
      'Hold position and reverse back through skin the cat to dismount.'
    ],
    formCues: [
      'Start in German hang to condition the biceps tendon and anterior shoulder',
      'Pronated grip is safer for beginners than supinated to reduce distal biceps tendon strain',
      'Squeeze knees tight to chest to minimize lever load'
    ],
    commonMistakes: [
      'Dropping hips below parallel',
      'Rushing into supinated back lever without months of German hang preparation'
    ],
    safetyPrecautions: [
      'CRITICAL: Condition distal biceps tendons with German hang (30s hold) before attempting back levers'
    ],
    easierAlternatives: ['German hang holds on rings', 'Skin the cat repetitions', 'High tuck back lever'],
    harderVariations: ['Advanced tuck back lever', 'Straddle back lever', 'Full back lever'],
    musclesTargeted: ['Biceps Brachii (Tendon)', 'Anterior Deltoids', 'Pectoralis Minor', 'Lower Back', 'Core']
  },
  {
    id: 'skill-human-flag-prep',
    name: 'Human Flag Preparation (Chamber Holds)',
    tier: 'intermediate',
    category: 'statics',
    prerequisites: ['skill-pull-ups', 'skill-dips', 'skill-l-sit'],
    nextProgressions: ['skill-full-human-flag'],
    repsTarget: '4 sets of 10–15 seconds per side',
    description: 'Asymmetric push-pull lateral hold developing superhuman oblique power, lat pulling tension, and tricep/delt pushing lockout.',
    youtubeVideoId: 'z8dYtI32X4k',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'How to Do the Human Flag - Step by Step',
    stepByStepInstructions: [
      'Find vertical pole or wall bars. Top hand takes overhand pulling grip; bottom hand takes underhand pushing grip.',
      'Bottom arm locks 100% straight, pushing the pole with maximum force.',
      'Top arm locks and pulls downward with lats.',
      'Jump or kick legs into a vertical chamber tuck position against the pole.',
      'Hold the tucked torso horizontally out from the pole for targeted duration.'
    ],
    formCues: [
      'Bottom arm pushes the pole away like a pillar; top arm pulls like a crane cable',
      'Both elbows must be completely locked',
      'Stack your hips vertically: do not allow chest to rotate toward the floor'
    ],
    commonMistakes: [
      'Bent bottom elbow, placing extreme shear on the joint',
      'Allowing hips to sag down, twisting into an awkward angle'
    ],
    safetyPrecautions: ['Train both sides equally to avoid asymmetric lat and oblique muscular imbalances'],
    easierAlternatives: ['Vertical pole pull-and-push stands', 'Tuck human flag raises on stall bars'],
    harderVariations: ['Straddle human flag', 'Negative human flag lowers', 'Full human flag hold'],
    musclesTargeted: ['Internal/External Obliques', 'Latissimus Dorsi', 'Anterior Deltoid', 'Triceps', 'Quadratus Lumborum']
  },

  // ==========================================
  // ADVANCED TIER (8 Master Skills)
  // ==========================================
  {
    id: 'skill-full-front-lever',
    name: 'Full Front Lever',
    tier: 'advanced',
    category: 'statics',
    prerequisites: ['skill-tuck-front-lever', 'skill-dragon-flag'],
    nextProgressions: [],
    repsTarget: '5 sets of 5–10 seconds hold',
    description: 'The pinnacle of horizontal straight-arm bodyweight pulling. The body is held completely straight and rigid like a board.',
    youtubeVideoId: '0t7E5zQZp40',
    videoChannel: 'SaturnoMovement',
    videoTitle: 'Master the Front Lever - Elite Calisthenics Guide',
    stepByStepInstructions: [
      'Grip the bar with overhand grip, arms locked 100% straight.',
      'Depress scapulae down hard and pull the bar toward your waist.',
      'Extend both legs straight out, pointing toes and squeezing glutes and quads together.',
      'Align heels, knees, hips, and shoulders in one seamless horizontal plane.',
      'Maintain steady breathing and hold with maximum straight-arm lat recruitment.'
    ],
    formCues: [
      'Push the bar down into the floor as if breaking it over your thighs',
      'Hollow body core tension: zero sag in the hips',
      'Lock knees and point toes to create unified lever stiffness'
    ],
    commonMistakes: [
      'Hips sagging lower than shoulders',
      'Micro-bending elbows to recruit biceps instead of lats and scapular depressors'
    ],
    safetyPrecautions: ['Ensure adequate rest (2-3 min between sets) to recover neurological CNS output'],
    easierAlternatives: ['Straddle front lever', 'Half-lay front lever', 'One-leg front lever'],
    harderVariations: ['Front lever pull-ups', 'Front lever to inverted hang presses', '360° lever rotations'],
    musclesTargeted: ['Latissimus Dorsi', 'Teres Major', 'Rhomboids', 'Posterior Deltoids', 'Rectus Abdominis', 'Glutes']
  },
  {
    id: 'skill-full-back-lever',
    name: 'Full Back Lever',
    tier: 'advanced',
    category: 'statics',
    prerequisites: ['skill-tuck-back-lever'],
    nextProgressions: [],
    repsTarget: '4 sets of 8–12 seconds hold',
    description: 'Complete horizontal prone suspension requiring immense straight-arm biceps tendon integrity and total posterior chain stability.',
    youtubeVideoId: 'jK3a71N4aB4',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'Back Lever Tutorial - Complete Progression',
    stepByStepInstructions: [
      'Enter from inverted hang, rotating through German hang.',
      'Extend legs straight, squeezing heels, knees, and glutes.',
      'Lower under control until the straight body is perfectly parallel with the floor.',
      'Protract scapulae slightly to protect shoulders and lock out elbows.',
      'Hold horizontally without dipping below parallel, then lift or dismount safely.'
    ],
    formCues: [
      'Lock your glutes with maximum force to avoid banana hyperextension',
      'Elbows must remain 100% straight',
      'Keep gaze straight down at floor'
    ],
    commonMistakes: [
      'Over-arching lumbar spine, stressing lower back',
      'Dropping below horizontal, causing excessive shoulder hyperextension strain'
    ],
    safetyPrecautions: ['Only perform when fully warmed up; do not train when biceps tendons are fatigued'],
    easierAlternatives: ['Straddle back lever', 'One-leg back lever', 'Advanced tuck back lever'],
    harderVariations: ['Back lever pull-up raises', 'Hefesto transition', 'Back lever on rings with turn-out'],
    musclesTargeted: ['Biceps Tendons', 'Anterior Deltoids', 'Erector Spinae', 'Gluteals', 'Hamstrings', 'Lats']
  },
  {
    id: 'skill-planche',
    name: 'Planche Progression',
    tier: 'advanced',
    category: 'statics',
    prerequisites: ['skill-dips', 'skill-handstand'],
    nextProgressions: [],
    repsTarget: '5 sets of 10–15 seconds tuck / straddle hold',
    description: 'The supreme calisthenics straight-arm pushing feat: holding the entire body parallel to the ground supported solely on hands.',
    youtubeVideoId: '9xK_p75cW8g',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'Planche Tutorial - Fastest Way to Learn',
    stepByStepInstructions: [
      'Position hands on floor or parallettes with slight outward flare to relieve wrist strain.',
      'Lean shoulders far past your hands in a deep Planche Lean, protracting shoulder blades to the maximum.',
      'Engage core and lift feet into a Tuck Planche: back flat and parallel to floor.',
      'Progress to Advanced Tuck (hips open to 90°), then Straddle Planche with legs spread wide.',
      'Full Planche: legs together, perfectly straight horizontal line with locked elbows.'
    ],
    formCues: [
      'Protract scapulae hard: dome your upper back like an angry cat',
      'Lock elbows with zero bend: straight-arm strength is mandatory',
      'Lean shoulders forward until feet naturally float off the ground'
    ],
    commonMistakes: [
      'Retracting shoulder blades (chest sagging between shoulders)',
      'Bending elbows into a pseudo-pushup',
      'Insufficient forward lean, resulting in feet dragging'
    ],
    safetyPrecautions: [
      'Condition biceps tendons and wrists for months with planche leans and pseudo-planche push-ups'
    ],
    easierAlternatives: ['Planche lean holds on floor (30s)', 'Tuck planche on parallettes', 'Band-assisted planche'],
    harderVariations: ['Straddle planche', 'Full planche', 'Planche push-ups'],
    musclesTargeted: ['Anterior Deltoids', 'Pectoralis Major/Minor', 'Serratus Anterior', 'Biceps (Tendons)', 'Core']
  },
  {
    id: 'skill-freestanding-handstand',
    name: 'Freestanding Handstand',
    tier: 'advanced',
    category: 'statics',
    prerequisites: ['skill-handstand'],
    nextProgressions: ['skill-handstand-pushups'],
    repsTarget: '5 sets of 30–45 seconds balance hold',
    description: 'Mastery of free vertical inversion with pinpoint wrist micro-corrections and pristine straight-line form away from any wall.',
    youtubeVideoId: 'Gj3wF3-i4y0',
    videoChannel: 'Tom Merrick',
    videoTitle: 'How to Freestanding Handstand - Zero Wall Balance',
    stepByStepInstructions: [
      'Set hands shoulder-width apart, fingers slightly spread and clawing the floor.',
      'Enter via controlled scissor kick-up into a straight handstand.',
      'Immediately push shoulders up into active elevation.',
      'Stack wrists, elbows, shoulders, hips, and ankles in one vertical plumb line.',
      'Use fingertip pressure (underbalance) and heel-of-hand pressure (overbalance) to maintain balance.'
    ],
    formCues: [
      'Active shoulder push: reach your toes toward the ceiling',
      'Look slightly between your index fingers, not straight up at the ceiling',
      'Squeeze thighs together and point toes to eliminate body wiggle'
    ],
    commonMistakes: [
      'Arching back to compensate for tight shoulders',
      'Passive shoulders sinking into the joint sockets',
      'Kicking up with excessive force and overshooting balance'
    ],
    safetyPrecautions: ['Always have pirouette bailing reflex primed in case you fall backward'],
    easierAlternatives: ['Chest-to-wall balance taps', 'Freestanding kick-ups with spotter', 'Tuck freestanding handstand'],
    harderVariations: ['Handstand shapes (straddle, stag, diamond)', 'One-arm handstand progression', 'Handstand walking'],
    musclesTargeted: ['Deltoids', 'Trapezius (Upper & Lower)', 'Forearms / Wrists', 'Core Transverse', 'Glutes']
  },
  {
    id: 'skill-handstand-pushups',
    name: 'Handstand Push-ups (HSPU)',
    tier: 'advanced',
    category: 'push',
    prerequisites: ['skill-handstand', 'skill-dips'],
    nextProgressions: [],
    repsTarget: '4 sets of 5–8 strict wall / freestanding reps',
    description: 'Ultimate overhead pressing benchmark: lifting 100% of bodyweight vertically through strict shoulder and triceps power.',
    youtubeVideoId: 'N8QdJb2tE-A',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'Strict Handstand Push Up Tutorial',
    stepByStepInstructions: [
      'Kick up into a handstand facing away from or against the wall.',
      'Lower head forward in a tripod trajectory (head descends ahead of hands, forming a triangle).',
      'Lower until crown of head lightly taps floor or elevated deficit block.',
      'Elbows track forward at 45° angle (never flared out).',
      'Press aggressively backward and up, returning to locked overhead shoulder elevation.'
    ],
    formCues: [
      'Tripod head placement is critical: head travels forward on the way down',
      'Drive elbows inward toward the center line on the concentric press',
      'Keep core braced in hollow alignment throughout the press'
    ],
    commonMistakes: [
      'Dropping head directly between hands, jamming the shoulder joint',
      'Excessive banana arch in the lower back to turn it into an incline press'
    ],
    safetyPrecautions: [
      'Place a soft yoga block or mat beneath head during initial attempts to avoid head impact'
    ],
    easierAlternatives: ['Pike push-ups with feet elevated on box', 'Chest-to-wall HSPU negatives (5s lower)', 'Band-assisted HSPU'],
    harderVariations: ['Deficit HSPU on parallettes', 'Freestanding handstand push-up (zero wall)'],
    musclesTargeted: ['Anterior/Medial Deltoids', 'Triceps Brachii', 'Upper Trapezius', 'Pectoralis Major (Clavicular)', 'Core']
  },
  {
    id: 'skill-full-human-flag',
    name: 'Full Human Flag',
    tier: 'advanced',
    category: 'statics',
    prerequisites: ['skill-human-flag-prep'],
    nextProgressions: [],
    repsTarget: '4 sets of 5–10 seconds hold per side',
    description: 'One of the most visually stunning strength displays on Earth. The body defies gravity perpendicular to a vertical pole.',
    youtubeVideoId: 'z8dYtI32X4k',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'Human Flag Tutorial - Master the Move',
    stepByStepInstructions: [
      'Grip the vertical pole with bottom arm pushing with locked elbow and top arm pulling downward.',
      'Kick up smoothly and extend legs out horizontally parallel to the ground.',
      'Lock knees, point toes, and clamp glutes.',
      'Contract obliques and lateral core with maximum intensity to prevent hip drop.',
      'Hold the horizontal position and lower under control to feet.'
    ],
    formCues: [
      'Bottom arm tricep and anterior delt must act like an immovable steel rod',
      'Top lat pulls down continuously toward your ear',
      'Rotate hips slightly upward rather than downward'
    ],
    commonMistakes: [
      'Bottom elbow bending under load, losing the structural pillar',
      'Chest turning toward the ground instead of perpendicular to the pole'
    ],
    safetyPrecautions: ['Keep wrists aligned with vertical poles; do not twist joints under full bodyweight load'],
    easierAlternatives: ['Straddle human flag', 'One-leg human flag', 'Negative human flag lowers from top'],
    harderVariations: ['Human flag pull-ups', 'Human flag bicycle kicks', 'Human flag raises from bottom hang'],
    musclesTargeted: ['Lateral Obliques', 'Latissimus Dorsi', 'Anterior Deltoids', 'Triceps', 'Quadratus Lumborum']
  },
  {
    id: 'skill-advanced-muscle-up',
    name: 'Advanced Strict Muscle-up',
    tier: 'advanced',
    category: 'dynamics',
    prerequisites: ['skill-muscle-up'],
    nextProgressions: [],
    repsTarget: '3 sets of 5 strict reps (zero momentum)',
    description: 'Eliminates all swing, kip, and momentum. Pure slow concentric pulling power transitioning seamlessly into a straight-bar dip.',
    youtubeVideoId: 'ocS_kK4lG0E',
    videoChannel: 'Calisthenicmovement',
    videoTitle: 'Strict Muscle Up - Eliminate the Kip',
    stepByStepInstructions: [
      'Hang from bar with false grip (wrist resting over the top of the bar).',
      'Start from completely dead-hang with feet together, zero swing.',
      'Pull smoothly up, keeping torso upright and chest open.',
      'Transition shoulders over the bar in a slow, controlled forward roll.',
      'Press out the dip to full lockout, then reverse the motion slowly back down.'
    ],
    formCues: [
      'False grip is mandatory for zero-momentum transition',
      'Keep legs straight in an L-sit or hollow line to prevent any leg kick',
      'Descend as slowly as you ascended (controlled eccentric)'
    ],
    commonMistakes: [
      'Losing false grip halfway through the pull',
      'Kicking knees up at the transition point'
    ],
    safetyPrecautions: ['Condition wrists to false grip on low bars first to prevent carpal and tendon irritation'],
    easierAlternatives: ['Standard explosive muscle-up', 'Bar false-grip pull-ups to chest', 'Band-assisted strict muscle-up'],
    harderVariations: ['L-sit strict muscle-up', 'Slow 10-second tempo muscle-up', 'Ring strict muscle-up with turn out'],
    musclesTargeted: ['Latissimus Dorsi', 'Biceps', 'Triceps', 'Pecs', 'Forearm Flexors', 'Wrist Tendons']
  },
  {
    id: 'skill-one-arm-pull-up',
    name: 'One-Arm Pull-up Progression',
    tier: 'advanced',
    category: 'pull',
    prerequisites: ['skill-pull-ups', 'skill-full-front-lever'],
    nextProgressions: [],
    repsTarget: '4 sets of 2–3 reps per arm',
    description: 'The holy grail of bodyweight pulling strength. Hoisting 100% of total bodyweight with a single arm from dead-hang to chin-over-bar.',
    youtubeVideoId: 'mE4n_GZ1y3o',
    videoChannel: 'FitnessFAQs',
    videoTitle: 'How to One Arm Pull Up - Complete Guide',
    stepByStepInstructions: [
      'Hang from bar with working arm in a strong grip, other hand free or behind back.',
      'Actively engage scapula down and rotate working shoulder slightly inward.',
      'Drive elbow down toward hip with maximum pulling force.',
      'Keep core braced tightly to minimize lateral rotation.',
      'Pull until chin clears the bar, hold for a split second, and lower with control.'
    ],
    formCues: [
      'Keep the bar close to your shoulder to maximize mechanical leverage',
      'Squeeze the opposite fist hard to generate irradiation and full-body tension',
      'Scapular depression must initiate the pull before elbow bends'
    ],
    commonMistakes: [
      'Uncontrolled rotation spinning away from the bar',
      'Dropping quickly out of the top, risking distal bicep strain'
    ],
    safetyPrecautions: ['Requires a minimum of 20+ strict pull-ups or +70% bodyweight weighted pull-up before attempting'],
    easierAlternatives: ['Archer pull-ups', 'Fingertip assisted pull-ups', 'One-arm eccentric lowers with 5s count'],
    harderVariations: ['Strict dead-hang one-arm pull-up', 'One-arm L-sit pull-up'],
    musclesTargeted: ['Latissimus Dorsi', 'Biceps Brachii', 'Brachioradialis', 'Rotator Cuff', 'Core', 'Forearms']
  }
];

// ==========================================
// CALISTHENICS DAILY PRACTICE PLANS
// ==========================================
export const CALISTHENICS_ROUTINES: CalisthenicsRoutine[] = [
  {
    id: 'routine-beginner-foundations',
    title: 'Beginner Upper Body & Core Foundation',
    tier: 'beginner',
    durationMinutes: 40,
    focus: 'Horizontal & vertical push-pull strength with hollow core stability',
    description: 'The essential routine to build structural tendon integrity and baseline bodyweight mastery.',
    exercises: [
      { skillId: 'skill-push-ups', skillName: 'Standard Push-ups', sets: 3, repsOrHold: '12–15 reps', restSeconds: 90, notes: 'Full depth, locked elbows at top' },
      { skillId: 'skill-australian-rows', skillName: 'Australian Rows', sets: 3, repsOrHold: '12–15 reps', restSeconds: 90, notes: 'Touch chest to bar on every rep' },
      { skillId: 'skill-dips', skillName: 'Parallel Bar Dips', sets: 3, repsOrHold: '8–10 reps', restSeconds: 90, notes: 'Torso leaned forward, elbows 90°' },
      { skillId: 'skill-pull-ups', skillName: 'Dead-Hang Pull-ups', sets: 3, repsOrHold: '5–8 reps', restSeconds: 120, notes: 'Use band assistance if needed' },
      { skillId: 'skill-hollow-body-hold', skillName: 'Hollow Body Hold', sets: 3, repsOrHold: '30–45s hold', restSeconds: 60, notes: 'Lower back glued to floor' },
      { skillId: 'skill-plank', skillName: 'Hollow Plank', sets: 3, repsOrHold: '45–60s hold', restSeconds: 60, notes: 'Squeeze glutes in posterior pelvic tilt' }
    ]
  },
  {
    id: 'routine-handstand-balance',
    title: 'Handstand & Overhead Inversion Protocol',
    tier: 'intermediate',
    durationMinutes: 45,
    focus: 'Wrist conditioning, active shoulder elevation, and freestanding balance line',
    description: 'Comprehensive skill practice for conquering the freestanding handstand and handstand push-up.',
    exercises: [
      { skillId: 'skill-handstand', skillName: 'Chest-to-Wall Handstand Hold', sets: 4, repsOrHold: '45–60s hold', restSeconds: 90, notes: 'Active shoulder push, hollow ribs' },
      { skillId: 'skill-freestanding-handstand', skillName: 'Freestanding Kick-ups & Balance', sets: 5, repsOrHold: '5 attempts (max hold)', restSeconds: 90, notes: 'Finger clawing for balance control' },
      { skillId: 'skill-handstand-pushups', skillName: 'Pike / Wall Handstand Push-ups', sets: 4, repsOrHold: '5–8 reps', restSeconds: 120, notes: 'Tripod head forward descent' },
      { skillId: 'skill-l-sit', skillName: 'Parallettes L-Sit Hold', sets: 3, repsOrHold: '15–20s hold', restSeconds: 75, notes: 'Lock quads, shoulders depressed' },
      { skillId: 'skill-push-ups', skillName: 'Diamond Push-ups (Finisher)', sets: 3, repsOrHold: '10–12 reps', restSeconds: 60, notes: 'Burnout triceps and inner chest' }
    ]
  },
  {
    id: 'routine-lever-mastery',
    title: 'Front & Back Lever Isometric Power',
    tier: 'intermediate',
    durationMinutes: 50,
    focus: 'Straight-arm scapular depression, horizontal pulling, and posterior chain tension',
    description: 'Systematic progression routine to bridge tuck levers into full horizontal front and back levers.',
    exercises: [
      { skillId: 'skill-tuck-front-lever', skillName: 'Tuck / Adv. Tuck Front Lever Hold', sets: 4, repsOrHold: '15–20s hold', restSeconds: 120, notes: 'Elbows 100% straight, lats loaded' },
      { skillId: 'skill-tuck-back-lever', skillName: 'Tuck / Straddle Back Lever Hold', sets: 4, repsOrHold: '15–20s hold', restSeconds: 120, notes: 'German hang transition first' },
      { skillId: 'skill-dragon-flag', skillName: 'Dragon Flag Eccentric Lowers', sets: 3, repsOrHold: '6–8 reps', restSeconds: 90, notes: '3–4 second slow descent per rep' },
      { skillId: 'skill-pull-ups', skillName: 'High Chest-to-Bar Pull-ups', sets: 3, repsOrHold: '6–8 reps', restSeconds: 90, notes: 'Pull explosively to sternum' },
      { skillId: 'skill-human-flag-prep', skillName: 'Human Flag Chamber Prep', sets: 3, repsOrHold: '10s hold per side', restSeconds: 90, notes: 'Bottom arm pushes like a pillar' }
    ]
  },
  {
    id: 'routine-elite-mastery',
    title: 'Elite Calisthenics Dynamics & Statics',
    tier: 'advanced',
    durationMinutes: 60,
    focus: 'Muscle-up power, full front lever, planche leans, and one-arm pull mechanics',
    description: 'The ultimate advanced bodyweight challenge for elite athletes seeking full gravity mastery.',
    exercises: [
      { skillId: 'skill-muscle-up', skillName: 'Strict Muscle-up / Explosive Reps', sets: 4, repsOrHold: '3–5 clean reps', restSeconds: 150, notes: 'Simultaneous elbow transition' },
      { skillId: 'skill-full-front-lever', skillName: 'Full / Straddle Front Lever Holds', sets: 5, repsOrHold: '5–10s hold', restSeconds: 120, notes: 'Body locked in horizontal plane' },
      { skillId: 'skill-planche', skillName: 'Planche Leans / Tuck Planche', sets: 5, repsOrHold: '10–15s hold', restSeconds: 120, notes: 'Maximum scapular protraction' },
      { skillId: 'skill-one-arm-pull-up', skillName: 'Archer / Negative One-Arm Pulls', sets: 4, repsOrHold: '3 reps per arm', restSeconds: 120, notes: 'Irradiation from opposite fist' },
      { skillId: 'skill-full-human-flag', skillName: 'Full / Straddle Human Flag', sets: 3, repsOrHold: '5–8s per side', restSeconds: 120, notes: 'Lock obliques and lateral lats' }
    ]
  }
];
