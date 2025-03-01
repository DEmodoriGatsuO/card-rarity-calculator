// 高レア度カードの計算パラメータ
const RARITY_PARAMS = {
  'R-6': {
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

// コンボボーナス
const COMBO_BONUS = {
  'R67': 50,
  'R68': 100,
  'R78': 150,
  'R678': 300
};

// ティア定義
const TIERS = [
  { min: 10000, name: 'レジェンダリー', color: '#FF4000' },
  { min: 5000, name: 'ミシック', color: '#FF8000' },
  { min: 2000, name: 'エピック', color: '#A335EE' },
  { min: 1000, name: 'レア', color: '#0070DD' },
  { min: 200, name: 'アンコモン', color: '#00CC00' },
  { min: 0, name: 'コモン', color: '#A0A0A0' }
];

// 枚数ごとの重み計算
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

// 閾値ボーナス計算
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

// コンボボーナス計算
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

// ティア判定
function determineTier(score) {
  for (const tier of TIERS) {
    if (score >= tier.min) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

// メイン計算関数
function calculateRarityScore() {
  const r6Count = parseInt(document.getElementById('r6-count').value) || 0;
  const r7Count = parseInt(document.getElementById('r7-count').value) || 0;
  const r8Count = parseInt(document.getElementById('r8-count').value) || 0;
  
  // 基本重み計算
  const r6Weight = calculateProgressiveWeight('R-6', r6Count);
  const r7Weight = calculateProgressiveWeight('R-7', r7Count);
  const r8Weight = calculateProgressiveWeight('R-8', r8Count);
  
  // 閾値ボーナス計算
  const r6Bonus = calculateThresholdBonus('R-6', r6Count);
  const r7Bonus = calculateThresholdBonus('R-7', r7Count);
  const r8Bonus = calculateThresholdBonus('R-8', r8Count);
  
  // コンボボーナス計算
  const comboBonus = calculateComboBonus(r6Count, r7Count, r8Count);
  
  // 総合スコア計算
  const totalScore = r6Weight + r7Weight + r8Weight + 
                    r6Bonus + r7Bonus + r8Bonus + 
                    comboBonus;
  
  // ティア判定
  const tier = determineTier(totalScore);
  
  // 結果表示
  displayResults({
    r6: { count: r6Count, weight: r6Weight, bonus: r6Bonus },
    r7: { count: r7Count, weight: r7Weight, bonus: r7Bonus },
    r8: { count: r8Count, weight: r8Weight, bonus: r8Bonus },
    comboBonus,
    totalScore,
    tier
  });
}

// 結果表示関数
function displayResults(results) {
  const resultDetails = document.getElementById('result-details');
  const tierResult = document.getElementById('tier-result');
  
  // 詳細結果表示
  resultDetails.innerHTML = `
    <table>
      <tr><th>カテゴリ</th><th>枚数</th><th>基本重み</th><th>閾値ボーナス</th></tr>
      <tr>
        <td>R-6</td>
        <td>${results.r6.count}</td>
        <td>${Math.round(results.r6.weight)}</td>
        <td>${results.r6.bonus}</td>
      </tr>
      <tr>
        <td>R-7</td>
        <td>${results.r7.count}</td>
        <td>${Math.round(results.r7.weight)}</td>
        <td>${results.r7.bonus}</td>
      </tr>
      <tr>
        <td>R-8</td>
        <td>${results.r8.count}</td>
        <td>${Math.round(results.r8.weight)}</td>
        <td>${results.r8.bonus}</td>
      </tr>
      <tr>
        <td colspan="3">コンボボーナス</td>
        <td>${results.comboBonus}</td>
      </tr>
      <tr class="total-row">
        <td colspan="3">総合スコア</td>
        <td>${Math.round(results.totalScore)}</td>
      </tr>
    </table>
  `;
  
  // ティア結果表示
  tierResult.innerHTML = `
    <div class="tier-display" style="color: ${results.tier.color}">
      <h3>${results.tier.name}</h3>
      <p>${Math.round(results.totalScore)} ポイント</p>
    </div>
  `;
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('calculate-btn').addEventListener('click', calculateRarityScore);
});