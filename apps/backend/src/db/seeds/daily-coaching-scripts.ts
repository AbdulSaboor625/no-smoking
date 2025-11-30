/**
 * Daily Coaching Scripts Seed Data
 * 365 days of motivational messages for smoking cessation
 * Based on "The New Way to Stop Smoking" methodology
 */

export interface DailyCoachingScript {
  dayNumber: number;
  title: string;
  message: string;
  actionStep: string;
  identityReminder: string;
  category: string;
}

export const dailyCoachingScripts: DailyCoachingScript[] = [
  // DAYS 1-30: Detailed scripts from original plan
  {
    dayNumber: 1,
    title: "The First Step",
    message: "Today is simple:\nYou're staying nicotine-free until bedtime.\nNot forever.\nJust today.\n\nYou can handle one day.\nAnd you just did the hardest part — starting.",
    actionStep: "Focus only on staying nicotine-free until you go to bed tonight.",
    identityReminder: "You are a non-smoker today.",
    category: "identity_building"
  },
  {
    dayNumber: 2,
    title: "The 'Automatic Habit' Lie",
    message: "You didn't smoke because you liked it.\nYou smoked because nicotine trained you to.\n\nYour brain has patterns, not preferences.\nToday, we interrupt them.",
    actionStep: "Notice one automatic pattern where you used to reach for nicotine.",
    identityReminder: "You're not weak — the nicotine was powerful. But you are stronger.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 3,
    title: "Cravings Are Not Commands",
    message: "A craving is not a danger.\nIt's a suggestion.\nAnd suggestions can be ignored.\n\nToday when cravings show up, say:\n\"This will pass. It always does.\"",
    actionStep: "When a craving appears, acknowledge it and wait 2 minutes.",
    identityReminder: "You decide what to do with cravings. They don't decide for you.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 4,
    title: "5-Minute Rule",
    message: "Every craving peaks and fades in 2–5 minutes.\n\nToday, when it shows up:\nSet a timer → breathe → wait.\n\nEvery craving defeated is a victory.",
    actionStep: "Set a 5-minute timer when the next craving hits.",
    identityReminder: "You are building strength with every craving you outlast.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 5,
    title: "Coffee Trigger",
    message: "If you usually smoke/vape with coffee, today do this instead:\n\nHold the cup with both hands.\nTake 3 slow breaths.\nSay out loud:\n\"The addiction doesn't get my morning anymore.\"\n\nYou win.",
    actionStep: "Practice the three-breath coffee ritual.",
    identityReminder: "Your mornings belong to you, not to addiction.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 6,
    title: "Meals Trigger",
    message: "After eating, stand up and walk for 60 seconds.\nYour brain expects nicotine.\nYou break the loop by breaking the pattern.\n\nToday you take control.",
    actionStep: "After your next meal, take a 60-second walk.",
    identityReminder: "You are rewriting your routines.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 7,
    title: "One Week Strong",
    message: "One week is not luck.\nOne week is discipline, awareness, and intelligence.\n\nToday's message:\nYou should be proud of yourself.\nYou're becoming a non-smoker.",
    actionStep: "Acknowledge your progress. Tell someone you trust about your week.",
    identityReminder: "You are becoming a non-smoker.",
    category: "identity_building"
  },
  {
    dayNumber: 8,
    title: "Identity Shift",
    message: "Smokers crave.\nNon-smokers breathe.\n\nToday, you are a non-smoker practicing breathing.",
    actionStep: "Three times today, take 3 deep breaths and remind yourself: I'm a non-smoker.",
    identityReminder: "You are a non-smoker practicing breathing.",
    category: "identity_building"
  },
  {
    dayNumber: 9,
    title: "Addictions Beg You Back",
    message: "The addiction will whisper today:\n\"Just one.\"\n\"One won't hurt.\"\n\"You earned it.\"\n\nThis is not you talking.\nIt's the addiction begging for survival.\n\nYou don't negotiate with addiction.",
    actionStep: "When you hear the voice, say out loud: 'That's not me talking.'",
    identityReminder: "You don't negotiate with addiction.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 10,
    title: "Stress Without Nicotine",
    message: "You never needed nicotine for stress.\nStress is natural.\nNicotine just distracted you.\n\nToday, breathe.\nYou are stronger than your old coping lie.",
    actionStep: "When stressed today, breathe deeply for 60 seconds instead of reaching for nicotine.",
    identityReminder: "You handle stress like a non-smoker now.",
    category: "stress_management"
  },
  {
    dayNumber: 11,
    title: "The Craving Wave",
    message: "Cravings rise, peak, fall.\nAlways.\n\nToday remember:\n\"It will pass. It always does.\"\n\nAnd it will.",
    actionStep: "Visualize the craving as a wave that will crash and recede.",
    identityReminder: "Cravings are temporary. Your freedom is permanent.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 12,
    title: "Driving Trigger",
    message: "If driving triggers you, today turn off the radio for 60 seconds.\nThis breaks the autopilot.\n\nPause. Breathe. Drive.\n\nYou're in control.",
    actionStep: "Next time you drive, try 60 seconds of silence and breathing.",
    identityReminder: "You are in control of your actions.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 13,
    title: "The Addiction Is Losing Strength",
    message: "Day by day, the cravings are shorter and weaker.\nYou may not notice, but your brain does.\n\nToday's message:\nYou're winning.",
    actionStep: "Notice if today's cravings feel weaker than day 1.",
    identityReminder: "You're winning.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 14,
    title: "Two Weeks Free",
    message: "If you've made it this far, you can go a lifetime.\n\nToday is another notch in your freedom.",
    actionStep: "Celebrate this milestone in a healthy way (good meal, favorite activity).",
    identityReminder: "Two weeks proves you can do this.",
    category: "identity_building"
  },
  {
    dayNumber: 15,
    title: "After-Work Trigger",
    message: "Today, before going home:\nTake 3 breaths.\nSay: \"I'm ending my day as a non-smoker.\"\n\nIdentity is everything.",
    actionStep: "Create an end-of-work ritual that doesn't involve nicotine.",
    identityReminder: "I'm ending my day as a non-smoker.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 16,
    title: "Social Situations",
    message: "You don't need nicotine to socialize.\nYou never did.\nToday, notice how much more present you feel without it.",
    actionStep: "If you're in a social situation, focus on being present.",
    identityReminder: "You are fully present without nicotine.",
    category: "social_confidence"
  },
  {
    dayNumber: 17,
    title: "The Voice of Doubt",
    message: "If the voice says \"you can't do this,\" respond with:\n\"I already am.\"\nBecause you are.",
    actionStep: "Counter negative thoughts with evidence of your progress.",
    identityReminder: "I already am doing this.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 18,
    title: "Nicotine Isn't Relief",
    message: "Nicotine causes the stress that nicotine claims to relieve.\n\nToday, take real relief:\nBreathing, movement, stillness.",
    actionStep: "Find one healthy stress relief activity you enjoy.",
    identityReminder: "You find real relief in healthy activities.",
    category: "stress_management"
  },
  {
    dayNumber: 19,
    title: "Breaking the Loop",
    message: "Today, look for one old trigger.\nInterrupt it.\nChange it.\nRewrite it.\n\nYou are rewriting your life.",
    actionStep: "Identify one trigger pattern and change something about it.",
    identityReminder: "You are rewriting your life.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 20,
    title: "Cravings Are Memories",
    message: "Most cravings at this point are not chemical —\nthey're memories.\n\nMemories fade when they are not fed.\n\nToday, starve the memory.",
    actionStep: "Recognize that cravings are just old memories, not needs.",
    identityReminder: "Cravings are memories that fade.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 21,
    title: "Three Weeks Free",
    message: "Your brain chemistry has significantly changed.\nYou are calmer, clearer, and more in control than you've been in years.\n\nToday, celebrate quietly.",
    actionStep: "Take a moment to appreciate how far you've come.",
    identityReminder: "You are calmer, clearer, and more in control.",
    category: "identity_building"
  },
  {
    dayNumber: 22,
    title: "The Real You",
    message: "You never wanted to smoke/vape.\nThe addiction wanted it.\n\nToday, you are living as your true self.",
    actionStep: "Notice one way you feel more like yourself without nicotine.",
    identityReminder: "Today, you are living as your true self.",
    category: "identity_building"
  },
  {
    dayNumber: 23,
    title: "Momentum",
    message: "Momentum is powerful.\nEvery day without nicotine makes the next day easier.\n\nToday, protect your momentum.",
    actionStep: "Avoid high-risk situations that could derail your momentum.",
    identityReminder: "Every day makes the next easier.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 24,
    title: "Craving Interrogation",
    message: "If a craving comes today, ask:\n\"What triggered this?\"\nIdentifying triggers = reducing them.\n\nAwareness is power.",
    actionStep: "Log any cravings and identify what triggered them.",
    identityReminder: "Awareness is power.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 25,
    title: "Your Future Self",
    message: "Imagine yourself 90 days from now:\nMore energy\nBetter breathing\nMore confidence\nMore time\nMore money\n\nToday is part of that future.",
    actionStep: "Write down 3 things you're looking forward to at 90 days.",
    identityReminder: "Today is building your future.",
    category: "future_motivation"
  },
  {
    dayNumber: 26,
    title: "Vaping Lies",
    message: "Vaping tells you: \"At least I'm not smoking.\"\n\nBut addiction is addiction.\n\nToday, break the lie.",
    actionStep: "Recognize that nicotine is nicotine, regardless of delivery method.",
    identityReminder: "You are free from all forms of nicotine.",
    category: "freedom_mindset"
  },
  {
    dayNumber: 27,
    title: "Emotional Waves",
    message: "Feelings will rise and fall today.\nLet them.\n\nYou don't smoke at feelings anymore.",
    actionStep: "Feel your emotions without using nicotine to numb them.",
    identityReminder: "You don't smoke at feelings anymore.",
    category: "stress_management"
  },
  {
    dayNumber: 28,
    title: "Four Weeks Free",
    message: "Four weeks is huge.\n\nYou are no longer the person you were a month ago.",
    actionStep: "Reflect on how you've changed in the past 4 weeks.",
    identityReminder: "You are no longer the person you were a month ago.",
    category: "identity_building"
  },
  {
    dayNumber: 29,
    title: "Energy Returns",
    message: "Your body is healing.\nYour blood is cleaner.\nYour breathing is easier.\nYour brain is sharper.\n\nToday, notice one improvement.",
    actionStep: "Pay attention to one physical improvement you've experienced.",
    identityReminder: "Your body is healing.",
    category: "health_improvement"
  },
  {
    dayNumber: 30,
    title: "One Month Strong",
    message: "This is a major milestone.\nWhat you've done is rare and powerful.\n\nThis month rewired your identity.\n\nToday, you walk with confidence.",
    actionStep: "Celebrate this major milestone. You've earned it.",
    identityReminder: "Today, you walk with confidence.",
    category: "identity_building"
  },

  // DAYS 31-90: Early consolidation phase
  {
    dayNumber: 31,
    title: "The New Normal",
    message: "Being nicotine-free is becoming your new normal.\nThe old patterns are fading.\nThe new identity is strengthening.\n\nYou're not just quitting—you're transforming.",
    actionStep: "Notice what feels normal now that felt difficult before.",
    identityReminder: "This is your new normal.",
    category: "identity_building"
  },
  {
    dayNumber: 32,
    title: "Protecting Your Progress",
    message: "You've built something valuable over the past month.\nGuard it carefully.\nDon't let one weak moment undo your hard work.\n\nYou've come too far.",
    actionStep: "Identify your biggest remaining trigger and plan for it.",
    identityReminder: "I protect what I've built.",
    category: "relapse_prevention"
  },
  {
    dayNumber: 33,
    title: "Social Confidence Growing",
    message: "You're learning that you can be social, relaxed, and yourself without nicotine.\nThis is real confidence.\nNot chemical confidence.",
    actionStep: "Put yourself in a social situation and notice your natural confidence.",
    identityReminder: "My confidence is real, not chemical.",
    category: "social_confidence"
  },
  {
    dayNumber: 34,
    title: "Morning Power",
    message: "Remember when mornings meant nicotine first?\nNow they mean freedom.\n\nYour mornings are yours again.",
    actionStep: "Create a positive morning routine that has nothing to do with nicotine.",
    identityReminder: "My mornings are mine.",
    category: "trigger_mastery"
  },
  {
    dayNumber: 35,
    title: "The Money You're Saving",
    message: "Check your stats.\nLook at the money you've saved.\n\nThat's real. Tangible. Yours to keep.\n\nEvery day adds to it.",
    actionStep: "Check your money saved counter and plan something meaningful with those savings.",
    identityReminder: "I'm investing in my future, not in addiction.",
    category: "financial_freedom"
  },
  {
    dayNumber: 36,
    title: "Handling Setbacks",
    message: "If you had a close call recently, that's normal.\nWhat matters is that you didn't give in.\n\nClose calls make you stronger.",
    actionStep: "If you had a close call, identify what helped you resist.",
    identityReminder: "Close calls make me stronger.",
    category: "resilience"
  },
  {
    dayNumber: 37,
    title: "The Breathing Difference",
    message: "Your lungs are healing.\nBreathing is easier.\nYour endurance is improving.\n\nNotice the difference when you move, exercise, or climb stairs.",
    actionStep: "Do something physical and notice how your breathing has improved.",
    identityReminder: "My lungs are healing.",
    category: "health_improvement"
  },
  {
    dayNumber: 38,
    title: "Reframing Stress",
    message: "Stress used to mean: reach for nicotine.\nNow stress means: breathe, think, act.\n\nYou're learning real coping skills.",
    actionStep: "Next time you're stressed, use the 4-7-8 breathing technique.",
    identityReminder: "I have real coping skills now.",
    category: "stress_management"
  },
  {
    dayNumber: 39,
    title: "Becoming Unbreakable",
    message: "Every day you stay nicotine-free, your resolve strengthens.\nYou're becoming mentally unbreakable.\n\nThis is who you are now.",
    actionStep: "Reflect on your mental strength today.",
    identityReminder: "I am mentally unbreakable.",
    category: "identity_building"
  },
  {
    dayNumber: 40,
    title: "Forty Days of Freedom",
    message: "Forty days is biblical.\nIt's transformative.\nYou've transformed.\n\nKeep going.",
    actionStep: "Acknowledge how much you've changed in 40 days.",
    identityReminder: "I have transformed.",
    category: "identity_building"
  },

  // Continue pattern for days 41-90 (similar structure, varying themes)
  ...generateDays(41, 90, [
    "trigger_mastery",
    "identity_building",
    "social_confidence",
    "stress_management",
    "health_improvement",
    "relapse_prevention"
  ]),

  // DAYS 91-180: Deep consolidation
  ...generateDays(91, 180, [
    "identity_building",
    "relapse_prevention",
    "social_confidence",
    "future_motivation",
    "health_improvement",
    "financial_freedom"
  ]),

  // DAYS 181-365: Long-term freedom
  ...generateDays(181, 365, [
    "identity_building",
    "relapse_prevention",
    "resilience",
    "future_motivation",
    "health_improvement",
    "life_improvement"
  ])
];

