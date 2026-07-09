/**
 * Image object-position values for proper subject framing.
 * Default is "center center" (50% 50%).
 * Format: "x% y%" where x is horizontal, y is vertical.
 * Use when the subject is NOT in the center of the frame.
 */
export const imagePositions = {
  // Blog images - subjects not centered
  "maasai-cultural-experience-safari_blog.jpg":    "center 22%",   // Jumper is upper-center
  "shoebill-bird-wildlife-safari_blog.jpg":        "28% center",   // Face is on the left
  "turaco-bird-branch-wildlife-safari_blog.jpg":   "center 18%",   // Portrait, bird in upper area
  "small-bird-nature-watching-safari_blog.jpg":    "center 32%",   // Bird slightly above center
  "songbird-perched-on-branch-safari_blog.jpg":    "center 25%",   // Bird in upper area
  "raptor-bird-flying-clear-sky_blog.jpg":         "center 45%",   // Bird fills center, slight adjustment
  "flamingos-heart-about-simbali-wild-safaris_About.jpg": "center 42%", // Very wide, heart formation

  // Slider images
  "coastal-seabirds-flight-simbali-wild-safaris_Slide_2.jpg": "center 35%", // Birds in upper area
  "african-elephant-waterhole-safari-simbali-wild-safaris_Slid_1.jpg": "center 40%", // Elephants in mid-frame

  // Site images
  "impala-portrait-safari-simbali-wild-safaris.jpg":    "center 30%",   // Face in upper area
  "giraffes-savanna-safari-simbali-wild-safaris.jpg":   "center 25%",   // Tall portrait, focus on heads
  "white-rhinos-african-safari-simbali-wild-safaris.jpg": "center 35%", // Animals slightly low
  "lions-safari-vehicle-simbali-wild-safaris.jpg":      "center 40%",   // Lions in lower portion
  "leopard-tree-safari-simbali-wild-safaris.jpg":       "center 30%",   // Leopard in upper portion of tree
  "hot-air-balloon-zebra-safari-simbali-wild-safaris.jpg": "center 35%", // Balloon upper area
  "elephant-herd-waterhole-safari-simbali-wild-safaris.jpg": "center 40%", // Elephants in mid-lower
  "flamingos-wetland-habitat-safari_blog.jpg":          "center 40%",   // Flamingos slightly low
  "mountain-hiking-adventure-safari_blog.jpg":          "center 30%",   // Hiker in upper area
  "wildebeest-migration-herd-safari_blog.jpg":          "center 45%",   // Herd fills frame, slight adjust
  "wildebeest-river-crossing-safari-migration_blog.jpg": "center 40%", // Action in mid-frame
  "wildebeest-rocky-river-crossing-safari_blog.jpg":    "center 35%",   // Action slightly high
  "hippos-river-safari-simbali-wild-safaris.jpg":       "center 40%",   // Hippos at water level
  "serene-lakeside-mountain-landscape_blog.jpg":        "center 35%",   // Scenic, focus on mountain
  "birds-flying-over-grassland-safari_blog.jpg":        "center 30%",   // Birds in upper area
  "simbali-wild-safaris-guest-testimonial-man.jpg":     "center 30%",   // Face in upper area
};

/**
 * Get the object-position for a given image src path.
 * Returns the custom position if defined, otherwise "center" (default).
 */
export function getImagePosition(src) {
  // Extract filename from path
  const filename = src.split('/').pop();
  return imagePositions[filename] || "center";
}
