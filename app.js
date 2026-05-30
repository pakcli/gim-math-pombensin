/* ==========================================================================
   Petualangan Pom Bensin - Game Engine & Math Solver
   Features: Multi-step interactive story, bilingual texts, custom synthesized SFX,
   dynamic cartoon SVGs, and responsive math logic.
   ========================================================================== */

// 1. Translation Dictionary (Indonesian & English)
const translations = {
  id: {
    statusInit: "🔴 MULAI DARI NOL ya!",
    starLabel: "Bintang",
    streakLabel: "Streak",
    needLitersQuestion: "Berapa liter bensin yang dibutuhkan untuk memenuhi tangki mobil?",
    costQuestion: "Berapa total harga bensin jika 1 Liter harganya {price}?",
    enoughQuestion: "Bapak memberikan uang {cash}. Apakah uang Bapak cukup untuk mengisi full tank?",
    changeQuestion: "Uang Bapak cukup! Berapa uang kembalian yang harus diberikan kepada Bapak?",
    shortageQuestion: "Uang Bapak kurang! Berapa kekurangan uang yang harus Bapak bayar lagi?",
    mathFormulaLabel: "Rumus Pintar:",
    nextBtnText: "Pertanyaan Berikutnya ➡️",
    pumpBtnText: "Isi Bensin Sekarang! ⚡",
    greatJob: "Hebat! Jawabanmu Benar! 🎉",
    wrongAnswer: "Aduh, Kurang Tepat! 🥺",
    step1Label: "Kebutuhan",
    step2Label: "Total Biaya",
    step3Label: "Cukup?",
    step4Label: "Uang Sekarang",
    step1Desc: "Bensin yang dibutuhkan = Kapasitas Tangki - Bensin Sekarang",
    step2Desc: "Total Biaya = Bensin yang dibutuhkan x Harga per Liter",
    step3Desc: "Bandingkan Uang Bapak ({cash}) dengan Total Biaya ({cost})",
    step4EnoughDesc: "Uang Kembalian = Uang Bapak - Total Biaya",
    step4ShortDesc: "Kekurangan Uang = Total Biaya - Uang Bapak",
    enoughOption: "Cukup! (Uang pas atau berlebih)",
    notEnoughOption: "Kurang! (Uang tidak cukup)",
    rupiah: "Rp",
    liter: "Liter",
    fullTankAlert: "Tangki sudah penuh! Horeee!",
    bapakDialogue: "Tolong diisi full tank {fuel} ya! Ini uang {cash}.",
    feedbackCorrect: "Bapak tersenyum senang: \"Hitunganmu pintar sekali nak, pas banget!\"",
    feedbackIncorrect: "Bapak menggaruk kepala: \"Waduh nak, coba dihitung lagi deh pelan-pelan.\""
  },
  en: {
    statusInit: "🔴 STARTING FROM ZERO, OK!",
    starLabel: "Stars",
    streakLabel: "Streak",
    needLitersQuestion: "How many liters of fuel are needed to fill up the tank?",
    costQuestion: "What is the total cost if 1 Liter of fuel costs {price}?",
    enoughQuestion: "Bapak gives you {cash}. Is his money enough to fill up full tank?",
    changeQuestion: "Bapak's money is enough! How much change should you return to him?",
    shortageQuestion: "Bapak's money is not enough! How much more money does he need to pay?",
    mathFormulaLabel: "Smart Formula:",
    nextBtnText: "Next Question ➡️",
    pumpBtnText: "Pump Fuel Now! ⚡",
    greatJob: "Great Job! Correct! 🎉",
    wrongAnswer: "Oops, Not Quite! 🥺",
    step1Label: "Need",
    step2Label: "Total Cost",
    step3Label: "Enough?",
    step4Label: "Cash Handled",
    step1Desc: "Fuel Needed = Tank Capacity - Current Fuel",
    step2Desc: "Total Cost = Fuel Needed x Price per Liter",
    step3Desc: "Compare Bapak's Cash ({cash}) with Total Cost ({cost})",
    step4EnoughDesc: "Change Refund = Bapak's Cash - Total Cost",
    step4ShortDesc: "Money Shortage = Total Cost - Bapak's Cash",
    enoughOption: "Enough! (Sufficient cash)",
    notEnoughOption: "Not Enough! (Short of cash)",
    rupiah: "Rp",
    liter: "Liters",
    fullTankAlert: "The tank is fully filled! Hooray!",
    bapakDialogue: "Please fill it up with {fuel}! Here is {cash}.",
    feedbackCorrect: "Bapak smiles happily: \"Your calculation is superb and perfectly correct!\"",
    feedbackIncorrect: "Bapak scratches his head: \"Oh dear, please calculate that again carefully.\""
  }
};

