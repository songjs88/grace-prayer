/**
 * GraceAI (은혜의 기도) - Client Application
 * 100% Client-Side execution for GitHub Pages & Local
 * Features: Google Gemini streaming with auto-failover, 3 Bible Verse Cards with meditation,
 * 1-minute Heartfelt Prayer letter, Web Speech TTS with KakaoTalk guide, Prayer Box, and Card export.
 */

// Built-in obfuscated shared key for seamless link sharing
function getSharedKey() {
  const _s = "Z0xYVWJrYTZLd2VxSDk4UkxkT0dhd2xCVXRyQzBRM0hhdlA2OU5iM2FtZEs2TlI4YkEuUUE=";
  if (!_s) return "";
  try {
    return atob(_s).split("").reverse().join("");
  } catch(e) {
    return "";
  }
}

// Curated Sample Prayers for Instant Demo Mode
const SAMPLE_PRAYERS = {
  "평안과 위로": {
    verses: [
      {
        reference: "빌립보서 4:6-7",
        text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라",
        meditation: "모든 염려를 기도로 바꿀 때 세상이 줄 수 없는 하나님의 참된 평강이 우리 마음과 생각을 든든히 지켜주십니다."
      },
      {
        reference: "시편 23:1-3",
        text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다",
        meditation: "선한 목자 되신 하나님께서 내 삶의 모든 길을 인도하시며, 지친 영혼을 소생시키시고 의의 길로 이끄십니다."
      },
      {
        reference: "요한복음 14:27",
        text: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라",
        meditation: "주님이 주시는 평안은 세상의 풍파 속에서도 흔들리지 않는 영원한 안식입니다."
      }
    ],
    prayer: "사랑과 자비가 풍성하신 하나님 아버지,\n오늘도 분주하고 염려 가득한 세상 속에서 지친 마음을 이끌고 주님 보좌 앞으로 나아옵니다. 앞이 보이지 않는 미래와 삶의 무게로 인해 때로는 두려움과 불안이 엄습할 때가 있습니다. 그러나 이 연약한 심령의 소리를 들으시는 주님, 저의 모든 염려와 걱정을 십자가 앞에 내려놓사오니, 세상이 줄 수 없는 주님의 참된 평강으로 채워 주옵소서.\n\n나의 목자가 되셔서 푸른 풀밭과 쉴 만한 물가로 인도하시는 주님을 신뢰합니다. 어떠한 풍랑 속에서도 주님의 의로운 오른손이 저를 굳게 붙들고 계심을 믿사오니, 마음의 모든 두려움이 물러가고 고요한 안식과 담대함이 가득 차오르게 하옵소서.\n\n저를 향한 하나님의 생각은 재앙이 아니요 평안이며 미래와 희망을 주시는 것임을 기억하며, 모든 상황 속에서 감사와 찬양으로 주님께 영광 돌리는 삶이 되게 하옵소서.\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
  },
  "건강과 치유": {
    verses: [
      {
        reference: "예레미야 17:14",
        text: "여호와여 주는 나의 찬송이시오니 나를 고치소서 그리하시면 내가 낫겠나이다 나를 구원하소서 그리하시면 내가 구원을 얻으리이다",
        meditation: "우리의 유일한 치유자 되신 하나님께 간구할 때 온전한 치유와 구원이 임합니다."
      },
      {
        reference: "시편 103:2-3",
        text: "내 영혼아 여호와를 송축하며 그의 모든 은택을 잊지 말지어다 그가 네 모든 죄악을 사하시며 네 모든 병을 고치시며",
        meditation: "우리의 모든 질병을 돌아보시고 고치시는 하나님의 긍휼과 사랑을 찬양합니다."
      },
      {
        reference: "출애굽기 15:26",
        text: "나는 너희를 치료하는 여호와임이라",
        meditation: "라파의 하나님께서 지금도 성도님의 육신과 영혼을 강건하게 어루만져 주십니다."
      }
    ],
    prayer: "치료의 하나님 여호와 라파 주님,\n육신의 연약함과 질병으로 인하여 고통 중에 신음하는 주의 자녀를 긍휼히 여겨 주옵소서. 우리의 모든 질고를 친히 담당하시고 채찍에 맞으심으로 우리에게 나음을 주신 예수 그리스도의 보혈의 능력을 의지하여 기도합니다.\n\n머리부터 발끝까지 모든 세포와 조직, 신경을 주의 거룩한 생기로 소생시켜 주옵소서. 약해진 뼈와 근육에 새 힘을 부어 주시고, 마음에 깃든 불안과 염려를 물리쳐 주사 주님의 치유하시는 손길을 온전히 경험하게 하옵소서.\n\n고난의 시간을 통하여 주님을 더욱 깊이 만나는 은혜의 통로가 되게 하시고, 건강한 몸과 맑은 영혼으로 다시 일어서 주님의 선하신 이름을 증거하게 하옵소서.\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
  },
  "진로와 비전": {
    verses: [
      {
        reference: "잠언 3:5-6",
        text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라",
        meditation: "내 생각을 내려놓고 모든 일에 주님을 인정할 때 친히 가장 복된 길로 인도하십니다."
      },
      {
        reference: "예레미야 29:11",
        text: "여호와의 말씀이니라 너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라",
        meditation: "주님의 계획은 언제나 우리에게 참된 평안과 밝은 미래와 희망을 준비하고 계십니다."
      },
      {
        reference: "시편 37:5",
        text: "네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고",
        meditation: "믿음으로 나의 앞길을 주님께 맡길 때 주님께서 가장 선하고 아름답게 이루어 가십니다."
      }
    ],
    prayer: "내 삶의 인도자 되시는 하나님 아버지,\n앞길을 알 수 없는 선택의 갈림길 앞에서 두렵고 떨리는 마음으로 주님 앞에 엎드립니다. 나의 짧은 명철과 지혜를 의지하지 않고, 오직 모든 걸음을 친히 주장하시는 전능하신 주님만을 신뢰합니다.\n\n닫힌 문 앞에서 낙심하지 않게 하시고, 주님께서 친히 열어두신 축복과 사명의 문을 바라보는 영적인 눈을 열어 주옵소서. 준비하는 시험과 면접, 직장과 사업의 모든 자리마다 하늘의 지혜와 총명을 더하여 주옵소서.\n\n나의 뜻이 아니라 오직 하나님의 선하시고 온전하신 뜻이 내 삶을 통해 성취되기를 원하오며, 주님의 영광을 드러내는 빛과 소금의 통로가 되게 하옵소서.\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
  },
  "가족과 자녀": {
    verses: [
      {
        reference: "잠언 22:6",
        text: "마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라",
        meditation: "믿음의 바른 도리를 심어줄 때 평생토록 흔들리지 않는 믿음의 반석 위에 서게 됩니다."
      },
      {
        reference: "시편 127:3",
        text: "보라 자식들은 여호와의 기업이요 태의 열매는 그의 상급이로다",
        meditation: "자녀는 하나님께서 맡겨주신 존귀한 기업이며 삶의 가장 귀한 축복이자 상급입니다."
      },
      {
        reference: "여호수아 24:15",
        text: "오직 나와 내 집은 여호와를 섬기겠노라",
        meditation: "가정의 중심에 주님을 모시고 한마음으로 하나님만을 섬기는 복된 믿음의 결단을 고백합니다."
      }
    ],
    prayer: "가정의 주인 되시며 복의 근원 되시는 하나님 아버지,\n사랑하는 우리 가정과 자녀들을 주님의 따뜻한 은혜의 품에 올려드립니다. 세상의 거센 유혹과 풍파 속에서도 우리 가족과 자녀들이 하나님의 말씀 안에 거하게 하시고, 참된 믿음과 지혜로 자라나게 하옵소서.\n\n가정 안에 서로를 존중하고 용서하는 사랑의 온기가 넘쳐나게 하시고, 기쁨과 감사가 끊이지 않는 작은 천국을 이루게 하옵소서. 자녀들의 모든 만남과 발걸음을 천군 천사로 지켜 주시고, 시대 속에서 하나님의 꿈을 품고 세상을 밝히는 복된 일꾼으로 세워 주옵소서.\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
  },
  "감사와 찬양": {
    verses: [
      {
        reference: "데살로니가전서 5:16-18",
        text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라",
        meditation: "모든 상황 속에서 감사를 고백할 때 하나님께서 더 큰 기쁨과 평강의 문을 열어주십니다."
      },
      {
        reference: "시편 100:4-5",
        text: "감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가서 그에게 감사하며 그의 이름을 송축할지어다 여호와는 선하시니 그의 인자하심이 영원하고 그의 성실하심이 대대에 이르리로다",
        meditation: "선하시고 인자하심이 영원하신 주님의 성실하심을 온 맘 다해 기쁨으로 찬양합니다."
      },
      {
        reference: "시편 103:1-2",
        text: "내 영혼아 여호와를 송축하라 내 속에 있는 것들아 다 그의 거룩한 이름을 송축하라 내 영혼아 여호와를 송축하며 그의 모든 은택을 잊지 말지어다",
        meditation: "주께서 베풀어 주신 한량없는 모든 은택을 기억하며 영혼 깊은 곳으로부터 송축합니다."
      }
    ],
    prayer: "지극히 높으신 하나님 아버지,\n오늘도 생명을 호흡하게 하시고, 주님의 은혜의 날개 아래 평안히 거하게 하심을 진심으로 감사와 찬양을 드립니다. 당연하게 여겼던 일상의 모든 순간이 하나님의 세밀하신 돌보심과 사랑이었음을 고백합니다.\n\n눈앞의 작은 결핍 때문에 불평하기보다, 이미 부어주신 십자가의 구원과 풍성한 은혜를 기억하게 하옵소서. 기쁠 때나 슬플 때나 입술에서 감사의 찬양이 마르지 않게 하시고, 저의 온 삶이 하나님을 영화롭게 하는 향기로운 예배가 되게 하옵소서.\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
  }
};

