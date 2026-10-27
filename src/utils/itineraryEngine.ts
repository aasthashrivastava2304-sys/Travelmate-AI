import { DayPlan, Trip, TripPlannerInput } from '../types/travel';

// Curated database of destination highlights for smart client-side generation
interface DestinationData {
  coverImage: string;
  overviewTemplate: string;
  landmarks: { title: string; location: string; category: any; description: string; tips: string; cost: number }[];
  diningSpots: { breakfast: string; lunch: string; dinner: string }[];
  tips: string[];
}

const DESTINATION_KNOWLEDGE: Record<string, DestinationData> = {
  kyoto: {
    coverImage: '/src/assets/images/destination_kyoto_japan_1793115200217.jpg',
    overviewTemplate: 'A bespoke cultural immersion through Kyoto’s thousand-year temples, serene moss gardens, Michelin culinary gems, and preserved bamboo sanctuaries.',
    landmarks: [
      { title: 'Fushimi Inari Taisha 10,000 Torii Pilgrimage', location: 'Fushimi Inari Shrine', category: 'Culture', description: 'Wander through serpentine tunnels of sacred vermilion torii gates stretching along the pine-clad slopes of Mount Inari.', tips: 'Go early around 7:00 AM before tour coaches arrive.', cost: 0 },
      { title: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Sanctuary', location: 'Arashiyama, Ukyo Ward', category: 'Nature', description: 'Walk beneath soaring green bamboo stalks and contemplate the 14th-century pond garden of Tenryu-ji.', tips: 'Listen for the natural rustling sound of the bamboo stalks in the wind.', cost: 20 },
      { title: 'Kinkaku-ji (Golden Pavilion) & Mirror Pond', location: 'Kita Ward, Kyoto', category: 'Sightseeing', description: 'Behold the top two floors of this Zen temple completely cloaked in genuine gold leaf reflecting upon Kyoko-chi pond.', tips: 'The afternoon light creates the most brilliant reflections on the water.', cost: 25 },
      { title: 'Gion Historic Geisha District & Shirakawa Canal', location: 'Gion, Higashiyama', category: 'Culture', description: 'Stroll cobblestone alleys flanked by traditional wooden machiya merchant houses and willow-shaded canals.', tips: 'Respect photography restrictions on private alleys.', cost: 0 },
      { title: 'Kiyomizu-dera Cliffside Stage & Otowa Waterfall', location: 'Higashiyama Ward', category: 'Sightseeing', description: 'Stand upon the cantilevered wooden stage built without a single nail, offering panoramic vistas over Kyoto’s cherry and maple canopy.', tips: 'Drink from one of three streams at Otowa Waterfall for health or success.', cost: 15 },
      { title: 'Nishiki Culinary Market Tasting Walk', location: 'Nakagyo Ward, Kyoto', category: 'Food', description: 'Sample skewers of grilled unagi, sweet dashi tamagoyaki, matcha warabi mochi, and artisanal pickled vegetables.', tips: 'Enjoy each skewer in front of the stall rather than walking while eating.', cost: 40 },
      { title: 'Philosopher’s Path Scenic Canal Trail', location: 'Sakyo Ward, Kyoto', category: 'Nature', description: 'Follow the peaceful stone footpath along Lake Biwa Canal, pausing at secluded Honen-in and Ginkaku-ji.', tips: 'Honen-in entrance features beautiful raked sand waves.', cost: 10 },
      { title: 'Traditional Urasenke Matcha Tea Ceremony', location: 'Higashiyama Tearoom', category: 'Culture', description: 'Participate in the mindful discipline of Japanese tea preparation guided by a certified tea master.', tips: 'Wear clean socks to step respectfully into the tatami room.', cost: 65 },
    ],
    diningSpots: [
      { breakfast: 'Matcha lattes & warm brioche at % Arabica Higashiyama', lunch: 'Artisanal soba in 500-year-old courtyard at Honke Owariya', dinner: 'Multi-course Kyoto kaiseki at Gion Sasaki with local Junmai Daiginjo' },
      { breakfast: 'Traditional Japanese ryokan breakfast tray', lunch: 'Yudofu (simmered tofu) overlooking gardens at Junsei', dinner: 'Kurobuta pork katsu with fresh sesame dressing at Katsukura' },
      { breakfast: 'Coffee & fluffy egg sandwich at Smart Coffee Teramachi', lunch: 'Inari sushi and handmade udon at Kendonya', dinner: 'Sake brewery tasting dinner with duck hotpot at Torisei Fushimi' },
    ],
    tips: [
      'Get an ICOCA IC transport card for seamless tap-and-go subway, bus, and vending machine payments.',
      'Cash is still required at small temple stalls, traditional tearooms, and craft souvenir workshops.',
      'Book famous dining spots and kaiseki dinners 3-4 weeks in advance.',
      'Early mornings (before 8:30 AM) offer peaceful sightseeing with virtually no crowds.',
    ],
  },
  amalfi: {
    coverImage: '/src/assets/images/destination_amalfi_coast_1793115201319.jpg',
    overviewTemplate: 'A sun-drenched Mediterranean escape along Italy’s most breathtaking coastline, featuring pastel cliffside villages, private boat charters to Capri, and cliffside seafood dining.',
    landmarks: [
      { title: 'Positano Spiaggia Grande & Clifftop Alleys', location: 'Positano, Salerno', category: 'Sightseeing', description: 'Explore pastel-hued buildings cascading down steep cliffs to the sparkling Tyrrhenian Sea.', tips: 'Wear comfortable flat shoes for the cobblestone stairs.', cost: 0 },
      { title: 'Private Capri & Faraglioni Sea Caves Cruise', location: 'Gulf of Salerno & Capri', category: 'Adventure', description: 'Charter an Italian wooden gozzo boat to cruise around Capri’s iconic Faraglioni arches and swim in emerald grottos.', tips: 'Bring a towel and snorkel; the captain will stop at secluded coves.', cost: 180 },
      { title: 'Path of the Gods (Sentiero degli Dei) Clifftop Hike', location: 'Bomerano to Nocelle', category: 'Adventure', description: 'Trek high above the Mediterranean along historic donkey paths with jaw-dropping panoramic views of Capri.', tips: 'Start from Bomerano so the trail goes gently downhill with continuous ocean vistas.', cost: 15 },
      { title: 'Villa Cimbrone Infinity Terrace & Ravello Gardens', location: 'Ravello, Campania', category: 'Culture', description: 'Admire marble bust statues on the Terrazza dell’Infinito, where the cliff edge seemingly blends into the sea.', tips: 'Ravello is 1,200 feet above the coast and cooler in the afternoon.', cost: 25 },
      { title: 'Amalfi Duomo & Arab-Norman Cloister of Paradise', location: 'Piazza del Duomo, Amalfi', category: 'Sightseeing', description: 'Ascend the 62 steps to the 9th-century cathedral featuring Byzantine striped arches and bronze doors from Constantinople.', tips: 'Visit historic Pasticceria Pansa across the square for lemon delizia cake.', cost: 10 },
      { title: 'Artisanal Limoncello & Terraced Lemon Grove Tour', location: 'Minori / Amalfi Hills', category: 'Food', description: 'Walk through fragrant terraced lemon pergolas and taste chilled artisanal limoncello made from sfusato amalfitano lemons.', tips: 'Buy vacuum-sealed lemon specialties to safely pack in your luggage.', cost: 45 },
    ],
    diningSpots: [
      { breakfast: 'Espresso & sfogliatella at Bar Internazionale', lunch: 'Spaghetti alle Vongole beachside at Chez Black', dinner: 'Candlelit dining on cliff terrace at La Sponda (Le Sirenuse)' },
      { breakfast: 'Cappuccino & cornetto with sea views at hotel', lunch: 'Caprese salad and grilled calamari at beach club La Fontelina', dinner: 'Handmade scialatielli pasta with lemon and clams at Ristorante Max' },
      { breakfast: 'Fresh fruit & ricotta pastries at Pasticceria Pansa', lunch: 'Neapolitan pizza Margherita at Da Gemma in Amalfi', dinner: 'Terrace feast under lemon trellises at Cumpa’ Cosimo in Ravello' },
    ],
    tips: [
      'Take high-speed ferries between coastal towns to avoid slow, winding cliff road traffic.',
      'Porters are available at Positano port and will transport heavy luggage uphill for a small fee.',
      'Reserve Capri boat tours and beach club sunbeds in advance during peak season.',
      'Chilled Limoncello is customarily served ice-cold as a complimentary digestif after dinner.',
    ],
  },
  swiss: {
    coverImage: '/src/assets/images/destination_swiss_alps_1793115205492.jpg',
    overviewTemplate: 'A majestic alpine journey across Switzerland’s grand peaks, emerald glacial valleys of 72 waterfalls, and world-renowned panoramic train journeys.',
    landmarks: [
      { title: 'Lauterbrunnen Valley & Staubbach Waterfall Plume', location: 'Lauterbrunnen, Bernese Oberland', category: 'Nature', description: 'Explore the deep glacial valley flanked by 1,000-foot limestone cliffs and walk behind Staubbach Falls.', tips: 'Sit on the right side of the train from Interlaken for the best first glimpse.', cost: 0 },
      { title: 'Trümmelbach Underground Glacial Chasm Waterfalls', location: 'Lauterbrunnen Valley', category: 'Adventure', description: 'Take the mountain tunnel lift inside the rock to see 20,000 liters of glacial meltwater roaring through corkscrew caverns.', tips: 'Bring a lightweight waterproof jacket as the mist inside is cool.', cost: 18 },
      { title: 'Matterhorn Glacier Paradise & Klein Matterhorn Cable Car', location: 'Zermatt, Valais', category: 'Sightseeing', description: 'Ascend Europe’s highest cable car station at 3,883 meters for a 360-degree panorama of 38 alpine peaks.', tips: 'Visit the underground Glacier Palace ice sculptures carved deep inside the glacier.', cost: 95 },
      { title: 'Gornergrat Cogwheel Railway & Riffelsee Reflection', location: 'Zermatt to Gornergrat', category: 'Nature', description: 'Ride Switzerland’s first electric cogwheel railway to see the iconic reflection of the Matterhorn in Lake Riffelsee.', tips: 'Walk between Rotenboden and Riffelberg stations for pristine alpine flower meadows.', cost: 65 },
      { title: 'Jungfraujoch Top of Europe High-Alpine Station', location: 'Jungfrau Region', category: 'Adventure', description: 'Journey through the Eiger mountain tunnels to the highest train station in Europe overlooking Aletsch Glacier.', tips: 'Check the live summit webcam before boarding to verify clear visibility.', cost: 120 },
      { title: 'Traditional Swiss Cheese Fondue & Raclette Experience', location: 'Zermatt Village', category: 'Food', description: 'Dip warm crusty bread and roasted potatoes into bubbling Gruyère and Vacherin Fribourgeois fondue.', tips: 'Pair fondue with dry Swiss Fendant white wine or warm black tea.', cost: 55 },
    ],
    diningSpots: [
      { breakfast: 'Swiss birchermüesli & fresh mountain dairy butter', lunch: 'Rösti with organic fried egg and speck at Hotel Oberland', dinner: 'Alpine cheese fondue with Valais white wine at Ferdinand Zermatt' },
      { breakfast: 'Fresh croissants & espresso overlooking the Matterhorn', lunch: 'Smoked trout and barley soup at mountain hut Chez Vrony', dinner: 'Dry-aged Swiss beef and raclette at Walliserkanne' },
      { breakfast: 'Hot chocolate and warm pastries at Bakery Fuchs Zermatt', lunch: 'Alpine bratwurst with mustard on sun terrace at Riffelalp', dinner: 'Rustic alpine dinner with potato rosti and apple strudel' },
    ],
    tips: [
      'The Swiss Travel Pass provides unlimited travel on trains, boats, buses, and 50% discounts on mountain cableways.',
      'Zermatt and Wengen are 100% car-free villages; only electric carts and horse carriages operate.',
      'Tap water in all public village fountains is pure potable mountain spring water.',
      'Alpine weather shifts quickly; always pack moisture-wicking layers and sunglasses for high altitudes.',
    ],
  },
  santorini: {
    coverImage: '/src/assets/images/destination_santorini_greece_1793115202532.jpg',
    overviewTemplate: 'A romantic Cycladic getaway exploring caldera rim cliff villages, volcanic sailing catamarans, ancient Akrotiri ruins, and world-class sunset terraces.',
    landmarks: [
      { title: 'Oia Sunset Castle Lookout & Blue Domes', location: 'Oia, Santorini', category: 'Sightseeing', description: 'Witness the Aegean sun dip below the horizon painting whitewashed windmills and blue church domes in gold and rose.', tips: 'Arrive at the Byzantine castle ruins 90 minutes before sunset for the best spot.', cost: 0 },
      { title: 'Caldera Catamaran Sailing Cruise & Volcanic Hot Springs', location: 'Santorini Caldera', category: 'Adventure', description: 'Sail past Red Beach and White Beach, swim in volcanic geothermal sulfur springs, and feast on grilled Greek souvlaki onboard.', tips: 'Wear a dark swimsuit as the sulfur springs can tint white swimwear.', cost: 135 },
      { title: 'Fira to Oia Scenic Clifftop Rim Trek', location: 'Santorini Caldera Rim', category: 'Nature', description: 'Hike 10 kilometers along the rugged rim of the volcanic caldera with uninterrupted views of the Aegean Sea.', tips: 'Start at 7:30 AM before midday Mediterranean heat kicks in; carry 1.5L water.', cost: 0 },
      { title: 'Prehistoric Akrotiri Archaeological Site', location: 'Akrotiri, Southern Santorini', category: 'Culture', description: 'Walk through the remarkably preserved Bronze Age Minoan city preserved beneath volcanic ash from the 16th century BC eruption.', tips: 'Hiring an onsite guide reveals remarkable plumbing and multi-story engineering details.', cost: 20 },
      { title: 'Assyrtiko Wine Tasting at Cliffside Winery', location: 'Santo Wines / Venetsanos', category: 'Food', description: 'Sample mineral-rich crisp white Assyrtiko wines grown in volcanic basket vines overlooking caldera cliffs.', tips: 'Book a sunset tasting table on the cliffside terrace in advance.', cost: 45 },
    ],
    diningSpots: [
      { breakfast: 'Greek yogurt with thyme honey and walnuts on balcony', lunch: 'Fresh grilled octopus and fava puree at Ammoudi Bay Taverna', dinner: 'Cliffside sunset dining at Ambrosia Restaurant in Oia' },
      { breakfast: 'Spanakopita and iced freddo espresso at local bakery', lunch: 'Santorini tomato fritters (tomatokeftedes) at Metaxi Mas', dinner: 'Fresh Aegean sea bass and crisp Assyrtiko at Sunset Taverna' },
    ],
    tips: [
      'Do not flush toilet paper in Greece; use the disposal bins provided.',
      'Rent a local quad/ATV or use the KTEL public bus system to explore beaches easily.',
      'Ammoudi Bay at the foot of Oia is the premier spot for freshly grilled sea catch.',
      'Wear shoes with good traction as marble paths in Oia and Fira can be slippery.',
    ],
  },
};

// Generic generator for custom destinations
function getDestinationInfo(destination: string): DestinationData {
  const normalized = destination.toLowerCase();
  for (const [key, val] of Object.entries(DESTINATION_KNOWLEDGE)) {
    if (normalized.includes(key)) {
      return val;
    }
  }

  // Fallback high-fidelity profile for any other world destination!
  return {
    coverImage: '/src/assets/images/travel_planner_hero_1793115202512.jpg',
    overviewTemplate: `A personalized itinerary crafted for ${destination}, combining iconic architectural landmarks, local gastronomic culinary delights, scenic viewpoints, and authentic neighborhood discoveries.`,
    landmarks: [
      {
        title: `Historic Old Town & Central Square Tour`,
        location: `Historic Quarter, ${destination}`,
        category: 'Culture',
        description: `Stroll through cobblestone streets, marvel at preserved heritage architecture, and soak in the vibrant atmosphere of ${destination}’s oldest district.`,
        tips: `Join a local morning walking tour to uncover untold folklore and hidden courtyards.`,
        cost: 15,
      },
      {
        title: `Iconic Landmark & Panorama Observation Deck`,
        location: `Central ${destination}`,
        category: 'Sightseeing',
        description: `Ascend to the highest observation vantage point for a stunning 360-degree panoramic view across the city skyline and surrounding natural landscape.`,
        tips: `Book the timed entry slot just prior to golden hour for both daytime and twilight photography.`,
        cost: 30,
      },
      {
        title: `Artisanal Food Market & Street Fare Tasting`,
        location: `Market Quarter, ${destination}`,
        category: 'Food',
        description: `Explore sensory market stalls brimming with seasonal regional produce, freshly baked breads, aged cheeses, and local street specialities.`,
        tips: `Look for stalls with the longest queues of local residents.`,
        cost: 35,
      },
      {
        title: `Botanical Gardens & Waterfront Promenade`,
        location: `Riverside / Coastal District, ${destination}`,
        category: 'Nature',
        description: `Enjoy a relaxing walk through lush landscaped gardens or alongside scenic waters, unwinding amidst manicured greenery and historic fountains.`,
        tips: `Rent a cruiser bicycle for an easy spin along the riverside path.`,
        cost: 10,
      },
      {
        title: `Premier Art & History Museum Exhibition`,
        location: `Museum Mile, ${destination}`,
        category: 'Culture',
        description: `Immerse yourself in world-class art collections, contemporary installations, and ancient artifacts showcasing the region’s rich cultural evolution.`,
        tips: `Audio guides are worth the extra few dollars for curator commentary.`,
        cost: 25,
      },
      {
        title: `Scenic Sunset Hilltop Lookout & Wine Toast`,
        location: `Hilltop Vista, ${destination}`,
        category: 'Relaxation',
        description: `Watch the sunset cast warm amber tones across ${destination} while enjoying regional wine or crafted local beverages.`,
        tips: `Pack a lightweight layer as hilltop breezes pick up after dusk.`,
        cost: 20,
      },
      {
        title: `Outdoor Adventure & Natural Landmark Trail`,
        location: `National Park / Regional Reserve, ${destination}`,
        category: 'Adventure',
        description: `Hike scenic trails past dramatic geological formations, cascading streams, and tranquil panoramic lookouts.`,
        tips: `Wear sturdy trail footwear and bring ample drinking water.`,
        cost: 15,
      },
    ],
    diningSpots: [
      {
        breakfast: `Fresh artisanal pastries, fruit bowl, and specialty roast coffee at local café`,
        lunch: `Regional classic tasting plate with fresh local ingredients at a cozy bistro`,
        dinner: `Fine contemporary dining highlighting seasonal specialties with sommelier wine pairing`,
      },
      {
        breakfast: `Traditional morning hot breakfast with fresh eggs and homemade sourdough`,
        lunch: `Gourmet market hall tasting skewers and local craft cider`,
        dinner: `Farm-to-table dinner featuring wood-roasted mains and decadent local dessert`,
      },
    ],
    tips: [
      `Download offline maps and regional transit apps on your mobile device before departure.`,
      `Carry both a credit card with zero foreign transaction fees and a small amount of local currency.`,
      `Learn 4-5 basic polite phrases in the local language; locals appreciate the respectful gesture.`,
      `Keep digital copies of your passport and travel insurance saved in your secure mobile wallet.`,
    ],
  };
}

// Format date helper
function formatDateString(dateStr: string, offsetDays: number): string {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return `Day ${offsetDays + 1}`;
  }
}

// Calculate duration in days between two dates
export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 3;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return 3;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), 14); // between 1 and 14 days
}

// High-fidelity generator that produces complete, verified trips
export function generateItineraryLocally(input: TripPlannerInput): Trip {
  const destInfo = getDestinationInfo(input.destination);
  const daysCount = Math.max(1, Math.min(input.durationDays || 4, 14));
  
  // Calculate budget breakdown based on budgetTier and days
  const budgetTierMultiplier: Record<string, number> = {
    'Budget': 120,
    'Moderate': 250,
    'Luxury': 480,
    'Ultra-Luxury': 950,
  };

  const dailyBase = budgetTierMultiplier[input.budgetTier] || 250;
  const calculatedTotal = input.totalBudget > 0 ? input.totalBudget : dailyBase * daysCount * input.travelers;

  const accommodationBudget = Math.round(calculatedTotal * 0.44);
  const diningBudget = Math.round(calculatedTotal * 0.26);
  const activitiesBudget = Math.round(calculatedTotal * 0.15);
  const transportBudget = Math.round(calculatedTotal * 0.10);
  const miscBudget = calculatedTotal - (accommodationBudget + diningBudget + activitiesBudget + transportBudget);

  const days: DayPlan[] = [];

  for (let i = 0; i < daysCount; i++) {
    const dayNum = i + 1;
    const dateFormatted = formatDateString(input.startDate, i);
    const landmarkIdx = i % destInfo.landmarks.length;
    const landmark2Idx = (i + 1) % destInfo.landmarks.length;
    const landmark3Idx = (i + 2) % destInfo.landmarks.length;

    const diningIdx = i % destInfo.diningSpots.length;
    const dining = destInfo.diningSpots[diningIdx];

    const l1 = destInfo.landmarks[landmarkIdx];
    const l2 = destInfo.landmarks[landmark2Idx];
    const l3 = destInfo.landmarks[landmark3Idx];

    const morningSlot = {
      id: `act-${dayNum}-m`,
      title: l1.title,
      time: '09:00 AM - 12:00 PM',
      duration: '3.0 hrs',
      category: l1.category,
      description: l1.description,
      location: l1.location,
      estimatedCost: l1.cost,
      transportNote: `${input.transportPreference || 'Public Transit'} from hotel`,
      tips: l1.tips,
      completed: false,
    };

    const afternoonSlot = {
      id: `act-${dayNum}-a`,
      title: l2.title,
      time: '01:30 PM - 04:30 PM',
      duration: '3.0 hrs',
      category: l2.category,
      description: l2.description,
      location: l2.location,
      estimatedCost: l2.cost,
      transportNote: `Short transfer or scenic walk from morning venue`,
      tips: l2.tips,
      completed: false,
    };

    const eveningSlot = {
      id: `act-${dayNum}-e`,
      title: l3.title,
      time: '06:00 PM - 09:30 PM',
      duration: '3.5 hrs',
      category: l3.category,
      description: l3.description,
      location: l3.location,
      estimatedCost: l3.cost,
      transportNote: `Leisurely evening stroll or quick taxi ride`,
      tips: l3.tips,
      completed: false,
    };

    const dayThemes = [
      'Iconic Highlights & Arrival Impressions',
      'Ancient Heritage & Local Gastronomy',
      'Panoramic Vistas & Nature Excursions',
      'Arts, Culture & Hidden Neighborhoods',
      'Artisanal Craftsmanship & Scenic Trails',
      'Waterfront Discovery & Twilight Celebrations',
      'Farewell Traditions & Sunset Panorama',
    ];

    days.push({
      dayNumber: dayNum,
      date: dateFormatted,
      theme: dayThemes[(dayNum - 1) % dayThemes.length],
      transitSummary: `${input.transportPreference || 'Local transit & walking'} recommended for this route`,
      estimatedDayCost: Math.round(calculatedTotal / daysCount),
      dining,
      morning: morningSlot,
      afternoon: afternoonSlot,
      evening: eveningSlot,
    });
  }

  const tripId = `trip-${Date.now()}`;
  const nowIso = new Date().toISOString();

  return {
    ...input,
    id: tripId,
    title: `${input.destination} ${input.travelStyle || 'Curated'} Experience`,
    coverImage: destInfo.coverImage,
    status: 'Upcoming',
    tripOverview: destInfo.overviewTemplate,
    days,
    budgetBreakdown: {
      accommodation: accommodationBudget,
      dining: diningBudget,
      activities: activitiesBudget,
      transportation: transportBudget,
      misc: miscBudget,
      total: calculatedTotal,
    },
    essentialTips: destInfo.tips,
    createdAt: nowIso,
    updatedAt: nowIso,
    source: 'smart-generator',
  };
}