// 2. Sound Effects Engine (Web Audio API Synthesizer)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBeep(freq, type, duration, vol) {
  try {
    initAudio();
    if (!audioCtx) return;
    
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = type || 'sine';
    osc.frequency.value = freq || 440;
    
    gain.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Audio failed to play", e);
  }
}

function playSuccessSound() {
  playBeep(523.25, 'triangle', 0.15, 0.15); // C5
  setTimeout(() => playBeep(659.25, 'triangle', 0.2, 0.15), 100); // E5
  setTimeout(() => playBeep(783.99, 'triangle', 0.35, 0.2), 200); // G5
}

function playErrorSound() {
  playBeep(220, 'sawtooth', 0.3, 0.15); // A3
  setTimeout(() => playBeep(180, 'sawtooth', 0.45, 0.15), 150); // F3
}

function playCoinSound() {
  playBeep(987.77, 'sine', 0.08, 0.25); // B5
  setTimeout(() => playBeep(1318.51, 'sine', 0.25, 0.2), 60); // E6
}

function playPumpSound() {
  // Synthesize a continuous bubbling fuel pump sound
  try {
    initAudio();
    if (!audioCtx) return;
    
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 85;
    
    // Low frequency hum
    let lfo = audioCtx.createOscillator();
    let lfoGain = audioCtx.createGain();
    lfo.frequency.value = 12;
    lfoGain.gain.value = 25;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.2);
    gain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    lfo.start();
    osc.start();
    
    lfo.stop(audioCtx.currentTime + 1.5);
    osc.stop(audioCtx.currentTime + 1.5);
  } catch (e) {}
}

function playEngineSound() {
  // Play vehicle revving sound when driving off
  try {
    initAudio();
    if (!audioCtx) return;
    
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.6);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.4);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.6);
  } catch (e) {}
}

// 3. Custom Interactive Vector-style SVGs
const vehicleSVGs = {
  angkot: (color) => `
    <svg viewBox="0 0 320 180" width="100%" height="100%" class="vehicle-body">
      <!-- Road line -->
      <line x1="10" y1="160" x2="310" y2="160" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Angkot Body -->
      <path d="M40,140 L40,85 C40,80 45,75 55,75 L80,75 L120,40 L260,40 C270,40 280,48 280,58 L280,140 Z" fill="${color}" />
      
      <!-- Yellow roof and stripe (Classic Angkot Style!) -->
      <path d="M122,40 L260,40 C267,40 273,44 276,50 L115,50 Z" fill="#FBBF24" />
      <rect x="40" y="110" width="240" height="12" fill="#FBBF24"/>
      
      <!-- Windows -->
      <path d="M125,48 L170,48 L170,80 L120,80 Z" fill="#93C5FD" opacity="0.8"/>
      <rect x="180" y="48" width="45" height="32" fill="#93C5FD" opacity="0.8"/>
      <path d="M235,48 L270,48 C273,48 274,50 274,53 L274,80 L235,80 Z" fill="#93C5FD" opacity="0.8"/>
      
      <!-- Doors & Handles -->
      <line x1="175" y1="50" x2="175" y2="140" stroke="#1E293B" stroke-width="2"/>
      <line x1="230" y1="50" x2="230" y2="140" stroke="#1E293B" stroke-width="2"/>
      <rect x="162" y="95" width="8" height="15" rx="3" fill="#1E293B"/>
      
      <!-- Headlight and Tail-light -->
      <path d="M40,95 L34,95 C32,95 32,90 34,90 L40,90 Z" fill="#FDE047"/>
      <rect x="278" y="95" width="4" height="12" rx="2" fill="#EF4444"/>
      
      <!-- Wheels (with custom spin animation) -->
      <g class="vehicle-wheel">
        <circle cx="85" cy="140" r="24" fill="#1E293B"/>
        <circle cx="85" cy="140" r="10" fill="#94A3B8"/>
        <line x1="85" y1="120" x2="85" y2="160" stroke="#1E293B" stroke-width="3"/>
        <line x1="65" y1="140" x2="105" y2="140" stroke="#1E293B" stroke-width="3"/>
      </g>
      
      <g class="vehicle-wheel">
        <circle cx="230" cy="140" r="24" fill="#1E293B"/>
        <circle cx="230" cy="140" r="10" fill="#94A3B8"/>
        <line x1="230" y1="120" x2="230" y2="160" stroke="#1E293B" stroke-width="3"/>
        <line x1="210" y1="140" x2="250" y2="140" stroke="#1E293B" stroke-width="3"/>
      </g>
      
      <!-- Angkot Route text "01 STASIUN" -->
      <rect x="180" y="92" width="42" height="15" rx="3" fill="#000" opacity="0.8"/>
      <text x="184" y="103" fill="#10B981" font-size="8" font-weight="700" font-family="monospace">01 KOTA</text>
    </svg>
  `,
  motor: (color) => `
    <svg viewBox="0 0 320 180" width="100%" height="100%" class="vehicle-body">
      <line x1="10" y1="160" x2="310" y2="160" stroke="#475569" stroke-width="4"/>
      
      <!-- Exhaust pipe (Now on the right/back) -->
      <path d="M250,140 L200,135" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
      
      <!-- Scooter Body (Flipped horizontally to face left!) -->
      <path d="M230,140 C240,105 215,95 195,95 L145,95 L120,60 C115,50 105,50 100,65 L92,95 L75,100 C65,103 60,112 65,120 L75,135 Z" fill="${color}"/>
      
      <!-- Retro seat -->
      <path d="M200,95 C200,80 155,80 145,95 Z" fill="#78350F" />
      
      <!-- Handlebar and Headlight (Now on the left/front) -->
      <line x1="105" y1="65" x2="115" y2="40" stroke="#334155" stroke-width="6"/>
      <circle cx="117" cy="38" r="8" fill="#F8FAFC"/>
      <path d="M115,38 L95,43" stroke="#FDE047" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Wheels (Positions perfectly swapped) -->
      <g class="vehicle-wheel">
        <circle cx="225" cy="135" r="22" fill="#1E293B"/>
        <circle cx="225" cy="135" r="8" fill="#F1F5F9"/>
      </g>
      <g class="vehicle-wheel">
        <circle cx="90" cy="135" r="22" fill="#1E293B"/>
        <circle cx="90" cy="135" r="8" fill="#F1F5F9"/>
      </g>
    </svg>
  `,
  avanza: (color) => `
    <svg viewBox="0 0 320 180" width="100%" height="100%" class="vehicle-body">
      <line x1="10" y1="160" x2="310" y2="160" stroke="#475569" stroke-width="4"/>
      
      <!-- Avanza Body -->
      <path d="M35,135 L35,90 L65,75 L125,50 L260,50 C272,50 282,60 282,75 L282,135 Z" fill="${color}"/>
      <rect x="25" y="112" width="262" height="6" fill="#1E293B" opacity="0.3"/>
      
      <!-- Windows -->
      <path d="M128,56 L180,56 L180,82 L120,82 Z" fill="#93C5FD" opacity="0.75"/>
      <path d="M188,56 L240,56 L240,82 L188,82 Z" fill="#93C5FD" opacity="0.75"/>
      <path d="M246,56 L274,56 C277,56 278,58 278,61 L278,82 L246,82 Z" fill="#93C5FD" opacity="0.75"/>
      
      <!-- Door Lines -->
      <line x1="184" y1="56" x2="184" y2="135" stroke="#0F172A" stroke-width="2"/>
      <line x1="243" y1="56" x2="243" y2="135" stroke="#0F172A" stroke-width="2"/>
      <rect x="170" y="92" width="10" height="5" rx="2" fill="#0F172A"/>
      <rect x="230" y="92" width="10" height="5" rx="2" fill="#0F172A"/>
      
      <!-- Lights -->
      <path d="M35,92 L28,92 C26,92 26,88 28,88 L35,88 Z" fill="#FDE047"/>
      <rect x="280" y="90" width="3" height="14" fill="#EF4444"/>
      
      <!-- Wheels -->
      <g class="vehicle-wheel">
        <circle cx="80" cy="135" r="23" fill="#1E293B"/>
        <circle cx="80" cy="135" r="9" fill="#E2E8F0"/>
      </g>
      <g class="vehicle-wheel">
        <circle cx="225" cy="135" r="23" fill="#1E293B"/>
        <circle cx="225" cy="135" r="9" fill="#E2E8F0"/>
      </g>
    </svg>
  `,
  pajero: (color) => `
    <svg viewBox="0 0 320 180" width="100%" height="100%" class="vehicle-body">
      <line x1="10" y1="160" x2="310" y2="160" stroke="#475569" stroke-width="4"/>
      
      <!-- Roof rack / luggage -->
      <rect x="130" y="38" width="100" height="6" fill="#475569" rx="2"/>
      <line x1="150" y1="44" x2="150" y2="48" stroke="#475569" stroke-width="4"/>
      <line x1="210" y1="44" x2="210" y2="48" stroke="#475569" stroke-width="4"/>
      
      <!-- SUV Pajero Body -->
      <path d="M30,135 L30,95 L60,85 L110,48 L275,48 C283,48 290,55 290,63 L290,135 Z" fill="${color}"/>
      <rect x="25" y="120" width="270" height="15" fill="#1E293B" rx="3"/>
      
      <!-- Large Windows -->
      <path d="M115,54 L180,54 L180,82 L110,82 Z" fill="#93C5FD" opacity="0.8"/>
      <rect x="186" y="54" width="55" height="28" fill="#93C5FD" opacity="0.8"/>
      <path d="M247,54 L283,54 C285,54 286,55 286,57 L286,82 L247,82 Z" fill="#93C5FD" opacity="0.8"/>
      
      <!-- Wheels (Extra Large for Pajero) -->
      <g class="vehicle-wheel">
        <circle cx="80" cy="132" r="28" fill="#1E293B"/>
        <circle cx="80" cy="132" r="12" fill="#E2E8F0"/>
        <circle cx="80" cy="132" r="6" fill="#1E293B"/>
      </g>
      <g class="vehicle-wheel">
        <circle cx="230" cy="132" r="28" fill="#1E293B"/>
        <circle cx="230" cy="132" r="12" fill="#E2E8F0"/>
        <circle cx="230" cy="132" r="6" fill="#1E293B"/>
      </g>
      
      <!-- Headlight beam overlay -->
      <path d="M28,95 L20,95 C18,95 18,90 20,90 L28,90 Z" fill="#FFF"/>
    </svg>
  `
};