// Application State
const state = {
  provider: localStorage.getItem('grace_provider') || 'gemini',
  geminiKey: localStorage.getItem('grace_gemini_key') || getSharedKey(),
  geminiModel: localStorage.getItem('grace_gemini_model') || 'gemini-3.5-flash-lite',
  activeModel: 'gemma-4-12b-it',
  hostUrl: localStorage.getItem('grace_lm_host') || 'http://127.0.0.1:1234',
  currentPrayerData: null,
  isGenerating: false,
  isSpeaking: false,
  speechQueue: [],
  speechQueueIndex: 0,
  ttsVoice: localStorage.getItem('grace_tts_voice') || 'ko-KR-SunHiNeural',
  theme: localStorage.getItem('grace_theme') || 'midnight',
  savedPrayers: JSON.parse(localStorage.getItem('grace_saved_prayers') || '[]')
};

// DOM Elements
const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  initTheme();
  setupEventListeners();
  updateSavedBadge();
  updateCharCount();
  updateEngineUI();
});

function initDOMElements() {
  // Header
  elements.brandLogo = document.getElementById('brandLogo');
  elements.btnThemeToggle = document.getElementById('btnThemeToggle');
  elements.btnOpenHistory = document.getElementById('btnOpenHistory');
  elements.savedCountBadge = document.getElementById('savedCountBadge');
  elements.btnOpenSettings = document.getElementById('btnOpenSettings');

  // Form & Inputs
  elements.chipsList = document.getElementById('chipsList');
  elements.prayerForm = document.getElementById('prayerForm');
  elements.prayerTopicInput = document.getElementById('prayerTopicInput');
  elements.charCount = document.getElementById('charCount');
  elements.btnClearTopic = document.getElementById('btnClearTopic');
  elements.btnToggleOptions = document.getElementById('btnToggleOptions');
  elements.collapsibleOptions = document.getElementById('collapsibleOptions');
  elements.prayerTone = document.getElementById('prayerTone');
  elements.prayerRecipient = document.getElementById('prayerRecipient');
  elements.btnSubmitPrayer = document.getElementById('btnSubmitPrayer');

  // Streaming & Loading
  elements.streamingSection = document.getElementById('streamingSection');
  elements.generatingStatusTitle = document.getElementById('generatingStatusTitle');
  elements.generatingStatusSubtitle = document.getElementById('generatingStatusSubtitle');
  elements.elapsedTimerBadge = document.getElementById('elapsedTimerBadge');
  elements.liveStreamPreview = document.getElementById('liveStreamPreview');

  // Results
  elements.resultContainer = document.getElementById('resultContainer');
  elements.resultCategoryLabel = document.getElementById('resultCategoryLabel');
  elements.prayerRecipientTag = document.getElementById('prayerRecipientTag');
  elements.versesGrid = document.getElementById('versesGrid');
  elements.prayerBody = document.getElementById('prayerBody');
  elements.prayerClosingDeclaration = document.getElementById('prayerClosingDeclaration');
  elements.btnTTSPrayer = document.getElementById('btnTTSPrayer');
  elements.ttsBtnText = document.getElementById('ttsBtnText');
  elements.ttsIconWrapper = document.getElementById('ttsIconWrapper');
  elements.selectVoice = document.getElementById('selectVoice');
  elements.ttsControlPill = document.getElementById('ttsControlPill');
  elements.btnSavePrayer = document.getElementById('btnSavePrayer');
  elements.btnCopyAll = document.getElementById('btnCopyAll');
  elements.btnOpenCardModal = document.getElementById('btnOpenCardModal');

  // Modals: History
  elements.historyModal = document.getElementById('historyModal');
  elements.btnCloseHistory = document.getElementById('btnCloseHistory');
  elements.historyList = document.getElementById('historyList');
  elements.historyTotalCount = document.getElementById('historyTotalCount');
  elements.btnClearAllHistory = document.getElementById('btnClearAllHistory');

  // Modals: Settings
  elements.settingsModal = document.getElementById('settingsModal');
  elements.btnCloseSettings = document.getElementById('btnCloseSettings');
  elements.tabGemini = document.getElementById('tabGemini');
  elements.tabLMStudio = document.getElementById('tabLMStudio');
  elements.paneGemini = document.getElementById('paneGemini');
  elements.paneLMStudio = document.getElementById('paneLMStudio');
  elements.settingGeminiKey = document.getElementById('settingGeminiKey');
  elements.settingGeminiModel = document.getElementById('settingGeminiModel');
  elements.settingHost = document.getElementById('settingHost');
  elements.settingModel = document.getElementById('settingModel');
  elements.settingDefaultVoice = document.getElementById('settingDefaultVoice');
  elements.btnTestConnection = document.getElementById('btnTestConnection');
  elements.serverStateVal = document.getElementById('serverStateVal');
  elements.activeModelVal = document.getElementById('activeModelVal');
  elements.btnSaveSettings = document.getElementById('btnSaveSettings');

  // Modals: Card
  elements.cardModal = document.getElementById('cardModal');
  elements.btnCloseCardModal = document.getElementById('btnCloseCardModal');
  elements.cardVerseRef = document.getElementById('cardVerseRef');
  elements.cardVerseQuote = document.getElementById('cardVerseQuote');
  elements.cardTopicTitle = document.getElementById('cardTopicTitle');
  elements.cardPrayerSnippet = document.getElementById('cardPrayerSnippet');
  elements.cardDate = document.getElementById('cardDate');
  elements.btnCopyCardText = document.getElementById('btnCopyCardText');
  elements.btnPrintCard = document.getElementById('btnPrintCard');

  // Toast
  elements.toastContainer = document.getElementById('toastContainer');
}

function initTheme() {
  if (state.theme === 'parchment') {
    document.body.classList.add('theme-parchment');
  } else {
    document.body.classList.remove('theme-parchment');
  }
}

function updateEngineUI() {
  // Update inputs in settings modal (masking shared key)
  if (elements.settingGeminiKey) {
    const userSaved = localStorage.getItem('grace_gemini_key');
    if (userSaved) {
      elements.settingGeminiKey.value = userSaved;
    } else if (getSharedKey()) {
      elements.settingGeminiKey.value = '';
      elements.settingGeminiKey.placeholder = '●●●●●●●● (기본 공용 키 적용됨)';
    } else {
      elements.settingGeminiKey.value = '';
      elements.settingGeminiKey.placeholder = 'AIzaSy... (구글 AI Studio에서 무료 발급)';
    }
  }

  if (elements.settingGeminiModel) {
    elements.settingGeminiModel.value = state.geminiModel || 'gemini-3.5-flash-lite';
  }
  if (elements.settingHost) {
    elements.settingHost.value = state.hostUrl;
  }
  if (elements.settingDefaultVoice) {
    elements.settingDefaultVoice.value = state.ttsVoice;
  }
  if (elements.selectVoice) {
    elements.selectVoice.value = state.ttsVoice;
  }

  switchEngineTab(state.provider, false);
}

function switchEngineTab(providerName, saveToStorage = true) {
  state.provider = providerName;
  if (saveToStorage) {
    localStorage.setItem('grace_provider', providerName);
  }

  if (elements.tabGemini) elements.tabGemini.classList.toggle('active', providerName === 'gemini');
  if (elements.tabLMStudio) elements.tabLMStudio.classList.toggle('active', providerName === 'lmstudio');
  if (elements.paneGemini) elements.paneGemini.classList.toggle('hidden', providerName !== 'gemini');
  if (elements.paneLMStudio) elements.paneLMStudio.classList.toggle('hidden', providerName !== 'lmstudio');
}

