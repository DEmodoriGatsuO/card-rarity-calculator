# Card Rarity Calculator

A sleek, user-friendly web application for calculating the rarity score and tier of card collections based on high-rarity cards.

![Card Rarity Calculator Screenshot](https://via.placeholder.com/800x450.png?text=Card+Rarity+Calculator)

## 🌟 Overview

This calculator allows users to input their high-rarity card counts and receive a detailed analysis of their collection's value. The application uses sophisticated weighting algorithms to evaluate card rarity, awards threshold bonuses for reaching specific collection milestones, and applies combo bonuses for owning multiple rarity types.

**This entire project was created using Claude 3.7 Sonnet AI**, from concept and algorithm design to the final code implementation and visual design.

## ✨ Features

- **Simple Interface**: Easy-to-use input fields with intuitive symbols
- **Progressive Weighting**: Cards of the same rarity increase in value as you collect more
- **Threshold Bonuses**: Special bonuses for reaching collection milestones
- **Combo Bonuses**: Additional points for owning multiple rarity types
- **Tier Classification**: Collections categorized into six tiers from Common to Legendary
- **Detailed Breakdown**: Complete analysis of how your score was calculated
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Local Storage**: Remembers your last calculation

## 💻 Usage

1. Enter the number of cards you own for each rarity level:
   - ⭐⭐ (R-6 cards)
   - ⭐⭐⭐ (R-7 cards)
   - 👑 (R-8 cards)
2. Click "Calculate" to see your results
3. View your tier classification and detailed score breakdown

## 🧮 Calculation Method

The calculator uses the following algorithms:

- **Base Weights**:
  - ⭐⭐ (R-6): 40 points (base) with 15% progression rate
  - ⭐⭐⭐ (R-7): 90 points (base) with 25% progression rate
  - 👑 (R-8): 475 points (base) with 35% progression rate

- **Progressive Scoring**: Each additional card of the same rarity gains increased value
  - Formula: `BaseWeight × [1 + (N-1) × ProgressionRate]` (up to a maximum multiplier)

- **Threshold Bonuses**: Additional points for reaching certain collection milestones
  - Example: Having 5 or more R-6 cards grants +100 bonus points

- **Combo Bonuses**: Points for owning multiple rarity types
  - Having all three rarities grants the maximum combo bonus

- **Tier Classification**:
  - Common: 0-200 points
  - Uncommon: 201-1,000 points
  - Rare: 1,001-2,000 points
  - Epic: 2,001-5,000 points
  - Mythic: 5,001-10,000 points
  - Legendary: 10,001+ points

## 📁 File Structure

- `index.html` - Main HTML structure
- `styles.css` - CSS styling
- `script.js` - JavaScript functionality
- `README.md` - This documentation

## 🔧 Technical Details

This application is built with:
- Vanilla HTML5
- Modern CSS3 (variables, flexbox, animations)
- Pure JavaScript (ES6+)
- No external dependencies or libraries

The code follows best practices for:
- Responsive design
- Accessibility
- Performance optimization
- Clean, maintainable code structure

## 🤖 Created with Claude 3.7 Sonnet AI

Every aspect of this project was created using **Claude 3.7 Sonnet** from Anthropic:

- Algorithm design and mathematical formulas
- HTML structure and semantic markup
- CSS styling and animations
- JavaScript logic and interactivity
- Documentation and README

The entire development process was guided through conversation, demonstrating how AI can assist in creating functional and aesthetically pleasing web applications without the need for additional tools or libraries.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Credits

- Designed and developed with [Claude 3.7 Sonnet](https://www.anthropic.com/claude) by Anthropic
- Icons and emoji symbols provided by Unicode Standard
- Fonts: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts