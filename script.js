// High rarity card calculation parameters
const RARITY_PARAMS = {
    'R-6': {
      symbol: '⭐⭐',
      baseWeight: 40,
      progressionRate: 0.15,
      maxBonus: 3.0,
      thresholds: [
        { count: 5, bonus: 100 },
        { count: 10, bonus: 300 },
        { count: 20, bonus: 600 }
      ]
    },
    'R-7': {
      symbol: '⭐⭐⭐',
      baseWeight: 90,
      progressionRate: 0.25,
      maxBonus: 4.0,
      thresholds: [
        { count: 3, bonus: 200 },
        { count: 5, bonus: 500 },
        { count: 10, bonus: 1000 }
      ]
    },
    'R-8': {
      symbol: '👑',
      baseWeight: 475,
      progressionRate: 0.35,
      maxBonus: 5.0,
      thresholds: [
        { count: 2, bonus: 500 },
        { count: 3, bonus: 1000 },
        { count: 5, bonus: 2000 }
      ]
    }
  };
  
  // Combo bonus parameters
  const COMBO_BONUS = {
    'R67': 50,
    'R68': 100,
    'R78': 150,
    'R678': 300
  };
  
  // Tier definitions
  const TIERS = [
    { min: 10000, name: 'Legendary', className: 'tier-legendary' },
    { min: 5000, name: 'Mythic', className: 'tier-mythic' },
    { min: 2000, name: 'Epic', className: 'tier-epic' },
    { min: 1000, name: 'Rare', className: 'tier-rare' },
    { min: 200, name: 'Uncommon', className: 'tier-uncommon' },
    { min: 0, name: 'Common', className: 'tier-common' }
  ];
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Load data from local storage
    loadFromLocalStorage();
  });
  
  // Set up event listeners
  function setupEventListeners() {
    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', calculateRarityScore);
    
    // Input fields change
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 999) this.value = 999;
      });
    });
  }
  
  // Load data from local storage
  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('cardRarityCalc');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        document.getElementById('r6-count').value = data.r6Count || 0;
        document.getElementById('r7-count').value = data.r7Count || 0;
        document.getElementById('r8-count').value = data.r8Count || 0;
        
        // Display previous calculation results
        if (data.result) {
          displayResults(data.result);
          document.getElementById('results-container').classList.remove('hidden');
        }
      } catch (e) {
        console.error('Failed to load saved data', e);
      }
    }
  }
  
  // Save data to local storage
  function saveToLocalStorage(data) {
    try {
      localStorage.setItem('cardRarityCalc', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }
  
  // Calculate progressive weight for each card
  function calculateProgressiveWeight(rarity, count) {
    if (count <= 0) return 0;
    
    const params = RARITY_PARAMS[rarity];
    let totalWeight = 0;
    
    for (let i = 1; i <= count; i++) {
      const bonusMultiplier = Math.min(
        1 + (i - 1) * params.progressionRate,
        params.maxBonus
      );
      totalWeight += params.baseWeight * bonusMultiplier;
    }
    
    return totalWeight;
  }
  
  // Calculate threshold bonus
  function calculateThresholdBonus(rarity, count) {
    let bonus = 0;
    const thresholds = RARITY_PARAMS[rarity].thresholds;
    
    for (const threshold of thresholds) {
      if (count >= threshold.count) {
        bonus += threshold.bonus;
      }
    }
    
    return bonus;
  }
  
  // Calculate combo bonus
  function calculateComboBonus(r6Count, r7Count, r8Count) {
    let bonus = 0;
    
    const hasR6 = r6Count > 0;
    const hasR7 = r7Count > 0;
    const hasR8 = r8Count > 0;
    
    if (hasR6 && hasR7) bonus += COMBO_BONUS['R67'];
    if (hasR6 && hasR8) bonus += COMBO_BONUS['R68'];
    if (hasR7 && hasR8) bonus += COMBO_BONUS['R78'];
    
    if (hasR6 && hasR7 && hasR8) bonus += COMBO_BONUS['R678'];
    
    return bonus;
  }
  
  // Determine tier based on score
  function determineTier(score) {
    for (const tier of TIERS) {
      if (score >= tier.min) {
        return tier;
      }
    }
    return TIERS[TIERS.length - 1];
  }
  
  // Main calculation function
  function calculateRarityScore() {
    const r6Count = parseInt(document.getElementById('r6-count').value) || 0;
    const r7Count = parseInt(document.getElementById('r7-count').value) || 0;
    const r8Count = parseInt(document.getElementById('r8-count').value) || 0;
    
    // Calculate base weights
    const r6Weight = calculateProgressiveWeight('R-6', r6Count);
    const r7Weight = calculateProgressiveWeight('R-7', r7Count);
    const r8Weight = calculateProgressiveWeight('R-8', r8Count);
    
    // Calculate threshold bonuses
    const r6Bonus = calculateThresholdBonus('R-6', r6Count);
    const r7Bonus = calculateThresholdBonus('R-7', r7Count);
    const r8Bonus = calculateThresholdBonus('R-8', r8Count);
    
    // Calculate combo bonus
    const comboBonus = calculateComboBonus(r6Count, r7Count, r8Count);
    
    // Calculate total score
    const totalScore = r6Weight + r7Weight + r8Weight + 
                      r6Bonus + r7Bonus + r8Bonus + 
                      comboBonus;
    
    // Determine tier
    const tier = determineTier(totalScore);
    
    // Result object
    const result = {
      r6: { count: r6Count, weight: r6Weight, bonus: r6Bonus, symbol: RARITY_PARAMS['R-6'].symbol },
      r7: { count: r7Count, weight: r7Weight, bonus: r7Bonus, symbol: RARITY_PARAMS['R-7'].symbol },
      r8: { count: r8Count, weight: r8Weight, bonus: r8Bonus, symbol: RARITY_PARAMS['R-8'].symbol },
      comboBonus,
      totalScore,
      tier
    };
    
    // Display results
    displayResults(result);
    
    // Show results section
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');
    
    // Scroll animation
    setTimeout(() => {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    
    // Save to local storage
    saveToLocalStorage({
      r6Count,
      r7Count,
      r8Count,
      result
    });
  }
  
  // Display results function
  function displayResults(results) {
    const resultDetails = document.getElementById('result-details');
    const tierResult = document.getElementById('tier-result');
    
    // Display detailed results
    resultDetails.innerHTML = `
      <table>
        <tr>
          <th>Category</th>
          <th>Count</th>
          <th>Base Weight</th>
          <th>Threshold Bonus</th>
        </tr>
        <tr>
          <td>
            <span class="table-symbol">${results.r6.symbol}</span>
          </td>
          <td>${results.r6.count}</td>
          <td>${Math.round(results.r6.weight).toLocaleString()}</td>
          <td>${results.r6.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="table-symbol">${results.r7.symbol}</span>
          </td>
          <td>${results.r7.count}</td>
          <td>${Math.round(results.r7.weight).toLocaleString()}</td>
          <td>${results.r7.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="table-symbol">${results.r8.symbol}</span>
          </td>
          <td>${results.r8.count}</td>
          <td>${Math.round(results.r8.weight).toLocaleString()}</td>
          <td>${results.r8.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="3">Combo Bonus</td>
          <td>${results.comboBonus.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">Total Score</td>
          <td>${Math.round(results.totalScore).toLocaleString()}</td>
        </tr>
      </table>
    `;
    
    // Display tier result
    tierResult.innerHTML = `
      <h3>${results.tier.name}</h3>
      <p>${Math.round(results.totalScore).toLocaleString()} points</p>
    `;
    tierResult.className = `card result-card tier-display ${results.tier.className}`;
    
    // Animate results display
    animateResults();
  }
  
  // Results display animation
  function animateResults() {
    const rows = document.querySelectorAll('#result-details table tr');
    rows.forEach((row, index) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(20px)';
      row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });
  }