function setupEventListeners() {
  // Theme Toggle
  if (elements.btnThemeToggle) {
    elements.btnThemeToggle.addEventListener('click', () => {
      state.theme = state.theme === 'midnight' ? 'parchment' : 'midnight';
      localStorage.setItem('grace_theme', state.theme);
      initTheme();
      showToast(`테마가 변경되었습니다 (${state.theme === 'midnight' ? '새벽 미명' : '따뜻한 양피지'}`);
    });
  }

  // Topic Chips Selection
  if (elements.chipsList) {
    elements.chipsList.addEventListener('click', (e) => {
      const chip = e.target.closest('.topic-chip');
      if (!chip) return;

      document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const topic = chip.dataset.topic;
      if (topic && elements.prayerTopicInput) {
        elements.prayerTopicInput.value = topic;
        updateCharCount();
        elements.prayerTopicInput.focus();
      }
    });
  }

  // Character Count & Input Clear
  if (elements.prayerTopicInput) {
    elements.prayerTopicInput.addEventListener('input', updateCharCount);
  }
  if (elements.btnClearTopic && elements.prayerTopicInput) {
    elements.btnClearTopic.addEventListener('click', () => {
      elements.prayerTopicInput.value = '';
      document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
      elements.prayerTopicInput.focus();
      updateCharCount();
    });
  }

  // Collapsible Options Drawer
  if (elements.btnToggleOptions && elements.collapsibleOptions) {
    elements.btnToggleOptions.addEventListener('click', () => {
      const isCollapsed = elements.collapsibleOptions.classList.toggle('collapsed');
      elements.btnToggleOptions.setAttribute('aria-expanded', !isCollapsed);
      const arrow = document.getElementById('toggleOptionsArrow') || elements.btnToggleOptions.querySelector('.toggle-arrow, .btn-toggle-arrow');
      if (arrow) arrow.textContent = isCollapsed ? '▾' : '▴';
    });
  }

  // Form Submit (Prayer Generation)
  if (elements.prayerForm) {
    elements.prayerForm.addEventListener('submit', handlePrayerSubmit);
  }
  if (elements.btnSubmitPrayer) {
    elements.btnSubmitPrayer.addEventListener('click', (e) => {
      if (elements.prayerForm) {
        // let form submit event handle it
      } else {
        handlePrayerSubmit(e);
      }
    });
  }

  // Engine Tabs Switch
  if (elements.tabGemini) {
    elements.tabGemini.addEventListener('click', () => switchEngineTab('gemini'));
  }
  if (elements.tabLMStudio) {
    elements.tabLMStudio.addEventListener('click', () => switchEngineTab('lmstudio'));
  }

  // Modals Open
  document.querySelectorAll('#btnOpenSettings, #btnOpenSettingsHeader, #btnOpenSettingsFooter').forEach(btn => {
    btn.addEventListener('click', () => {
      updateEngineUI();
      openModal(elements.settingsModal);
    });
  });

  if (elements.btnOpenHistory) {
    elements.btnOpenHistory.addEventListener('click', () => {
      renderHistoryList();
      openModal(elements.historyModal);
    });
  }

  // Modals Close
  if (elements.btnCloseSettings) {
    elements.btnCloseSettings.addEventListener('click', () => closeModal(elements.settingsModal));
  }
  if (elements.btnCloseHistory) {
    elements.btnCloseHistory.addEventListener('click', () => closeModal(elements.historyModal));
  }
  if (elements.btnCloseCardModal) {
    elements.btnCloseCardModal.addEventListener('click', () => closeModal(elements.cardModal));
  }

  // Backdrop click to close modals
  [elements.settingsModal, elements.historyModal, elements.cardModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Settings Save
  if (elements.btnSaveSettings) {
    elements.btnSaveSettings.addEventListener('click', () => {
      if (elements.settingGeminiKey) {
        const keyVal = elements.settingGeminiKey.value.trim();
        if (keyVal) {
          state.geminiKey = keyVal;
          localStorage.setItem('grace_gemini_key', keyVal);
        } else if (getSharedKey()) {
          state.geminiKey = getSharedKey();
          localStorage.removeItem('grace_gemini_key');
        } else {
          state.geminiKey = '';
          localStorage.removeItem('grace_gemini_key');
        }
      }
      if (elements.settingGeminiModel) {
        state.geminiModel = elements.settingGeminiModel.value;
        localStorage.setItem('grace_gemini_model', state.geminiModel);
      }
      if (elements.settingHost) {
        state.hostUrl = elements.settingHost.value.trim();
        localStorage.setItem('grace_lm_host', state.hostUrl);
      }
      if (elements.settingDefaultVoice) {
        state.ttsVoice = elements.settingDefaultVoice.value;
        localStorage.setItem('grace_tts_voice', state.ttsVoice);
        if (elements.selectVoice) elements.selectVoice.value = state.ttsVoice;
      }

      updateEngineUI();
      closeModal(elements.settingsModal);
      showToast('설정이 성공적으로 저장되었습니다.');
    });
  }

  // Result Action Buttons
  if (elements.btnCopyAll) {
    elements.btnCopyAll.addEventListener('click', handleCopyFullPrayer);
  }
  if (elements.btnSavePrayer) {
    elements.btnSavePrayer.addEventListener('click', handleSavePrayerToBox);
  }
  if (elements.btnOpenCardModal) {
    elements.btnOpenCardModal.addEventListener('click', handleOpenPrayerCardModal);
  }
  if (elements.btnCopyCardText) {
    elements.btnCopyCardText.addEventListener('click', () => {
      if (state.currentPrayerData) {
        copyToClipboard(`[${state.currentPrayerData.topic}]\n\n${cleanPrayerText(state.currentPrayerData.prayer)}`);
        showToast('기도 카드 내용이 복사되었습니다.');
      }
    });
  }
  if (elements.btnPrintCard) {
    elements.btnPrintCard.addEventListener('click', () => window.print());
  }

  // TTS Controls
  if (elements.btnTTSPrayer) {
    elements.btnTTSPrayer.addEventListener('click', togglePrayerAudio);
  }
  if (elements.selectVoice) {
    elements.selectVoice.addEventListener('change', () => {
      state.ttsVoice = elements.selectVoice.value;
      localStorage.setItem('grace_tts_voice', state.ttsVoice);
      if (elements.settingDefaultVoice) elements.settingDefaultVoice.value = state.ttsVoice;
      if (state.isSpeaking) {
        stopPrayerAudio();
        togglePrayerAudio();
      }
    });
  }

  // History Clear
  if (elements.btnClearAllHistory) {
    elements.btnClearAllHistory.addEventListener('click', () => {
      if (confirm('보관된 모든 기도문을 삭제하시겠습니까?')) {
        state.savedPrayers = [];
        localStorage.setItem('grace_saved_prayers', '[]');
        updateSavedBadge();
        renderHistoryList();
        showToast('기도함이 비워졌습니다.');
      }
    });
  }
}

function updateCharCount() {
  if (elements.prayerTopicInput && elements.charCount) {
    const len = elements.prayerTopicInput.value.length;
    elements.charCount.textContent = `${len} / 500자`;
  }
}

function openModal(modal) {
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modal) {
  if (modal) modal.classList.add('hidden');
}

function updateSavedBadge() {
  const count = state.savedPrayers.length;
  if (elements.savedCountBadge) elements.savedCountBadge.textContent = count;
  if (elements.historyTotalCount) elements.historyTotalCount.textContent = count;
}

// ==========================================================================
// Prayer Generation & API Streaming
// ==========================================================================
async function handlePrayerSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const topic = elements.prayerTopicInput ? elements.prayerTopicInput.value.trim() : '';
  if (!topic) {
    showToast('기도 제목이나 품은 마음을 적어주세요.');
    if (elements.prayerTopicInput) elements.prayerTopicInput.focus();
    return;
  }

  const activeKey = state.geminiKey || getSharedKey();
  if (state.provider === 'gemini' && !activeKey) {
    openModal(elements.settingsModal);
    showToast('Google Gemini API 키가 필요합니다. 상단 공용 키 또는 개인 키를 설정해주세요.');
    return;
  }

  if (state.isGenerating) return;
  state.isGenerating = true;

  // Stop any active TTS audio
  stopPrayerAudio();

  const activeChip = document.querySelector('.topic-chip.active');
  const category = activeChip ? activeChip.dataset.category : '평안과 위로';
  const tone = elements.prayerTone ? elements.prayerTone.value : '위로와 평안';
  const recipient = elements.prayerRecipient ? elements.prayerRecipient.value : '나 자신';

  // Live Timer
  let elapsedSeconds = 0;
  if (elements.elapsedTimerBadge) elements.elapsedTimerBadge.textContent = '⏱️ 00:00';
  const timerInterval = setInterval(() => {
    elapsedSeconds++;
    const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(elapsedSeconds % 60).padStart(2, '0');
    if (elements.elapsedTimerBadge) {
      elements.elapsedTimerBadge.textContent = `⏱️ ${mins}:${secs}`;
    }
  }, 1000);

  // UI State: Hide results, show streaming card
  if (elements.resultContainer) elements.resultContainer.classList.add('hidden');
  if (elements.streamingSection) elements.streamingSection.classList.remove('hidden');
  if (elements.btnSubmitPrayer) {
    elements.btnSubmitPrayer.disabled = true;
    elements.btnSubmitPrayer.style.opacity = '0.6';
  }

  if (elements.generatingStatusTitle) {
    elements.generatingStatusTitle.textContent = '은혜의 말씀을 묵상하고 있습니다...';
  }
  if (elements.generatingStatusSubtitle) {
    elements.generatingStatusSubtitle.textContent = '성경 말씀 3개와 따뜻한 1분 기도문을 정성껏 작성 중입니다';
  }
  if (elements.liveStreamPreview) {
    elements.liveStreamPreview.innerHTML = '<span class="typing-cursor"></span>';
  }
  if (elements.streamingSection) {
    elements.streamingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const systemPrompt = `당신은 은혜롭고 따뜻한 기독교 영성 AI 사역자 '은혜의 기도(GraceAI)'입니다.
성도들의 간절한 기도 제목과 고민을 듣고, 성경적 진리에 기반한 3개의 성경구절과 깊은 위로와 회복을 주는 1분 내외의 정성스러운 기도문을 작성합니다.

반드시 아래 Markdown 구조를 엄격하게 준수하여 작성하십시오:

### 관련 성경구절 (3개)

1. **[성경구절 약어 및 장:절]** (예: 빌립보서 4:6-7)
- 말씀: "(개역개정 또는 알기 쉬운 성경 본문 말씀 기록)"
- 묵상: (이 말씀이 왜 이 기도 제목에 위로와 힘이 되는지 따뜻한 1-2문장의 묵상 길잡이)

2. **[성경구절 약어 및 장:절]**
- 말씀: "(두 번째 관련 성경 말씀 본문)"
- 묵상: (묵상 길잡이 1-2문장)

3. **[성경구절 약어 및 장:절]**
- 말씀: "(세 번째 관련 성경 말씀 본문)"
- 묵상: (묵상 길잡이 1-2문장)

---

### 은혜의 기도문

(이곳에 약 1분간 깊이 있게 읽고 묵상할 수 있는 분량(단락 3~4개, 공백 포함 500~700자 내외)의 정성스럽고 풍성한 기도문을 작성하십시오.
하나님을 향한 경배와 부르짖음 -> 현재 겪는 고난과 아픔에 대한 솔직한 고백 -> 하나님의 도우심과 인도하심을 향한 확신과 감사 순으로 전개하십시오.
마지막은 반드시 다음 문장으로 엄숙하고 거룩하게 끝맺으십시오:)

우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.`;

  const userPrompt = `[기도 분야]: ${category} | [기도 대상]: ${recipient} | [기도의 어조]: ${tone}
[기도 제목]:
${topic}`;

  let accumulatedContent = '';

  try {
    if (state.provider === 'gemini') {
      accumulatedContent = await callGeminiWithFallback(
        activeKey,
        state.geminiModel || 'gemini-3.5-flash-lite',
        systemPrompt,
        userPrompt,
        (token) => {
          accumulatedContent += token;
          if (elements.liveStreamPreview) {
            elements.liveStreamPreview.innerHTML = escapeHtml(accumulatedContent) + '<span class="typing-cursor"></span>';
            elements.liveStreamPreview.scrollTop = elements.liveStreamPreview.scrollHeight;
          }
        },
        (statusMsg) => {
          accumulatedContent = '';
          if (elements.liveStreamPreview) {
            elements.liveStreamPreview.innerHTML = `<span style="color:var(--gold-primary); font-size:0.9rem;">${escapeHtml(statusMsg)}</span><br><br><span class="typing-cursor"></span>`;
          }
          if (elements.generatingStatusSubtitle) {
            elements.generatingStatusSubtitle.textContent = statusMsg;
          }
        }
      );
    } else {
      accumulatedContent = await callLMStudioDirectStream(
        state.hostUrl,
        state.activeModel,
        systemPrompt,
        userPrompt,
        (token) => {
          accumulatedContent += token;
          if (elements.liveStreamPreview) {
            elements.liveStreamPreview.innerHTML = escapeHtml(accumulatedContent) + '<span class="typing-cursor"></span>';
            elements.liveStreamPreview.scrollTop = elements.liveStreamPreview.scrollHeight;
          }
        }
      );
    }

    clearInterval(timerInterval);
    const parsed = parsePrayerMarkdown(accumulatedContent);
    renderFinalResults({
      topic: topic,
      category: category,
      tone: tone,
      recipient: recipient,
      verses: parsed.verses,
      prayer: parsed.prayer,
      raw: accumulatedContent,
      date: new Date().toISOString()
    });

  } catch (err) {
    console.error('Generation error:', err);
    clearInterval(timerInterval);
    showToast(err.message, true);
    if (elements.generatingStatusTitle) elements.generatingStatusTitle.textContent = '생성 중 오류 발생';
    if (elements.generatingStatusSubtitle) elements.generatingStatusSubtitle.textContent = err.message;
  } finally {
    clearInterval(timerInterval);
    state.isGenerating = false;
    if (elements.btnSubmitPrayer) {
      elements.btnSubmitPrayer.disabled = false;
      elements.btnSubmitPrayer.style.opacity = '1';
    }
  }
}

// Robust Google Gemini API Streaming with Multi-Model Auto Failover
async function callGeminiWithFallback(apiKey, preferredModel, systemPrompt, userPrompt, onToken, onStatusUpdate) {
  const candidateModels = [
    preferredModel || 'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash'
  ];
  const modelsToTry = Array.from(new Set(candidateModels.filter(Boolean)));
  let lastError = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      if (i > 0 && onStatusUpdate) {
        onStatusUpdate(`트래픽 급증으로 대체 초고속 AI 모델(${currentModel})로 자동 전환하여 생성 중입니다...`);
      }
      const result = await callGeminiDirectStream(apiKey, currentModel, systemPrompt, userPrompt, onToken);
      return result;
    } catch (err) {
      lastError = err;
      const errMsg = (err.message || '').toLowerCase();
      const isCapacityIssue = (
        errMsg.includes('high demand') ||
        errMsg.includes('503') ||
        errMsg.includes('429') ||
        errMsg.includes('resource_exhausted') ||
        errMsg.includes('temporarily') ||
        errMsg.includes('overloaded') ||
        errMsg.includes('rate limit') ||
        errMsg.includes('timed out') ||
        errMsg.includes('연결할 수 없습니다')
      );

      if (isCapacityIssue && i < modelsToTry.length - 1) {
        console.warn(`[Gemini Failover] Model ${currentModel} error (${err.message}). Retrying with ${modelsToTry[i + 1]}...`);
        await new Promise(res => setTimeout(res, 600));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Direct Google Gemini API Streaming from browser
async function callGeminiDirectStream(apiKey, model, systemPrompt, userPrompt, onToken) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
  
  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2500
    }
  };

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    throw new Error('Google AI 서버에 연결할 수 없습니다. 인터넷 상태를 확인해주세요.');
  }

  if (!response.ok) {
    let errorDetail = `Gemini API 오류 (${response.status})`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorDetail = errJson.error.message;
      }
    } catch (e) {}
    throw new Error(errorDetail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop();

    for (const chunk of lines) {
      if (!chunk.trim()) continue;
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const parts = parsed?.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            if (p.text) {
              fullText += p.text;
              onToken(p.text);
            }
          }
        } catch (e) {}
      }
    }
  }

  return fullText;
}

