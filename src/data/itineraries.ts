export interface ItineraryDay {
  day: number;
  description: string;
  accommodation: string;
  meals: string;
  transport: string;
  remarks: string;
}

export interface Itinerary {
  id: string;
  title: string;
  duration: string;
  country: string;
  type: string;
  description: string;
  highlights: string[];
  days: ItineraryDay[];
  included: string[];
  excluded: string[];
  pricingNote: string;
  paxRates?: { pax: number; rate: number }[];
}

export const itineraries: Itinerary[] = [
  {
    id: "kenya-honeymoon-8",
    title: "8-Day Kenya Honeymoon Safari",
    duration: "8 Days / 7 Nights",
    country: "Kenya",
    type: "Honeymoon",
    description: "A romantic 8-day safari through Kenya's most iconic destinations, from the rugged Samburu to the world-famous Maasai Mara.",
    highlights: ["Samburu National Reserve", "Ol Pejeta Conservancy & Chimpanzee Sanctuary", "Lake Naivasha Boat Safari", "Maasai Mara National Reserve", "Big Five & Special Five Wildlife"],
    days: [
      { day: 1, description: "Arrival at Jomo Kenyatta International Airport. Met by a representative and transferred to your hotel in Nairobi. Check in, relax, and enjoy your first evening in this vibrant city.", accommodation: "The Residences or similar (BB)", meals: "No Meals", transport: "City Car", remarks: "Arrival, Private Transfer" },
      { day: 2, description: "After breakfast, depart for Samburu National Reserve (approx. 5-6 hours). Enjoy scenic views along the way. Arrive at the camp for check-in and lunch. In the evening, head out for your first game drive in this unique northern reserve.", accommodation: "Samburu Intrepids or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer & evening game drive" },
      { day: 3, description: "Spend a full day in Samburu with morning and evening game drives. The reserve is known for special wildlife such as Grevy's zebra and reticulated giraffe. Enjoy time together at the camp between activities.", accommodation: "Samburu Intrepids or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Full day game drives & private dining" },
      { day: 4, description: "After breakfast, check out and drive to Ol Pejeta Conservancy (approx. 3-4 hours). Arrive in time for lunch and check-in. In the afternoon, enjoy a game drive and visit the chimpanzee sanctuary.", accommodation: "Sweetwaters Serena Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Conservancy visit" },
      { day: 5, description: "After breakfast, check out and drive to Lake Naivasha (approx. 4-5 hours). Arrive for check-in and lunch. In the afternoon, enjoy a peaceful boat safari among hippos and birds.", accommodation: "Lake Naivasha Sopa Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Boat safari" },
      { day: 6, description: "After breakfast, depart for Maasai Mara National Reserve (approx. 4-5 hours). Arrive at the camp for lunch and check-in. Later, enjoy an evening game drive in search of the Big Five.", accommodation: "Basecamp Masai Mara Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer & evening game drive" },
      { day: 7, description: "Full day in the Maasai Mara. Choose between morning and evening game drives or a full-day safari with picnic lunch. Optional hot air balloon safari for a special honeymoon experience (extra cost).", accommodation: "Basecamp Masai Mara Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Flexible game drives" },
      { day: 8, description: "After breakfast, check out and drive back to Nairobi (approx. 5-6 hours). Drop-off at Jomo Kenyatta International Airport for your departure flight.", accommodation: "No Accommodation", meals: "Breakfast", transport: "4x4 Safari Land Cruiser", remarks: "Departure" },
    ],
    included: ["Airport pick-up and drop-off", "Private road transfers throughout the safari", "Game drives in a 4x4 Safari Land Cruiser", "7 nights accommodation as listed", "Meals as stated (BB & FB)", "Park and conservancy fees", "Boat safari at Lake Naivasha", "English-speaking driver guide", "Honeymoon touches (room setup where possible)", "24/7 support"],
    excluded: ["International and local flights", "Travel insurance", "Tips for driver guide and lodge staff", "Personal items (e.g. medication, souvenirs)", "Optional activities (e.g. balloon safari, Maasai village visit)", "Anything not listed in the included section"],
    pricingNote: "Peak Season (July - October): From $4,500 per person sharing (based on 2 pax)",
    paxRates: [{ pax: 2, rate: 4500 }],
  },
  {
    id: "kenya-family-8",
    title: "8-Day Kenya Family Safari",
    duration: "8 Days / 7 Nights",
    country: "Kenya",
    type: "Family",
    description: "An unforgettable family adventure through Kenya's finest parks, featuring Amboseli's elephants, Lake Naivasha's boat safari, rhino tracking at Nakuru, and the legendary Maasai Mara.",
    highlights: ["Amboseli National Park & Mt. Kilimanjaro Views", "Lake Naivasha Boat Safari", "Lake Nakuru Rhino Tracking", "Maasai Mara Big Five Safari", "Family-friendly lodges with pools"],
    days: [
      { day: 1, description: "Arrival at Jomo Kenyatta International Airport. Met by a Simbali Wild representative, transferred to your hotel for check-in and rest.", accommodation: "Argyle Hotel or similar (BB)", meals: "No Meals", transport: "City Car (Sedan/Velfire)", remarks: "Arrival, Meet & Greet" },
      { day: 2, description: "Breakfast at the hotel, then safari briefing. Depart for Amboseli National Park (4-5 hrs). Arrive for check-in, then head out for an evening safari exploring elephant herds with Mt. Kilimanjaro views.", accommodation: "Oltukai Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer to Amboseli & evening game drive" },
      { day: 3, description: "Early morning game drive to catch elephant herds on the slopes. Return for lunch and poolside relaxation. Evening safari before dinner.", accommodation: "Oltukai Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Morning & evening game drive (Elephants & Mt. Kilimanjaro)" },
      { day: 4, description: "After breakfast, check-out and drive to Lake Naivasha. Arrive for lunch and check-in. Evening boat safari among water birds and hippos.", accommodation: "Lake Naivasha Sopa Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer to Lake Naivasha & Boat Safari" },
      { day: 5, description: "Breakfast and check-out for transfer to Lake Nakuru National Park. Mid-morning game drive en route to camp. Evening game drive to search for white and black rhinos.", accommodation: "Lake Nakuru Sopa Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Mid-morning and evening safari to search rhinos" },
      { day: 6, description: "Breakfast and check-out. Transfer to Masai Mara (4-5 hours). Check-in, lunch, then evening game drive in the land of the migrating wildebeest.", accommodation: "Zebra Plains Mara Camp (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Evening safari to search the Big 5" },
      { day: 7, description: "Explore Masai Mara with options for full-day game drive with picnic lunch or morning and evening safaris. Optional hot air balloon safari.", accommodation: "Zebra Plains Mara Camp (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Morning & evening safari to search the Big 5" },
      { day: 8, description: "Breakfast and check-out. Drive back to Nairobi (5-6 hours). Drop-off at hotel or airport. Only breakfast included; other meals self-pay or arranged on request.", accommodation: "No Accommodation", meals: "Breakfast", transport: "4x4 Safari Land Cruiser", remarks: "Transfer back to Nairobi and departure" },
    ],
    included: ["Airport pick-up and drop-off", "All ground transfers", "All game drives in 4x4 Safari Land Cruiser with pop-up roof", "7 nights accommodation", "All meals as specified (BB & FB)", "All park admission fees", "Boat safari", "English-speaking driver guide", "AMREF emergency evacuation cover", "24/7 support", "Pre-travel sharing session"],
    excluded: ["International and local airfares", "Travel insurance", "Tips and gratitude to driver-guides and hotel staff", "Items of personal nature", "Extra activities (balloon safari)", "Anything not in the included section"],
    pricingNote: "Peak Season (July - October): From $4,287 per person sharing (based on 2 pax)",
    paxRates: [{ pax: 2, rate: 4287 }],
  },
  {
    id: "kenya-tanzania-family-11",
    title: "11-Day Kenya-Tanzania Family Safari",
    duration: "11 Days / 10 Nights",
    country: "Kenya",
    type: "Family",
    description: "The ultimate cross-border family adventure combining Kenya's Maasai Mara and Amboseli with Tanzania's Serengeti and Ngorongoro Crater for an unforgettable East African experience.",
    highlights: ["Lake Naivasha Boat Safari & Lake Nakuru", "Maasai Mara National Reserve", "Serengeti National Park", "Ngorongoro Crater Safari", "Amboseli National Park & Mt. Kilimanjaro", "Cross-border adventure"],
    days: [
      { day: 1, description: "Arrival at Jomo Kenyatta International Airport. Met by a representative and transferred to your hotel in Nairobi for check-in and rest.", accommodation: "The Residences or similar (BB)", meals: "No Meals", transport: "City Car", remarks: "Arrival, Hotel Transfer" },
      { day: 2, description: "After breakfast, depart for Lake Naivasha for a boat safari. Continue to Lake Nakuru National Park. Enjoy a game drive on arrival as you head to the lodge for check-in.", accommodation: "Sopa Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Boat safari & Nakuru game drive" },
      { day: 3, description: "After breakfast, drive to Maasai Mara National Reserve. Arrive at the camp for lunch and check-in. Evening game drive. Optional Maasai village or balloon safari (extra cost).", accommodation: "Mara Elatia Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Evening game drive" },
      { day: 4, description: "Full day in the Maasai Mara. Choose between morning and evening game drives or a full-day game drive with picnic lunch.", accommodation: "Mara Elatia Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Flexible game drives" },
      { day: 5, description: "After breakfast, check out and drive to Isebania Border. Complete immigration and continue into Serengeti National Park. Lunch box on the way. Evening game drive before late check-in.", accommodation: "Kenzan Mara Migration Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Border crossing & long drive" },
      { day: 6, description: "Full day in the Serengeti with morning and evening game drives, or choose a full-day game drive with picnic lunch.", accommodation: "Kenzan Mara Migration Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Game drives" },
      { day: 7, description: "Another full day in the Serengeti with flexible game drives.", accommodation: "Kenzan Mara Migration Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Game drives" },
      { day: 8, description: "Head to Central Serengeti for safari with lunch box. Arrive at the camp in the evening for check-in, dinner and rest.", accommodation: "Mawe Tented Camp or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer & game drive" },
      { day: 9, description: "Check-out with lunch boxes and drive to Ngorongoro Crater for safari with picnic lunch. Depart for Karatu to arrive at the lodge in the evening.", accommodation: "Mawe Tented Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Crater game drive" },
      { day: 10, description: "After breakfast, drive to Amboseli National Park via the Namanga Border. Complete immigration and continue to the park. Evening game drive before check-in.", accommodation: "Oltukai Lodge or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Border crossing & evening game drive" },
      { day: 11, description: "Early morning game drive in Amboseli. Return for breakfast and check-out. Drive back to Nairobi with lunch boxes. Drop-off at Jomo Kenyatta International Airport.", accommodation: "No Accommodation", meals: "Breakfast & Lunch", transport: "4x4 Safari Land Cruiser", remarks: "Departure" },
    ],
    included: ["Airport pick-up and drop-off", "All ground transfers in Kenya & Tanzania", "Game drives in a 4x4 Safari Land Cruiser", "10 nights accommodation", "Meals as stated (BB & FB)", "All park entry fees in both countries", "Ngorongoro crater fees", "Boat safari at Lake Naivasha", "English-speaking driver guide", "Border crossing assistance", "24/7 support"],
    excluded: ["International and regional flights", "Travel insurance", "Visa fees (Kenya & Tanzania)", "Tips for driver guide and lodge staff", "Personal items", "Optional activities", "Anything not listed in the included section"],
    pricingNote: "Peak Season (July - October): From $6,730 per person sharing (based on 2 pax)",
    paxRates: [{ pax: 2, rate: 6730 }],
  },
  {
    id: "tanzania-family-8",
    title: "8-Day Tanzania Family Safari",
    duration: "8 Days / 7 Nights",
    country: "Tanzania",
    type: "Family",
    description: "A perfect family safari through Tanzania's Northern Circuit, featuring the elephant-rich Tarangire, the vast Serengeti plains, and the wildlife-packed Ngorongoro Crater.",
    highlights: ["Tarangire National Park (2 Days)", "Serengeti National Park (3 Days)", "Ngorongoro Crater Safari", "Big Five Wildlife Viewing", "Family-friendly accommodations"],
    days: [
      { day: 1, description: "Arrival at Kilimanjaro International Airport. Met by a representative and transferred to Arusha. Check in at your hotel and rest.", accommodation: "Mt. Meru Hotel or similar (BB)", meals: "No Meals", transport: "City Car", remarks: "Arrival, Meet & Greet" },
      { day: 2, description: "After breakfast, meet your driver guide for a safari briefing. Drive to Tarangire National Park (2-3 hours). Game drive on arrival as you head to camp for check-in and lunch. Evening game drive.", accommodation: "Nyikani Camp Tarangire (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Game drives in Tarangire" },
      { day: 3, description: "Full day in Tarangire with morning and afternoon game drives. The park is known for large elephant herds and baobab trees.", accommodation: "Nyikani Camp Tarangire (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Full day game drives" },
      { day: 4, description: "After breakfast, check out and drive to Serengeti National Park. Game viewing along the way. Arrive at camp for check-in, lunch, and rest. Evening safari before dinner.", accommodation: "Nyikani Camp Serengeti (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer with game drive" },
      { day: 5, description: "Full day in the Serengeti with morning and afternoon game drives. Look out for lions, elephants, giraffes, and other wildlife.", accommodation: "Nyikani Camp Serengeti (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Full day game drives" },
      { day: 6, description: "Another full day in the Serengeti. Choose a full-day game drive with picnic lunch or morning and evening game drives.", accommodation: "Nyikani Camp Serengeti (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Flexible game drives" },
      { day: 7, description: "After breakfast, check out and drive to Ngorongoro Crater. Descend into the crater for a game drive where you may see rhinos, lions, and many other animals. Drive to the lodge for dinner.", accommodation: "Ngorongoro Serena Lodge (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Crater game drive" },
      { day: 8, description: "After breakfast, check out and drive back to Arusha. Transfer to Kilimanjaro International Airport for your departure flight.", accommodation: "No Accommodation", meals: "Breakfast", transport: "4x4 Safari Land Cruiser", remarks: "Departure" },
    ],
    included: ["Airport pick-up and drop-off", "All ground transfers", "All game drives in 4x4 Safari Land Cruiser with pop-up roof", "7 nights accommodation", "All meals as specified (BB & FB)", "All park entry and activities fees", "English-speaking driver guide", "AMREF emergency evacuation cover", "24/7 customer support", "Pre-travel sharing session"],
    excluded: ["International and local airfares", "Travel insurance", "Tips and gratitude to driver-guides and hotel staff", "Items of personal nature", "Extra activities (balloon safari)", "Anything not in the included section"],
    pricingNote: "Peak Season (July - October): From $4,440 per person sharing (based on 2 pax)",
    paxRates: [
      { pax: 1, rate: 5715 },
      { pax: 2, rate: 4440 },
      { pax: 3, rate: 4015 },
      { pax: 4, rate: 3805 },
      { pax: 5, rate: 3680 },
      { pax: 6, rate: 3590 },
    ],
  },
  {
    id: "tanzania-honeymoon-8",
    title: "8-Day Tanzania Honeymoon Safari",
    duration: "8 Days / 7 Nights",
    country: "Tanzania",
    type: "Honeymoon",
    description: "A romantic honeymoon journey through Tanzania's most iconic landscapes, featuring Tarangire's elephants, Ngorongoro Crater, and the legendary Serengeti with a scenic flight back.",
    highlights: ["Tarangire National Park", "Karatu Farm House Retreat", "Ngorongoro Crater Safari", "Serengeti National Park", "Scenic flight from Serengeti to Arusha"],
    days: [
      { day: 1, description: "Arrival at Kilimanjaro International Airport. Met by a representative and transferred to Arusha. Check in at your lodge and relax after your journey.", accommodation: "Mount Meru Game Lodge or similar (BB)", meals: "No Meals", transport: "City Car", remarks: "Arrival, Private Transfer" },
      { day: 2, description: "After breakfast, meet your driver guide for a safari briefing. Drive to Tarangire National Park (approx. 2-3 hours). Game drive en route to the lodge for check-in and lunch. Evening game drive.", accommodation: "Elephant Springs or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Game drive" },
      { day: 3, description: "Full day in Tarangire with morning and evening game drives. The park is known for large elephant herds and baobab trees. Enjoy time at the lodge between activities.", accommodation: "Elephant Springs or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Full day game drives" },
      { day: 4, description: "After breakfast, check out and drive to Karatu (approx. 3-4 hours). Arrive for check-in and lunch. Afternoon at leisure to relax and enjoy the peaceful surroundings.", accommodation: "Karatu Farm House or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer & rest" },
      { day: 5, description: "After breakfast, drive to Ngorongoro Crater. Descend into the crater for a game drive with picnic lunch. Later, head to your lodge on the crater rim for dinner and overnight.", accommodation: "Lions Paw or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Crater game drive" },
      { day: 6, description: "After breakfast, drive to Serengeti National Park. Enjoy game viewing along the way. Arrive at the camp for check-in, dinner, and overnight.", accommodation: "Sametu Serengeti or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Transfer with game drive" },
      { day: 7, description: "Full day in the Serengeti with morning and evening game drives, or choose a full-day safari with picnic lunch. Return to camp in the evening.", accommodation: "Sametu Serengeti or similar (FB)", meals: "Breakfast, Lunch & Dinner", transport: "4x4 Safari Land Cruiser", remarks: "Flexible game drives" },
      { day: 8, description: "After breakfast, check out and transfer to the nearest airstrip for a scheduled flight back to Arusha. Connect to your departure flight.", accommodation: "No Accommodation", meals: "Breakfast", transport: "Road Transfer + Flight", remarks: "Departure" },
    ],
    included: ["Airport pick-up and drop-off", "All ground transfers and internal flight (Serengeti - Arusha)", "Game drives in a 4x4 Safari Land Cruiser", "7 nights accommodation as listed", "Meals as stated (BB & FB)", "Park and crater fees", "English-speaking driver guide", "Honeymoon touches (room setup where available)", "24/7 support"],
    excluded: ["International flights", "Travel insurance", "Tips for driver guide and lodge staff", "Personal items (e.g. medication, souvenirs)", "Optional activities", "Anything not listed in the included section"],
    pricingNote: "Peak Season (July - October): From $5,620 per person sharing (based on 2 pax)",
    paxRates: [{ pax: 2, rate: 5620 }],
  },
];

export function getItinerariesByCountry(country: string): Itinerary[] {
  return itineraries.filter((i) => i.country === country);
}

export const countries = ["Kenya", "Tanzania", "Uganda", "Rwanda", "Burundi"];