const characters = [
  { emoji: "👨", nameId: "Bapak Budi", nameEn: "Mr. Budi" },
  { emoji: "👩", nameId: "Ibu Siti", nameEn: "Mrs. Siti" },
  { emoji: "👴", nameId: "Mbah Wira", nameEn: "Grandpa Wira" },
  { emoji: "👦", nameId: "Kak Adi", nameEn: "Brother Adi" },
  { emoji: "👧", nameId: "Dek Rini", nameEn: "Sister Rini" }
];

const fuels = [
  { name: "Pertalite", price: 10000, typeClass: "fuel-label-pertalite" },
  { name: "Pertamax", price: 13000, typeClass: "fuel-label-pertamax" },
  { name: "Pertamax Turbo", price: 15000, typeClass: "fuel-label-turbo" }
];

const vehicleTypes = [
  { type: "motor", nameId: "Scoopy", nameEn: "Scooter", maxTank: 5, color: "#EC4899" }, // Pink
  { type: "motor", nameId: "Vespa", nameEn: "Vespa", maxTank: 6, color: "#10B981" }, // Green
  { type: "angkot", nameId: "Angkot", nameEn: "Angkot", maxTank: 30, color: "#047857" }, // Dark Green Angkot!
  { type: "avanza", nameId: "Avanza", nameEn: "Family MPV", maxTank: 45, color: "#E2E8F0" }, // Silver
  { type: "avanza", nameId: "City Car", nameEn: "City Hatchback", maxTank: 40, color: "#3B82F6" }, // Blue
  { type: "pajero", nameId: "Pajero SUV", nameEn: "SUV Pajero", maxTank: 60, color: "#1E293B" } // Black
];

const cashOptions = [50000, 100000, 150000, 200000, 300000, 400000, 500000];

// 4. Game State
let gameState = {
  score: 0,
  streak: 0,
  lang: "id",
  currentStep: 1, // Steps: 1, 2, 3, 4
  scenario: null
};

// 5. Initialize Game
document.addEventListener("DOMContentLoaded", () => {
  // Load saved state if any
  const savedScore = localStorage.getItem("pom_bensin_score");
  const savedStreak = localStorage.getItem("pom_bensin_streak");
  if (savedScore) gameState.score = parseInt(savedScore);
  if (savedStreak) gameState.streak = parseInt(savedStreak);
  
  // Set default language
  const savedLang = localStorage.getItem("pom_bensin_lang");
  if (savedLang) gameState.lang = savedLang;
  
  updateHUD();
  generateNewScenario();
  
  // Language button event listener
  document.getElementById("lang-btn").addEventListener("click", () => {
    gameState.lang = gameState.lang === "id" ? "en" : "id";
    localStorage.setItem("pom_bensin_lang", gameState.lang);
    updateLanguageUI();
    updateQuestCard();
  });

  // Mobile Menu toggle event listener
  const menuToggle = document.getElementById("menu-toggle-btn");
  const hudStats = document.getElementById("hud-stats");
  if (menuToggle && hudStats) {
    menuToggle.addEventListener("click", (e) => {
      hudStats.classList.toggle("active");
      e.stopPropagation();
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", () => {
      hudStats.classList.remove("active");
    });
  }
});

function updateHUD() {
  document.getElementById("score-value").innerText = gameState.score;
  document.getElementById("streak-value").innerText = gameState.streak;
  updateLanguageUI();
}

function updateLanguageUI() {
  const t = translations[gameState.lang];
  document.getElementById("lang-btn").innerText = gameState.lang === "id" ? "🇲🇨 IND / 🇬🇧 ENG" : "🇬🇧 ENG / 🇲🇨 IND";
  
  // Update general layout tags
  document.querySelector(".status-indicator").innerText = t.statusInit;
  document.querySelector(".star-badge .badge-label").innerText = t.starLabel;
  document.querySelector(".streak-badge .badge-label").innerText = t.streakLabel;
  document.querySelector(".game-footer p").innerHTML = gameState.lang === "id" ? 
    "Petualangan Pom Bensin &copy; 2026. Belajar Matematika Real-World Cepat &amp; Seru!" :
    "Petrol Station Adventure &copy; 2026. Fast &amp; Fun Real-World Math Learning!";
}