// Direct LM Studio API calling from browser
async function callLMStudioDirectStream(hostUrl, modelName, systemPrompt, userPrompt, onToken) {
  const url = `${hostUrl.replace(/\/+$/, '')}/v1/chat/completions`;
  const payload = {
    model: modelName || 'gemma-4-12b-it',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.65,
    max_tokens: 1500,
    stream: true
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`LM Studio 응답 오류 (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop();

    for (const chunk of lines) {
      if (!chunk.trim()) continue;
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed?.choices?.[0]?.delta?.content || '';
          if (delta) {
            fullText += delta;
            onToken(delta);
          }
        } catch (e) {}
      }
    }
  }

  return fullText;
}

// ==========================================================================
// Parsing & Markdown
// ==========================================================================
function parsePrayerMarkdown(text) {
  if (!text || typeof text !== 'string') {
    return { verses: [], prayer: '' };
  }

  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const verseLines = [];
  const prayerLines = [];
  let inPrayerSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Specifically detect when the prayer letter section starts:
    // Matches: "### 은혜의 기도문", "## 오늘의 기도문", "# 은혜의 기도문", "### 기도문", "**은혜의 기도문**", "[은혜의 기도문]", "은혜의 기도문"
    const isPrayerHeader = /(?:^|\s)(?:#{1,6}|\*{1,3}|\[)?\s*(?:은혜(?:의|로운)?\s*기도문?|오늘의\s*기도문?|간절한\s*기도문?|기도문|Heartfelt\s*Prayer)/i.test(trimmed);

    if (!inPrayerSection && isPrayerHeader) {
      inPrayerSection = true;
      continue;
    }

    if (inPrayerSection) {
      prayerLines.push(line);
    } else {
      verseLines.push(line);
    }
  }

  let finalVerseText = verseLines.join('\n').trim();
  let finalPrayerText = prayerLines.join('\n').trim();

  if (!finalPrayerText) {
    const lastDivider = normalized.lastIndexOf('\n---');
    if (lastDivider !== -1) {
      finalVerseText = normalized.slice(0, lastDivider).trim();
      finalPrayerText = normalized.slice(lastDivider + 4).trim();
    } else {
      finalVerseText = normalized;
      finalPrayerText = normalized;
    }
  }

  // 1. Parse Bible Verses
  const verses = [];
  const vLines = finalVerseText.split('\n');
  let currentVerse = null;

  const verseRefRegex = /^(?:\d+[\.\)]|\-|\*)\s*(?:\*\*)?\[?([가-힣A-Za-z0-9\s]+?\s*\d+:\d+(?:-\d+)?)\]?(?:\*\*)?\s*[:\-–]?\s*(.*)/;

  for (const vl of vLines) {
    const lineClean = vl.trim();
    if (!lineClean || lineClean === '---' || lineClean === '***') continue;
    if (/^#{1,6}\s*(?:관련\s*성경구절|성경\s*말씀|약속의\s*말씀)/i.test(lineClean)) continue;

    const refMatch = lineClean.match(verseRefRegex);
    if (refMatch) {
      const ref = refMatch[1].trim();
      let inlineText = refMatch[2].trim().replace(/^\*+|\*+$/g, '').replace(/^["“”]|["“”]$/g, '').trim();
      currentVerse = {
        reference: ref,
        text: inlineText,
        meditation: ''
      };
      verses.push(currentVerse);
    } else if (currentVerse) {
      if (lineClean.includes('말씀') || lineClean.includes('본문')) {
        let extractedText = lineClean
          .replace(/^[\-\*–—\s]+/, '')
          .replace(/^.*?(?:말씀|본문)\s*[:\-–—]?\s*/i, '')
          .replace(/^["“”]|["“”]$/g, '')
          .trim();
        if (extractedText) {
          currentVerse.text = extractedText;
        }
      } else if (lineClean.includes('묵상') || lineClean.includes('의미') || lineClean.includes('교훈')) {
        let medClean = lineClean
          .replace(/^[\-\*–—\s]+/, '')
          .replace(/\*?묵상(?:의\s*은혜|의\s*길잡이)?\*?\s*[:\-–—]?\s*/i, '')
          .replace(/^[:\-–—\s]+/, '')
          .replace(/^["“”]|["“”]$/g, '')
          .replace(/^\*+|\*+$/g, '')
          .trim();
        if (medClean && medClean !== '---' && medClean !== '***') {
          currentVerse.meditation = medClean;
        }
      } else if (!currentVerse.text && !lineClean.startsWith('#')) {
        currentVerse.text = lineClean.replace(/^["“”]|["“”]$/g, '').trim();
      }
    }
  }

  // 2. Parse Prayer Letter
  const pLines = finalPrayerText.split('\n');
  const filteredLines = [];
  let prayerStarted = false;

  for (const pl of pLines) {
    const t = pl.trim();
    if (!t) {
      if (prayerStarted) filteredLines.push('');
      continue;
    }
    if (t.startsWith('#') || t === '---' || t === '***') continue;
    if (!prayerStarted && (t.startsWith('(이곳에') || t.startsWith('(기도문') || t.startsWith('[안내'))) continue;
    prayerStarted = true;
    filteredLines.push(pl);
  }

  let cleanPrayer = filteredLines.join('\n').trim();
  cleanPrayer = sanitizePrayerGrammar(cleanPrayer);

  if (!cleanPrayer.endsWith('아멘.')) {
    const closingPattern = /(?:우리\s*주\s*)?(?:예수\s*그리스도의|예수님의)\s*(?:이름으로\s*)?(?:기도(?:드립니다|하옵나이다|합니다))?\s*아멘?\.?$/;
    if (closingPattern.test(cleanPrayer)) {
      cleanPrayer = cleanPrayer.replace(closingPattern, '').trimEnd() + '\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';
    } else {
      cleanPrayer = cleanPrayer + '\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';
    }
  }

  if (verses.length === 0) {
    verses.push(
      { reference: "빌립보서 4:6-7", text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", meditation: "염려를 기도로 바꿀 때 세상이 줄 수 없는 하나님의 참된 평강이 우리 마음과 생각을 든든히 지켜주십니다." },
      { reference: "시편 23:1-3", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다", meditation: "선한 목자 되신 하나님께서 내 삶의 모든 길을 인도하시며, 지친 영혼을 소생시키시고 의의 길로 이끄십니다." },
      { reference: "이사야 41:10", text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라", meditation: "하나님의 전능하신 오른손이 지금도 성도님을 굳게 붙들고 계십니다." }
    );
  }

  return {
    verses: verses.slice(0, 3),
    prayer: cleanPrayer
  };
}

// Auto-correct subtle LLM grammatical hallucinations & irregular conjugation
function sanitizePrayerGrammar(text) {
  if (!text) return '';
  return text
    .replace(/(간구|기도|음성|소리|부르짖음|신음|호소|마음)(?:를|을)?\s*들\s*아\b/g, '$1를 들어')
    .replace(/\b들\s*아\s*(응답|주시|주옵|역사|인도|보살|살펴)/g, '들어 $1')
    .replace(/\b들\s*아서\b/g, '들어서')
    .replace(/\b들\s*아\b/g, '들어')
    .replace(/주시옵니사\b/g, '주시옵시사')
    .replace(/하옵니사\b/g, '하옵시사')
    .replace(/있사옵니사\b/g, '있사옵시사')
    .replace(/주옵니사\b/g, '주옵시사')
    .replace(/되옵니사\b/g, '되옵시사')
    .replace(/병이\s*낫아\b/g, '병이 나아')
    .replace(/믿\s*아\b/g, '믿어');
}

function cleanPrayerText(raw) {
  if (!raw) return '';
  let text = sanitizePrayerGrammar(String(raw).trim());
  const lines = text.split('\n');
  const cleaned = [];
  let headerSkipped = false;

  for (const line of lines) {
    let stripped = line.replace(/^[#*\-–—\s]+/, '').replace(/[#*\s]+$/, '').trim();
    const noEmoji = stripped.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    if (!headerSkipped && (noEmoji.includes('은혜의 기도문') || noEmoji.includes('은혜의 기도') || noEmoji === '기도문')) {
      continue;
    }
    headerSkipped = true;
    cleaned.push(line);
  }

  return cleaned.join('\n').trim();
}

// ==========================================================================
// Results Rendering
// ==========================================================================
function renderFinalResults(data) {
  state.currentPrayerData = data;

  if (elements.streamingSection) elements.streamingSection.classList.add('hidden');
  if (elements.resultContainer) elements.resultContainer.classList.remove('hidden');

  if (elements.resultCategoryLabel) {
    elements.resultCategoryLabel.textContent = `${data.category} • ${data.tone}`;
  }
  if (elements.prayerRecipientTag) {
    elements.prayerRecipientTag.textContent = `${data.recipient}을(를) 위해 드리는 정성 어린 기도`;
  }

  // Render 3 Bible Verses Separately
  if (elements.versesGrid) {
    elements.versesGrid.innerHTML = '';
    const verses = (data.verses && data.verses.length > 0) ? data.verses : [
      {
        reference: "빌립보서 4:6-7",
        text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라",
        meditation: "염려 대신 기도로 나아갈 때 하나님의 참된 평강이 임합니다."
      },
      {
        reference: "시편 23:1-3",
        text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다",
        meditation: "선한 목자 되신 하나님께서 내 삶의 모든 길을 인도하십니다."
      },
      {
        reference: "이사야 41:10",
        text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라",
        meditation: "나의 연약함을 아시고 굳세게 붙들어 주시는 전능하신 손길을 신뢰합니다."
      }
    ];

    verses.forEach((v, index) => {
      const card = document.createElement('div');
      card.className = 'verse-item-card';
      card.innerHTML = `
        <div>
          <div class="verse-card-header">
            <span class="verse-badge">구절 ${index + 1} • ${escapeHtml(v.reference || '성경 말씀')}</span>
            <button class="verse-copy-btn" title="이 구절 복사" data-idx="${index}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <p class="verse-text">${escapeHtml(v.text || '')}</p>
        </div>
        ${v.meditation ? `
          <div class="verse-meditation">
            <span class="verse-meditation-label">묵상의 은혜</span>
            ${escapeHtml(v.meditation)}
          </div>
        ` : ''}
      `;

      const copyBtn = card.querySelector('.verse-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          copyToClipboard(`[${v.reference}]\n"${v.text}"\n(묵상: ${v.meditation || ''})`);
          showToast(`${v.reference} 구절이 복사되었습니다.`);
        });
      }

      elements.versesGrid.appendChild(card);
    });
  }

  // Render 1-Minute Prayer Letter Directly
  const cleanedPrayer = cleanPrayerText(data.prayer);
  let paragraphs = cleanedPrayer
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // If there were only single newlines between paragraphs
  if (paragraphs.length === 1 && paragraphs[0].includes('\n')) {
    paragraphs = paragraphs[0]
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  // Safety fallback
  if (paragraphs.length === 0) {
    paragraphs = [
      "사랑과 자비의 하나님 아버지, 오늘도 지친 마음을 이끌고 주님 앞에 나아옵니다.",
      "선하신 목자 되신 주님께서 우리의 모든 길을 인도하시고 참된 평안으로 채워 주옵소서.",
      "우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    ];
  }

  if (elements.prayerBody) {
    elements.prayerBody.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  }

  // Scroll smoothly to results
  if (elements.resultContainer) {
    elements.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// Audio / TTS Recitation
// ==========================================================================
async function togglePrayerAudio() {
  if (state.isSpeaking) {
    stopPrayerAudio();
    return;
  }

  if (!state.currentPrayerData || !state.currentPrayerData.prayer) {
    showToast('낭독할 기도문 내용이 없습니다.');
    return;
  }

  const cleanedPrayer = cleanPrayerText(state.currentPrayerData.prayer);
  if (!cleanedPrayer) {
    showToast('낭독할 기도문 내용이 없습니다.');
    return;
  }

  // Check if running in KakaoTalk in-app browser
  const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);
  if (isKakaoTalk) {
    showToast('카카오톡 인앱 브라우저는 자체 보안 정책으로 음성 재생을 차단합니다. 화면 우측 메뉴(⋮)에서 [다른 브라우저로 열기(Safari/Chrome)]를 누르시면 원활히 들으실 수 있습니다.', false);
  }

  playWebSpeechTTS(cleanedPrayer);
}

function playWebSpeechTTS(text) {
  if (!('speechSynthesis' in window)) {
    showToast('현재 브라우저가 음성 낭독을 지원하지 않습니다. (Chrome 또는 Safari 권장)');
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[#*`~_\[\]()"]/g, '')
    .trim();

  const sentences = cleanText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) {
    showToast('낭독할 문장이 없습니다.');
    return;
  }

  state.speechQueue = sentences;
  state.speechQueueIndex = 0;
  state.isSpeaking = true;
  updateAudioUI(true, '기도문 낭독 중...');

  speakNextSentence();
}