/**
 * Generate coaching scripts for a range of days using templates
 */
function generateDays(start: number, end: number, categories: string[]): DailyCoachingScript[] {
  const scripts: DailyCoachingScript[] = [];
  const templates = getTemplatesByCategory();

  for (let day = start; day <= end; day++) {
    const categoryIndex = (day - start) % categories.length;
    const category = categories[categoryIndex];
    const template = templates[category as keyof ReturnType<typeof getTemplatesByCategory>][day % templates[category as keyof ReturnType<typeof getTemplatesByCategory>].length];

    scripts.push({
      dayNumber: day,
      ...template
    });
  }

  return scripts;
}

/**
 * Templates organized by category
 */
function getTemplatesByCategory() {
  return {
    trigger_mastery: [
      {
        title: "Mastering Your Triggers",
        message: "You know your triggers now.\nYou see them coming.\nYou prepare for them.\n\nThat's mastery.",
        actionStep: "Identify your strongest remaining trigger and create a specific plan for it.",
        identityReminder: "I am the master of my triggers.",
        category: "trigger_mastery"
      },
      {
        title: "Pattern Recognition",
        message: "You've learned to spot the patterns.\nThe situations, the times, the emotions.\n\nAwareness breaks the autopilot.",
        actionStep: "Notice one pattern you've successfully interrupted.",
        identityReminder: "I see the patterns and I break them.",
        category: "trigger_mastery"
      }
    ],
    identity_building: [
      {
        title: "The Person You're Becoming",
        message: "Look how far you've come.\nYou're not the same person who started this journey.\n\nYou're stronger. Clearer. Free.",
        actionStep: "Write down 3 ways you've changed since quitting.",
        identityReminder: "I am becoming my best self.",
        category: "identity_building"
      },
      {
        title: "Living Free",
        message: "Freedom isn't just about saying no to nicotine.\nIt's about saying yes to life.\n\nYou're living free.",
        actionStep: "Do something today you couldn't fully enjoy while addicted.",
        identityReminder: "I live free.",
        category: "identity_building"
      }
    ],
    social_confidence: [
      {
        title: "Social Without Substances",
        message: "You're proving you don't need nicotine to be social.\nYour real personality shines through.\n\nThis is the real you.",
        actionStep: "Engage socially today without thinking about nicotine.",
        identityReminder: "My real personality shines without nicotine.",
        category: "social_confidence"
      }
    ],
    stress_management: [
      {
        title: "Real Stress Management",
        message: "You're learning that real stress relief comes from:\nBreathing. Movement. Connection. Rest.\n\nNot from feeding addiction.",
        actionStep: "Practice one healthy stress relief technique today.",
        identityReminder: "I manage stress like a non-smoker.",
        category: "stress_management"
      }
    ],
    health_improvement: [
      {
        title: "Your Body Healing",
        message: "Your body is amazing.\nIt's been healing since the day you quit.\n\nEvery day, you get stronger.",
        actionStep: "Notice one physical improvement you've experienced.",
        identityReminder: "My body is healing and getting stronger.",
        category: "health_improvement"
      }
    ],
    relapse_prevention: [
      {
        title: "Staying Vigilant",
        message: "Complacency is the enemy of freedom.\nStay aware. Stay committed.\n\nOne day at a time, always.",
        actionStep: "Recommit to your quit journey today.",
        identityReminder: "I stay vigilant and committed.",
        category: "relapse_prevention"
      }
    ],
    resilience: [
      {
        title: "Unshakeable Resilience",
        message: "You've faced cravings. Triggers. Tough moments.\nAnd you're still here.\n\nThat's resilience.",
        actionStep: "Reflect on a difficult moment you overcame.",
        identityReminder: "I am resilient.",
        category: "resilience"
      }
    ],
    future_motivation: [
      {
        title: "Building Your Future",
        message: "Every day nicotine-free is an investment in your future.\nBetter health. More money. More time.\n\nYou're building something valuable.",
        actionStep: "Visualize yourself one year from now, still nicotine-free.",
        identityReminder: "I'm building a better future.",
        category: "future_motivation"
      }
    ],
    financial_freedom: [
      {
        title: "Financial Freedom",
        message: "The money you're saving adds up.\nThat's freedom in your wallet.\n\nYou're not funding addiction anymore.",
        actionStep: "Check your savings and plan something meaningful.",
        identityReminder: "I invest in myself, not in addiction.",
        category: "financial_freedom"
      }
    ],
    life_improvement: [
      {
        title: "Life Gets Better",
        message: "Life without nicotine is fuller.\nRicher. More present.\n\nYou're experiencing it all.",
        actionStep: "Notice one way life is better now.",
        identityReminder: "My life is better without nicotine.",
        category: "life_improvement"
      }
    ]
  };
}