// 6. Generate Random Quiz Scenario
function generateNewScenario() {
  // Reset steps
  gameState.currentStep = 1;
  updateStepDots();

  // Random Character
  const character = characters[Math.floor(Math.random() * characters.length)];
  
  // Random Fuel
  const fuel = fuels[Math.floor(Math.random() * fuels.length)];
  
  // Random Vehicle Type
  const vType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
  // Random current fuel level (neat round numbers: e.g. 5, 10, 15, 20 etc. always less than capacity)
  let currentFuel = 0;
  if (vType.maxTank <= 6) {
    currentFuel = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
  } else if (vType.maxTank === 30) {
    currentFuel = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
  } else if (vType.maxTank === 40) {
    currentFuel = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
  } else if (vType.maxTank === 45) {
    currentFuel = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
  } else { // 60L
    currentFuel = [10, 20, 30, 40][Math.floor(Math.random() * 4)];
  }

  const needLiters = vType.maxTank - currentFuel;
  const totalCost = needLiters * fuel.price;

  // Decide a random cash payment from Bapak (sometimes enough, sometimes not!)
  let bapakUang = 0;
  // Make sure we select cash option that is realistic relative to the fuel cost
  const validCashOptions = cashOptions.filter(cash => cash >= (totalCost - 100000) && cash <= (totalCost + 150000));
  if (validCashOptions.length > 0) {
    bapakUang = validCashOptions[Math.floor(Math.random() * validCashOptions.length)];
  } else {
    bapakUang = cashOptions[Math.floor(Math.random() * cashOptions.length)];
  }

  const isEnough = bapakUang >= totalCost;
  const change = isEnough ? (bapakUang - totalCost) : 0;
  const shortage = isEnough ? 0 : (totalCost - bapakUang);

  gameState.scenario = {
    character,
    fuel,
    vehicle: vType,
    currentFuel,
    needLiters,
    totalCost,
    bapakUang,
    isEnough,
    change,
    shortage
  };

  // Dynamic Dispenser Color-Matching SPBU
  const quizPanel = document.getElementById("quiz-panel");
  let fuelColor = "#3b82f6"; // Default Blue
  if (quizPanel) {
    if (fuel.name === "Pertalite") {
      fuelColor = "#10b981"; // Green
      quizPanel.style.setProperty("--dispenser-brand", "#10b981");
      quizPanel.style.setProperty("--dispenser-lcd", "#34d399");
      quizPanel.style.setProperty("--dispenser-bg", "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)");
      quizPanel.style.setProperty("--dispenser-border", "#a7f3d0");
      quizPanel.style.setProperty("--dispenser-text", "#047857");
    } else if (fuel.name === "Pertamax") {
      fuelColor = "#3b82f6"; // Blue
      quizPanel.style.setProperty("--dispenser-brand", "#3b82f6");
      quizPanel.style.setProperty("--dispenser-lcd", "#60a5fa");
      quizPanel.style.setProperty("--dispenser-bg", "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)");
      quizPanel.style.setProperty("--dispenser-border", "#bfdbfe");
      quizPanel.style.setProperty("--dispenser-text", "#1d4ed8");
    } else if (fuel.name === "Pertamax Turbo") {
      fuelColor = "#ec4899"; // Pink
      quizPanel.style.setProperty("--dispenser-brand", "#ec4899");
      quizPanel.style.setProperty("--dispenser-lcd", "#f472b6");
      quizPanel.style.setProperty("--dispenser-bg", "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)");
      quizPanel.style.setProperty("--dispenser-border", "#fbcfe8");
      quizPanel.style.setProperty("--dispenser-text", "#be185d");
    }
  }

  // Set visual dynamic colors on HUD cards
  const priceCard = document.querySelector(".fuel-price-card");
  if (priceCard) {
    priceCard.style.setProperty("--vehicle-color", vType.color); // Matches car paint!
  }

  const statusCard = document.querySelector(".tank-status-card");
  if (statusCard) {
    statusCard.style.setProperty("--fuel-color", fuelColor); // Matches fuel type!
  }

  // Render SVG Vehicle
  const svgContainer = document.getElementById("vehicle-svg-container");
  if (vehicleSVGs[vType.type]) {
    svgContainer.innerHTML = vehicleSVGs[vType.type](vType.color);
  }

  // Animate Vehicle slide-in from the RIGHT! (Forward entering movement)
  setTimeout(() => {
    const vehicleBody = document.querySelector(".vehicle-body");
    const wheels = document.querySelectorAll(".vehicle-wheel");
    if (vehicleBody) {
      // Start spinning wheels on entry drive
      wheels.forEach(wheel => wheel.classList.add("spinning"));
      
      vehicleBody.style.transition = "none";
      vehicleBody.style.transform = "translateX(350px)"; // Start off-screen right
      vehicleBody.offsetHeight; // Force reflow
      vehicleBody.style.transition = "transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)";
      vehicleBody.style.transform = "translateX(0)"; // Slide to center at pump
      
      // Stop spinning once vehicle is stationary at the pump (1.2s transition)
      setTimeout(() => {
        wheels.forEach(wheel => wheel.classList.remove("spinning"));
      }, 1200);
    }
  }, 20);

  // Render Character Avatar
  document.getElementById("character-emoji").innerText = character.emoji;

  // Display Customer Dialogue
  updateCustomerDialogue();

  // Render Fuel price display
  document.getElementById("fuel-type-display").innerText = fuel.name;
  document.getElementById("fuel-type-display").className = `info-val ${fuel.typeClass}`;
  
  const t = translations[gameState.lang];
  document.getElementById("fuel-price-display").innerText = `${t.rupiah} ${formatRupiah(fuel.price)} / ${t.liter}`;

  // Update visual tank gauge percentage
  const percentFilled = (currentFuel / vType.maxTank) * 100;
  document.getElementById("tank-fill-bar").style.width = `${percentFilled}%`;
  document.getElementById("tank-current-display").innerText = `${currentFuel} ${t.liter}`;
  document.getElementById("tank-max-display").innerText = `${t.step4Label.toLowerCase() === "result" ? "Max" : "Kapasitas"}: ${vType.maxTank}L`;

  // Render first question
  updateQuestCard();
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

function updateCustomerDialogue() {
  const s = gameState.scenario;
  const t = translations[gameState.lang];
  const charName = gameState.lang === 'id' ? s.character.nameId : s.character.nameEn;
  const vName = gameState.lang === 'id' ? s.vehicle.nameId : s.vehicle.nameEn;
  
  document.getElementById("vehicle-name").innerText = `${vName} (${charName})`;
  
  let dText = t.bapakDialogue
    .replace("{fuel}", s.fuel.name)
    .replace("{cash}", `${t.rupiah} ${formatRupiah(s.bapakUang)}`);
    
  document.getElementById("dialogue-text").innerText = `"${dText}"`;
}

function updateStepDots() {
  const steps = ["step-1", "step-2", "step-3", "step-4"];
  steps.forEach((stepId, idx) => {
    const dot = document.getElementById(stepId);
    dot.className = "step-dot";
    
    // Label translations
    const stepLabelEl = dot.querySelector("label");
    const t = translations[gameState.lang];
    if (idx === 0) stepLabelEl.innerText = t.step1Label;
    if (idx === 1) stepLabelEl.innerText = t.step2Label;
    if (idx === 2) stepLabelEl.innerText = t.step3Label;
    if (idx === 3) stepLabelEl.innerText = t.step4Label;

    if (idx + 1 === gameState.currentStep) {
      dot.classList.add("active");
    } else if (idx + 1 < gameState.currentStep) {
      dot.classList.add("done");
    }
  });
}

// 7. Update Question Card and Multiple Choices based on current step
function updateQuestCard() {
  updateStepDots();
  const s = gameState.scenario;
  const t = translations[gameState.lang];
  const qText = document.getElementById("question-text");
  
  let questionString = "";
  let choices = [];

  if (gameState.currentStep === 1) {
    // Step 1: Calculate Liters Needed
    questionString = t.needLitersQuestion;
    const correct = s.needLiters;
    // Distractors
    choices = generateUniqueChoices(correct, [
      s.vehicle.maxTank,
      s.currentFuel,
      Math.abs(s.needLiters - 2),
      s.needLiters + 5
    ], ` ${t.liter.toLowerCase()}`);

  } else if (gameState.currentStep === 2) {
    // Step 2: Calculate Cost
    questionString = t.costQuestion.replace("{price}", `${t.rupiah} ${formatRupiah(s.fuel.price)}`);
    const correct = s.totalCost;
    // Distractors
    choices = generateUniqueChoices(correct, [
      s.needLiters * (s.fuel.price - 1000),
      s.vehicle.maxTank * s.fuel.price,
      s.needLiters * s.fuel.price + 20000,
      s.needLiters * s.fuel.price - 30000
    ], `${t.rupiah} `, true);

  } else if (gameState.currentStep === 3) {
    // Step 3: Enough or Short?
    questionString = t.enoughQuestion.replace("{cash}", `${t.rupiah} ${formatRupiah(s.bapakUang)}`);
    choices = [
      { text: t.enoughOption, value: true },
      { text: t.notEnoughOption, value: false }
    ];

  } else if (gameState.currentStep === 4) {
    // Step 4: Cash Change or Shortage calculation
    if (s.isEnough) {
      questionString = t.changeQuestion;
      const correct = s.change;
      // Distractors
      choices = generateUniqueChoices(correct, [
        s.bapakUang - s.totalCost + 10000,
        s.bapakUang - s.totalCost - 10000,
        s.change + 25000,
        0
      ], `${t.rupiah} `, true);
    } else {
      questionString = t.shortageQuestion;
      const correct = s.shortage;
      // Distractors
      choices = generateUniqueChoices(correct, [
        s.totalCost - s.bapakUang + 10000,
        s.totalCost - s.bapakUang - 5000,
        s.shortage + 20000,
        s.totalCost
      ], `${t.rupiah} `, true);
    }
  }

  qText.innerText = questionString;
  renderChoices(choices);
}

function generateUniqueChoices(correct, list, prefixOrSuffix, isCurrency = false) {
  let uniqueValues = new Set([correct]);
  
  list.forEach(val => {
    if (val > 0) {
      uniqueValues.add(val);
    }
  });

  // If we don't have 4 choices, fill with logical offsets
  while (uniqueValues.size < 4) {
    const offset = isCurrency ? 10000 : 2;
    const sign = Math.random() > 0.5 ? 1 : -1;
    const val = Array.from(uniqueValues)[uniqueValues.size - 1] + (sign * offset);
    if (val > 0) uniqueValues.add(val);
  }

  // Shuffle & Format
  let arr = Array.from(uniqueValues);
  shuffleArray(arr);

  return arr.map(val => {
    let text = "";
    if (isCurrency) {
      text = `${prefixOrSuffix}${formatRupiah(val)}`;
    } else {
      text = prefixOrSuffix.startsWith("Rp") ? `${prefixOrSuffix}${val}` : `${val}${prefixOrSuffix}`;
    }
    return { text, value: val };
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderChoices(choices) {
  const buttons = ["btn-a", "btn-b", "btn-c", "btn-d"];
  const texts = ["text-a", "text-b", "text-c", "text-d"];

  // Clear previous states
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    btn.style.display = "none";
    btn.className = "choice-btn";
  });

  choices.forEach((choice, idx) => {
    const btn = document.getElementById(buttons[idx]);
    const txt = document.getElementById(texts[idx]);
    btn.style.display = "flex";
    txt.innerText = choice.text;
    
    // Attach selection data
    btn.onclick = () => handleAnswer(choice.value);
  });
}

// 8. Handle Answer Selection
function handleAnswer(selectedValue) {
  const s = gameState.scenario;
  const t = translations[gameState.lang];
  let isCorrect = false;
  let explanation = "";
  let title = "";

  if (gameState.currentStep === 1) {
    isCorrect = (Number(selectedValue) === Number(s.needLiters));
    title = isCorrect ? t.greatJob : t.wrongAnswer;
    explanation = `${t.step1Desc}<br><br><b>${s.vehicle.maxTank}L</b> (Kapasitas) - <b>${s.currentFuel}L</b> (Isi Sekarang) = <b>${s.needLiters}L</b> bensin.`;

  } else if (gameState.currentStep === 2) {
    isCorrect = (Number(selectedValue) === Number(s.totalCost));
    title = isCorrect ? t.greatJob : t.wrongAnswer;
    explanation = `${t.step2Desc}<br><br><b>${s.needLiters}L</b> x <b>${t.rupiah} ${formatRupiah(s.fuel.price)}</b> = <b>${t.rupiah} ${formatRupiah(s.totalCost)}</b>.`;

  } else if (gameState.currentStep === 3) {
    isCorrect = (String(selectedValue) === String(s.isEnough));
    title = isCorrect ? t.greatJob : t.wrongAnswer;
    explanation = t.step3Desc
      .replace("{cash}", `${t.rupiah} ${formatRupiah(s.bapakUang)}`)
      .replace("{cost}", `${t.rupiah} ${formatRupiah(s.totalCost)}`);
    explanation += `<br><br>Sebab total biaya adalah <b>${t.rupiah} ${formatRupiah(s.totalCost)}</b> dan uang Bapak adalah <b>${t.rupiah} ${formatRupiah(s.bapakUang)}</b>.`;

  } else if (gameState.currentStep === 4) {
    if (s.isEnough) {
      isCorrect = (Number(selectedValue) === Number(s.change));
      title = isCorrect ? t.greatJob : t.wrongAnswer;
      explanation = `${t.step4EnoughDesc}<br><br><b>${t.rupiah} ${formatRupiah(s.bapakUang)}</b> (Uang Bapak) - <b>${t.rupiah} ${formatRupiah(s.totalCost)}</b> (Total Biaya) = <b>${t.rupiah} ${formatRupiah(s.change)}</b>.`;
    } else {
      isCorrect = (Number(selectedValue) === Number(s.shortage));
      title = isCorrect ? t.greatJob : t.wrongAnswer;
      explanation = `${t.step4ShortDesc}<br><br><b>${t.rupiah} ${formatRupiah(s.totalCost)}</b> (Total Biaya) - <b>${t.rupiah} ${formatRupiah(s.bapakUang)}</b> (Uang Bapak) = <b>${t.rupiah} ${formatRupiah(s.shortage)}</b>.`;
    }
  }

  // Update State & UI
  if (isCorrect) {
    playSuccessSound();
    document.getElementById("feedback-icon").innerText = "🎉";
    document.getElementById("feedback-title").innerText = title;
    document.getElementById("feedback-title").className = "success-header";
    document.getElementById("feedback-message").innerHTML = `<b>${t.feedbackCorrect}</b><br><br>${explanation}`;
  } else {
    playErrorSound();
    gameState.streak = 0; // Reset streak
    document.getElementById("feedback-icon").innerText = "🥺";
    document.getElementById("feedback-title").innerText = title;
    document.getElementById("feedback-title").className = "error-header";
    document.getElementById("feedback-message").innerHTML = `<b>${t.feedbackIncorrect}</b><br><br>${explanation}`;
  }

  // Show Feedback Overlay Modal
  const overlay = document.getElementById("feedback-overlay");
  overlay.classList.remove("hidden");

  // Formula Label and Description
  document.querySelector(".math-breakdown-box h4").innerText = t.mathFormulaLabel;
  
  let formulaText = "";
  if (gameState.currentStep === 1) {
    formulaText = t.step1Desc;
  } else if (gameState.currentStep === 2) {
    formulaText = t.step2Desc;
  } else if (gameState.currentStep === 3) {
    formulaText = t.step3Desc
      .replace("{cash}", `${t.rupiah} ${formatRupiah(s.bapakUang)}`)
      .replace("{cost}", `${t.rupiah} ${formatRupiah(s.totalCost)}`);
  } else if (gameState.currentStep === 4) {
    formulaText = s.isEnough ? t.step4EnoughDesc : t.step4ShortDesc;
  }
  document.getElementById("math-formula").innerHTML = formulaText;

  // Next Button event
  const nextBtn = document.getElementById("next-btn");
  if (isCorrect) {
    nextBtn.innerText = gameState.currentStep === 4 ? t.pumpBtnText : t.nextBtnText;
    nextBtn.onclick = () => {
      overlay.classList.add("hidden");
      if (gameState.currentStep === 4) {
        // Trigger Pump filling nozzle animation and then generate new customer
        triggerPumpAnimation();
      } else {
        gameState.currentStep++;
        updateQuestCard();
      }
    };
  } else {
    // If incorrect, give retry option
    nextBtn.innerText = gameState.lang === 'id' ? "Coba Lagi! 🔁" : "Try Again! 🔁";
    nextBtn.onclick = () => {
      overlay.classList.add("hidden");
    };
  }
}

// 9. Trigger Fuel Nozzle & Filling Progress Animation
function triggerPumpAnimation() {
  const animOverlay = document.getElementById("pump-animation-overlay");
  const indicator = document.getElementById("pump-indicator");
  const subStatus = document.getElementById("pump-status-sub");
  
  const t = translations[gameState.lang];
  animOverlay.classList.remove("hidden");
  indicator.style.width = "0%";
  
  subStatus.innerText = gameState.lang === "id" ? 
    `Ssssst! Mengisi tangki bensin ${gameState.scenario.vehicle.nameId} sampai penuh!` :
    `Shhhhh! Filling up ${gameState.scenario.vehicle.nameEn}'s fuel tank completely!`;
  
  // Play pump synth hum
  playPumpSound();
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    indicator.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Update visual vehicle fill tank to 100% on the main frame
      document.getElementById("tank-fill-bar").style.width = "100%";
      document.getElementById("tank-current-display").innerText = `${gameState.scenario.vehicle.maxTank}L`;
      
      // Dynamic dialog change
      document.getElementById("dialogue-text").innerText = `"${t.fullTankAlert}"`;
      
      setTimeout(() => {
        // Engine start sound
        playEngineSound();
        
        // Add driving-off animation class
        const vehicleBody = document.querySelector(".vehicle-body");
        const wheels = document.querySelectorAll(".vehicle-wheel");
        if (vehicleBody) {
          // Spin wheels during takeoff drive
          wheels.forEach(wheel => wheel.classList.add("spinning"));
          
          vehicleBody.style.transition = "transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)";
          vehicleBody.style.transform = "translateX(-450px)"; // Drive off to the LEFT!
        }
        
        // Update stats
        gameState.score += 10;
        gameState.streak += 1;
        localStorage.setItem("pom_bensin_score", gameState.score);
        localStorage.setItem("pom_bensin_streak", gameState.streak);
        updateHUD();
        
        setTimeout(() => {
          animOverlay.classList.add("hidden");
          // Generate new customer!
          generateNewScenario();
        }, 800);
      }, 1000);
    }
  }, 150);
}