function speakNextSentence() {
  if (!state.isSpeaking || state.speechQueueIndex >= state.speechQueue.length) {
    stopPrayerAudio();
    return;
  }

  const sentence = state.speechQueue[state.speechQueueIndex];
  const utter = new SpeechSynthesisUtterance(sentence);
  utter.lang = 'ko-KR';
  utter.rate = 0.90;
  utter.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const koVoices = voices.filter(v => v.lang.startsWith('ko'));
  if (koVoices.length > 0) {
    if (state.ttsVoice.includes('SunHi') || state.ttsVoice.includes('female')) {
      const femaleVoice = koVoices.find(v => /female|yuna|sunhi|sora|heami/i.test(v.name)) || koVoices[0];
      utter.voice = femaleVoice;
    } else {
      const maleVoice = koVoices.find(v => /male|inwoo|minsu|donghyuk/i.test(v.name)) || koVoices[koVoices.length - 1];
      utter.voice = maleVoice;
    }
  }

  utter.onend = () => {
    state.speechQueueIndex++;
    if (state.isSpeaking) {
      setTimeout(speakNextSentence, 250);
    }
  };

  utter.onerror = (e) => {
    console.warn('Speech error on sentence:', e);
    state.speechQueueIndex++;
    if (state.isSpeaking) {
      setTimeout(speakNextSentence, 200);
    }
  };

  window.speechSynthesis.speak(utter);
}

