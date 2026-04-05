const fs = require("fs");
const path = require("path");

// List of plan icons exactly as in your page.tsx `plans` array
const planIcons = [
  "starter-cheetah",
  "boost-buffalo",
  "growthengine-rhino",
  "marketleader-elephant",
  "superactivevisibility-lion",
];

// Path to your public/icons folder
const iconsDir = path.join(__dirname, "public", "icons");

planIcons.forEach((iconName) => {
  const iconPath = path.join(iconsDir, `${iconName}.jpg`);

  if (!fs.existsSync(iconPath)) {
    console.error(`❌ Missing icon: ${iconName}.jpg`);
  } else {
    console.log(`✅ Found icon: ${iconName}.jpg`);
  }
});