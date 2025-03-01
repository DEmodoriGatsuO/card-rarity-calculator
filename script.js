// 高レア度カードの計算パラメータ
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
  
  // コンボボーナス
  const COMBO_BONUS = {
    'R67': 50,
    'R68': 100,
    'R78': 150,
    'R678': 300
  };
  
  // ティア定義
  const TIERS = [
    { min: 10000, name: 'レジェンダリー', className: 'tier-legendary' },
    { min: 5000, name: 'ミシック', className: 'tier-mythic' },
    { min: 2000, name: 'エピック', className: 'tier-epic' },
    { min: 1000, name: 'レア', className: 'tier-rare' },
    { min: 200, name: 'アンコモン', className: 'tier-uncommon' },
    { min: 0, name: 'コモン', className: 'tier-common' }
  ];
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // イベントリスナー
    setupEventListeners();
    
    // ローカルストレージからデータを読み込む
    loadFromLocalStorage();
  });
  
  // イベントリスナーのセットアップ
  function setupEventListeners() {
    // 計算ボタン
    document.getElementById('calculate-btn').addEventListener('click', calculateRarityScore);
    
    // 増加ボタン
    document.querySelectorAll('.increment').forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.value = Math.min(999, parseInt(input.value || 0) + 1);
      });
    });
    
    // 減少ボタン
    document.querySelectorAll('.decrement').forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.value = Math.max(0, parseInt(input.value || 0) - 1);
      });
    });
    
    // 入力フィールドの変更
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 999) this.value = 999;
      });
    });
  }
  
  // ローカルストレージからデータを読み込む
  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('cardRarityCalc');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        document.getElementById('r6-count').value = data.r6Count || 0;
        document.getElementById('r7-count').value = data.r7Count || 0;
        document.getElementById('r8-count').value = data.r8Count || 0;
        
        // 前回の計算結果を表示
        if (data.result) {
          displayResults(data.result);
          document.getElementById('results-container').classList.remove('hidden');
        }
      } catch (e) {
        console.error('保存データの読み込みに失敗しました', e);
      }
    }
  }
  
  // ローカルストレージにデータを保存
  function saveToLocalStorage(data) {
    try {
      localStorage.setItem('cardRarityCalc', JSON.stringify(data));
    } catch (e) {
      console.error('データの保存に失敗しました', e);
    }
  }
  
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
    
    // 結果オブジェクト
    const result = {
      r6: { count: r6Count, weight: r6Weight, bonus: r6Bonus, symbol: RARITY_PARAMS['R-6'].symbol },
      r7: { count: r7Count, weight: r7Weight, bonus: r7Bonus, symbol: RARITY_PARAMS['R-7'].symbol },
      r8: { count: r8Count, weight: r8Weight, bonus: r8Bonus, symbol: RARITY_PARAMS['R-8'].symbol },
      comboBonus,
      totalScore,
      tier
    };
    
    // 結果表示
    displayResults(result);
    
    // 結果セクションを表示
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');
    
    // スクロールアニメーション
    setTimeout(() => {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    
    // ローカルストレージに保存
    saveToLocalStorage({
      r6Count,
      r7Count,
      r8Count,
      result
    });
  }
  
  // 結果表示関数
  function displayResults(results) {
    const resultDetails = document.getElementById('result-details');
    const tierResult = document.getElementById('tier-result');
    
    // 詳細結果表示
    resultDetails.innerHTML = `
      <table>
        <tr>
          <th>カテゴリ</th>
          <th>枚数</th>
          <th>基本重み</th>
          <th>閾値ボーナス</th>
        </tr>
        <tr>
          <td>
            <span class="rarity-symbol">${results.r6.symbol}</span>
            <span class="rarity-name">R-6</span>
          </td>
          <td>${results.r6.count}</td>
          <td>${Math.round(results.r6.weight).toLocaleString()}</td>
          <td>${results.r6.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="rarity-symbol">${results.r7.symbol}</span>
            <span class="rarity-name">R-7</span>
          </td>
          <td>${results.r7.count}</td>
          <td>${Math.round(results.r7.weight).toLocaleString()}</td>
          <td>${results.r7.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="rarity-symbol">${results.r8.symbol}</span>
            <span class="rarity-name">R-8</span>
          </td>
          <td>${results.r8.count}</td>
          <td>${Math.round(results.r8.weight).toLocaleString()}</td>
          <td>${results.r8.bonus.toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="3">コンボボーナス</td>
          <td>${results.comboBonus.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">総合スコア</td>
          <td>${Math.round(results.totalScore).toLocaleString()}</td>
        </tr>
      </table>
    `;
    
    // ティア結果表示
    tierResult.innerHTML = `
      <h3>${results.tier.name}</h3>
      <p>${Math.round(results.totalScore).toLocaleString()} ポイント</p>
    `;
    tierResult.className = `card result-card tier-display ${results.tier.className}`;
    
    // 結果を表示するアニメーション
    animateResults();
  }
  
  // 結果表示アニメーション
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