function stopPrayerAudio() {
  state.isSpeaking = false;
  state.speechQueue = [];
  state.speechQueueIndex = 0;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  updateAudioUI(false, '기도문 듣기');
}

function updateAudioUI(isPlaying, statusText) {
  if (elements.ttsBtnText) {
    elements.ttsBtnText.textContent = statusText;
  }

  if (elements.ttsIconWrapper) {
    if (isPlaying) {
      elements.ttsIconWrapper.innerHTML = `
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
        </svg>
      `;
    } else {
      elements.ttsIconWrapper.innerHTML = `
        <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  }
}

// ==========================================================================
// Prayer Actions (Copy, Save, Card Modal)
// ==========================================================================
function handleCopyFullPrayer() {
  if (!state.currentPrayerData) {
    showToast('복사할 기도문이 없습니다.');
    return;
  }

  const d = state.currentPrayerData;
  let copyText = `[은혜의 기도] ${d.topic}\n`;
  copyText += `카테고리: ${d.category} | ${d.recipient}을(를) 위한 기도\n\n`;
  copyText += `[주님이 주시는 오늘의 약속의 말씀]\n`;

  if (d.verses && d.verses.length > 0) {
    d.verses.forEach((v, idx) => {
      copyText += `${idx + 1}. [${v.reference}]\n"${v.text}"\n- 묵상: ${v.meditation || ''}\n\n`;
    });
  }

  copyText += `[은혜의 기도문]\n`;
  copyText += cleanPrayerText(d.prayer) + '\n\n';
  copyText += `은혜의 기도 (GraceAI) • 멜로디 성경`;

  copyToClipboard(copyText);
  showToast('말씀과 기도문 전체가 클립보드에 복사되었습니다.');
}

function handleSavePrayerToBox() {
  if (!state.currentPrayerData) {
    showToast('저장할 기도문이 없습니다.');
    return;
  }

  const prayerToSave = {
    id: Date.now().toString(),
    topic: state.currentPrayerData.topic,
    category: state.currentPrayerData.category,
    tone: state.currentPrayerData.tone,
    recipient: state.currentPrayerData.recipient,
    verses: state.currentPrayerData.verses,
    prayer: state.currentPrayerData.prayer,
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  state.savedPrayers.unshift(prayerToSave);
  if (state.savedPrayers.length > 50) state.savedPrayers.pop();

  localStorage.setItem('grace_saved_prayers', JSON.stringify(state.savedPrayers));
  updateSavedBadge();
  showToast('은혜의 기도함에 소중히 보관되었습니다. 🤍');
}

function renderHistoryList() {
  updateSavedBadge();
  if (!elements.historyList) return;

  if (state.savedPrayers.length === 0) {
    elements.historyList.innerHTML = `
      <div class="empty-state" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
        <p style="font-size:2rem; margin-bottom:0.5rem;">📖</p>
        <p>보관된 기도문이 아직 없습니다.<br>은혜로운 기도를 생성한 후 [기도함 저장]을 눌러보세요.</p>
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = state.savedPrayers.map((item, index) => `
    <div class="saved-item" data-id="${item.id}" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.2rem; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.8rem; color:var(--gold-light);">
        <span>${escapeHtml(item.category || '기도')}</span>
        <span>${escapeHtml(item.date)}</span>
      </div>
      <div style="font-weight:700; color:#fff; font-size:1.05rem; margin-bottom:0.5rem;">${escapeHtml(item.topic)}</div>
      <div style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:0.8rem;">${escapeHtml(cleanPrayerText(item.prayer).slice(0, 110))}...</div>
      <div style="display:flex; gap:0.6rem;">
        <button class="btn-load-saved" data-idx="${index}" style="padding:0.4rem 0.8rem; font-size:0.8rem; background:var(--gold-primary); color:#000; border:none; border-radius:6px; cursor:pointer; font-weight:600;">기도문 보기</button>
        <button class="btn-delete-saved" data-id="${item.id}" style="padding:0.4rem 0.8rem; font-size:0.8rem; background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:6px; cursor:pointer;">삭제</button>
      </div>
    </div>
  `).join('');

  elements.historyList.querySelectorAll('.btn-load-saved').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      const saved = state.savedPrayers[idx];
      if (saved) {
        closeModal(elements.historyModal);
        renderFinalResults(saved);
        showToast('보관된 기도문을 불러왔습니다.');
      }
    });
  });

  elements.historyList.querySelectorAll('.btn-delete-saved').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      state.savedPrayers = state.savedPrayers.filter(p => p.id !== id);
      localStorage.setItem('grace_saved_prayers', JSON.stringify(state.savedPrayers));
      updateSavedBadge();
      renderHistoryList();
      showToast('기도함에서 삭제되었습니다.');
    });
  });
}

function handleOpenPrayerCardModal() {
  if (!state.currentPrayerData) {
    showToast('기도 카드로 만들 기도문이 없습니다.');
    return;
  }

  const d = state.currentPrayerData;
  const v1 = (d.verses && d.verses[0]) ? d.verses[0] : null;

  if (elements.cardTopicTitle) elements.cardTopicTitle.textContent = d.topic;
  if (elements.cardVerseRef && v1) elements.cardVerseRef.textContent = `📖 ${v1.reference}`;
  if (elements.cardVerseQuote && v1) elements.cardVerseQuote.textContent = `"${v1.text}"`;
  if (elements.cardPrayerSnippet) {
    elements.cardPrayerSnippet.textContent = cleanPrayerText(d.prayer);
  }
  if (elements.cardDate) {
    elements.cardDate.textContent = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  openModal(elements.cardModal);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function showToast(msg, isError = false) {
  let container = elements.toastContainer || document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    elements.toastContainer = container;
  }

  const toast = document.createElement('div');
  toast.className = `toast-item ${isError ? 'error' : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);

  // Trigger reflow for animation
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
