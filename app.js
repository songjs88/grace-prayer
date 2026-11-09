/**
 * GraceAI (은혜의 기도) - Client Application
 * Supports 100% Client-Side execution on GitHub Pages (Google Gemini API & Web Speech TTS)
 * as well as Local Python server & LM Studio (gemma-4-12b-it).
 */

// Curated Sample Prayers for Instant Demo Mode (when no API key is set)
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
        meditation: "어떠한 환경 속에서도 감사와 찬양으로 나아가는 것이 우리를 향하신 하나님의 선하신 뜻입니다."
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

// Built-in obfuscated shared key for link sharing
// Built-in obfuscated shared key for link sharing
function getSharedKey() {
  const _s = "Z0xYVWJrYTZLd2VxSDk4UkxkT0dhd2xCVXRyQzBRM0hhdlA2OU5iM2FtZEs2TlI4YkEuUUE=";
  if (!_s) return "";
  try {
    return atob(_s).split("").reverse().join("");
  } catch(e) {
    return "";
  }
}

// Application State
const state = {
  provider: localStorage.getItem('grace_provider') || 'gemini',
  geminiKey: localStorage.getItem('grace_gemini_key') || getSharedKey(),
  geminiModel: (() => {
    const saved = localStorage.getItem('grace_gemini_model');
    if (!saved || saved.includes('2.5') || saved.includes('1.5')) {
      localStorage.setItem('grace_gemini_model', 'gemini-3.5-flash');
      return 'gemini-3.5-flash';
    }
    return saved;
  })(),
  hasBackendServer: false,
  hasGeminiEnvKey: false,
  lmStudioOnline: false,
  activeModel: 'gemma-4-12b-it',
  hostUrl: localStorage.getItem('grace_lm_host') || 'http://127.0.0.1:1234',
  currentPrayerData: null,
  isGenerating: false,
  isSpeaking: false,
  isAudioLoading: false,
  speechSynthesisUtterance: null,
  speechQueue: [],
  speechQueueIndex: 0,
  audioPlayer: null,
  audioCache: {},
  ttsVoice: localStorage.getItem('grace_tts_voice') || 'ko-KR-SunHiNeural',
  theme: localStorage.getItem('grace_theme') || 'midnight',
  savedPrayers: JSON.parse(localStorage.getItem('grace_saved_prayers') || '[]')
};

// DOM Elements
const elements = {
  // Header
  brandLogo: document.getElementById('brandLogo'),
  lmStudioBadge: document.getElementById('lmStudioBadge'),
  statusText: document.getElementById('statusText'),
  btnOpenHistory: document.getElementById('btnOpenHistory'),
  savedCountBadge: document.getElementById('savedCountBadge'),
  btnThemeToggle: document.getElementById('btnThemeToggle'),
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  btnOpenSettingsHeader: document.getElementById('btnOpenSettingsHeader'),
  btnOpenSettingsFooter: document.getElementById('btnOpenSettingsFooter'),

  // Form & Inputs
  chipsList: document.getElementById('chipsList'),
  prayerForm: document.getElementById('prayerForm'),
  prayerTopicInput: document.getElementById('prayerTopicInput'),
  charCount: document.getElementById('charCount'),
  btnClearTopic: document.getElementById('btnClearTopic'),
  btnToggleOptions: document.getElementById('btnToggleOptions'),
  collapsibleOptions: document.getElementById('collapsibleOptions'),
  prayerTone: document.getElementById('prayerTone'),
  prayerRecipient: document.getElementById('prayerRecipient'),
  btnSubmitPrayer: document.getElementById('btnSubmitPrayer'),

  // Streaming & Loading
  streamingSection: document.getElementById('streamingSection'),
  generatingStatusTitle: document.getElementById('generatingStatusTitle'),
  generatingStatusSubtitle: document.getElementById('generatingStatusSubtitle'),
  elapsedTimerBadge: document.getElementById('elapsedTimerBadge'),
  liveStreamPreview: document.getElementById('liveStreamPreview'),

  // Results
  resultContainer: document.getElementById('resultContainer'),
  resultCategoryLabel: document.getElementById('resultCategoryLabel'),
  versesGrid: document.getElementById('versesGrid'),
  prayerRecipientTag: document.getElementById('prayerRecipientTag'),
  prayerBody: document.getElementById('prayerBody'),
  btnTTSPrayer: document.getElementById('btnTTSPrayer'),
  ttsBtnText: document.getElementById('ttsBtnText'),
  selectVoice: document.getElementById('selectVoice'),
  ttsControlPill: document.getElementById('ttsControlPill'),
  btnSavePrayer: document.getElementById('btnSavePrayer'),
  btnCopyAll: document.getElementById('btnCopyAll'),
  btnOpenCardModal: document.getElementById('btnOpenCardModal'),

  // Modals
  historyModal: document.getElementById('historyModal'),
  btnCloseHistory: document.getElementById('btnCloseHistory'),
  historyList: document.getElementById('historyList'),
  historyTotalCount: document.getElementById('historyTotalCount'),
  btnClearAllHistory: document.getElementById('btnClearAllHistory'),

  settingsModal: document.getElementById('settingsModal'),
  btnCloseSettings: document.getElementById('btnCloseSettings'),
  tabGemini: document.getElementById('tabGemini'),
  tabLMStudio: document.getElementById('tabLMStudio'),
  paneGemini: document.getElementById('paneGemini'),
  paneLMStudio: document.getElementById('paneLMStudio'),
  settingGeminiKey: document.getElementById('settingGeminiKey'),
  settingGeminiModel: document.getElementById('settingGeminiModel'),
  settingHost: document.getElementById('settingHost'),
  settingModel: document.getElementById('settingModel'),
  settingDefaultVoice: document.getElementById('settingDefaultVoice'),
  btnTestConnection: document.getElementById('btnTestConnection'),
  serverStateVal: document.getElementById('serverStateVal'),
  activeModelVal: document.getElementById('activeModelVal'),
  btnSaveSettings: document.getElementById('btnSaveSettings'),

  cardModal: document.getElementById('cardModal'),
  btnCloseCardModal: document.getElementById('btnCloseCardModal'),
  cardVerseRef: document.getElementById('cardVerseRef'),
  cardVerseQuote: document.getElementById('cardVerseQuote'),
  cardTopicTitle: document.getElementById('cardTopicTitle'),
  cardPrayerSnippet: document.getElementById('cardPrayerSnippet'),
  cardDate: document.getElementById('cardDate'),
  btnCopyCardText: document.getElementById('btnCopyCardText'),
  btnPrintCard: document.getElementById('btnPrintCard'),

  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initVoiceSelector();
  updateSavedBadge();
  setupEventListeners();
  updateCharCount();
  initServerConfig();
});

function initVoiceSelector() {
  if (elements.selectVoice) {
    elements.selectVoice.value = state.ttsVoice;
  }
}

function initTheme() {
  document.body.className = `theme-${state.theme}`;
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    if (state.theme === 'midnight') {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  }
}

// Check Backend Server vs Client Standalone Mode
async function initServerConfig() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch('/api/config', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      state.hasBackendServer = true;
      state.hasGeminiEnvKey = !!data.has_gemini_env;

      if (state.geminiKey) {
        state.provider = 'gemini';
      } else if (!localStorage.getItem('grace_provider')) {
        state.provider = data.default_provider || 'gemini';
      }

      if (!state.geminiModel || state.geminiModel.includes('2.5') || state.geminiModel.includes('1.5')) {
        state.geminiModel = data.default_gemini_model || 'gemini-3.5-flash';
        localStorage.setItem('grace_gemini_model', state.geminiModel);
      }
    } else {
      state.hasBackendServer = false;
    }
  } catch (err) {
    state.hasBackendServer = false;
  }

  // Populate inputs in settings modal
  if (elements.settingGeminiKey) {
    if (elements.settingGeminiKey) { elements.settingGeminiKey.value = localStorage.getItem('grace_gemini_key') || ''; elements.settingGeminiKey.placeholder = '●●●●●●●● (기본 공용 키 적용됨)'; }
  }
  if (elements.settingGeminiModel) {
    elements.settingGeminiModel.value = state.geminiModel;
  }
  if (elements.settingHost) {
    elements.settingHost.value = state.hostUrl;
  }

  // Switch to saved tab UI
  switchEngineTab(state.provider, false);
}

function updateEngineUI() {
  if (elements.statusText) {
    if (state.provider === 'gemini') {
      if (state.hasGeminiEnvKey || state.geminiKey || getSharedKey()) {
        elements.statusText.textContent = `✨ Gemini 준비됨 (${state.geminiModel})`;
      } else {
        elements.statusText.textContent = '⚙️ Gemini 키 설정 필요';
      }
    } else {
      elements.statusText.textContent = '💻 LM Studio 연결 대기';
    }
  }
}

function switchEngineTab(providerName, saveToStorage = true) {
  state.provider = providerName;
  if (saveToStorage) {
    localStorage.setItem('grace_provider', providerName);
  }

  if (providerName === 'gemini') {
    if (elements.tabGemini) elements.tabGemini.classList.add('active');
    if (elements.tabLMStudio) elements.tabLMStudio.classList.remove('active');
    if (elements.paneGemini) elements.paneGemini.classList.remove('hidden');
    if (elements.paneLMStudio) elements.paneLMStudio.classList.add('hidden');
  } else {
    if (elements.tabGemini) elements.tabGemini.classList.remove('active');
    if (elements.tabLMStudio) elements.tabLMStudio.classList.add('active');
    if (elements.paneGemini) elements.paneGemini.classList.add('hidden');
    if (elements.paneLMStudio) elements.paneLMStudio.classList.remove('hidden');
  }

  updateEngineUI();
}

async function checkLMStudioStatus() {
  if (elements.serverStateVal) elements.serverStateVal.textContent = '확인 중...';

  const host = (elements.settingHost ? elements.settingHost.value.trim() : '') || state.hostUrl;
  try {
    const res = await fetch(`${host.replace(/\/+$/, '')}/v1/models`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      state.lmStudioOnline = true;
      if (elements.serverStateVal) elements.serverStateVal.textContent = '정상 연결됨 🟢';
      const models = data.data || [];
      if (models.length > 0 && elements.settingModel) {
        elements.settingModel.innerHTML = models.map(m =>
          `<option value="${m.id}" ${m.id === state.activeModel ? 'selected' : ''}>${m.id}</option>`
        ).join('');
      }
      showToast('LM Studio 서버에 성공적으로 연결되었습니다.');
    } else {
      throw new Error(`응답 코드: ${res.status}`);
    }
  } catch (err) {
    state.lmStudioOnline = false;
    if (elements.serverStateVal) elements.serverStateVal.textContent = '연결 실패 🔴';
    showToast(`LM Studio 연결 실패: ${err.message}`);
  }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  if (elements.btnThemeToggle) {
    elements.btnThemeToggle.addEventListener('click', () => {
      state.theme = state.theme === 'midnight' ? 'parchment' : 'midnight';
      localStorage.setItem('grace_theme', state.theme);
      initTheme();
      showToast(`테마가 변경되었습니다 (${state.theme === 'midnight' ? '새벽 미명' : '따뜻한 서재'})`);
    });
  }

  // Topic Chips
  if (elements.chipsList) {
    elements.chipsList.addEventListener('click', (e) => {
      const chip = e.target.closest('.topic-chip');
      if (!chip) return;

      document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const topic = chip.dataset.topic;
      if (topic) {
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
  if (elements.btnClearTopic) {
    elements.btnClearTopic.addEventListener('click', () => {
      elements.prayerTopicInput.value = '';
      elements.prayerTopicInput.focus();
      updateCharCount();
    });
  }

  // Form Submit (Prayer Generation)
  if (elements.prayerForm) {
    elements.prayerForm.addEventListener('submit', handlePrayerSubmit);
  }

  // Collapsible Options Drawer
  if (elements.btnToggleOptions && elements.collapsibleOptions) {
    elements.btnToggleOptions.addEventListener('click', () => {
      const isCollapsed = elements.collapsibleOptions.classList.toggle('collapsed');
      elements.btnToggleOptions.setAttribute('aria-expanded', !isCollapsed);
      const arrow = document.getElementById('toggleOptionsArrow');
      if (arrow) {
        arrow.textContent = isCollapsed ? '▾' : '▴';
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

  // Modals Open & Close
  const settingsButtons = [elements.btnOpenSettings, elements.btnOpenSettingsHeader, elements.btnOpenSettingsFooter];
  settingsButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(elements.settingsModal));
  });

  if (elements.btnCloseSettings) {
    elements.btnCloseSettings.addEventListener('click', () => closeModal(elements.settingsModal));
  }

  if (elements.btnOpenHistory) {
    elements.btnOpenHistory.addEventListener('click', () => {
      renderHistoryList();
      openModal(elements.historyModal);
    });
  }
  if (elements.btnCloseHistory) {
    elements.btnCloseHistory.addEventListener('click', () => closeModal(elements.historyModal));
  }
  if (elements.btnClearAllHistory) {
    elements.btnClearAllHistory.addEventListener('click', clearAllHistory);
  }

  if (elements.btnOpenCardModal) {
    elements.btnOpenCardModal.addEventListener('click', openPrayerCardModal);
  }
  if (elements.btnCloseCardModal) {
    elements.btnCloseCardModal.addEventListener('click', () => closeModal(elements.cardModal));
  }

  // Result Actions
  if (elements.btnCopyAll) elements.btnCopyAll.addEventListener('click', copyAllPrayer);
  if (elements.btnSavePrayer) elements.btnSavePrayer.addEventListener('click', saveCurrentPrayer);
  if (elements.btnTTSPrayer) elements.btnTTSPrayer.addEventListener('click', togglePrayerAudio);
  if (elements.btnCopyCardText) elements.btnCopyCardText.addEventListener('click', copyCardSummary);
  if (elements.btnPrintCard) elements.btnPrintCard.addEventListener('click', () => window.print());

  // Settings Save & Test
  if (elements.btnTestConnection) {
    elements.btnTestConnection.addEventListener('click', async () => {
      showToast('LM Studio 연결 테스트 중...');
      await checkLMStudioStatus();
    });
  }

  if (elements.btnSaveSettings) {
    elements.btnSaveSettings.addEventListener('click', () => {
      if (elements.settingGeminiKey) {
        state.geminiKey = elements.settingGeminiKey.value.trim();
        localStorage.setItem('grace_gemini_key', state.geminiKey);
      }
      if (elements.settingGeminiModel) {
        state.geminiModel = elements.settingGeminiModel.value;
        localStorage.setItem('grace_gemini_model', state.geminiModel);
      }
      if (elements.settingModel) {
        state.activeModel = elements.settingModel.value;
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

      if (elements.tabGemini && elements.tabGemini.classList.contains('active')) {
        state.provider = 'gemini';
        localStorage.setItem('grace_provider', 'gemini');
      } else if (elements.tabLMStudio && elements.tabLMStudio.classList.contains('active')) {
        state.provider = 'lmstudio';
        localStorage.setItem('grace_provider', 'lmstudio');
      }

      updateEngineUI();
      closeModal(elements.settingsModal);
      showToast('설정이 성공적으로 저장되었습니다.');
    });
  }
}

function updateCharCount() {
  if (!elements.prayerTopicInput || !elements.charCount) return;
  const len = elements.prayerTopicInput.value.length;
  elements.charCount.textContent = `${len} / 500자`;
}

function openModal(modal) {
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modal) {
  if (modal) modal.classList.add('hidden');
}

// ==========================================================================
// Prayer Generation Workflow
// ==========================================================================
async function handlePrayerSubmit(e) {
  if (e) e.preventDefault();
  const topic = elements.prayerTopicInput.value.trim();
  if (!topic) {
    showToast('기도 제목을 입력해 주세요.');
    return;
  }

  // Active Category & Options
  const activeChip = document.querySelector('.topic-chip.active');
  const category = activeChip ? activeChip.dataset.category : '평안과 위로';
  const tone = elements.prayerTone ? elements.prayerTone.value : '위로와 평안';
  const recipient = elements.prayerRecipient ? elements.prayerRecipient.value : '나 자신';

  // If Gemini provider is selected but user has no API key and no server key:
  if (state.provider === 'gemini' && !state.hasGeminiEnvKey && !state.geminiKey) {
    // Show gentle prompt giving user the option to enter key OR run instant demo
    showApiKeyOrDemoPrompt(category, topic, tone, recipient);
    return;
  }

  // Start generation
  await runPrayerGeneration(category, topic, tone, recipient);
}

function showApiKeyOrDemoPrompt(category, topic, tone, recipient) {
  // Show toast notification
  showToast('구글 Gemini 무료 API 키를 등록하시거나, 샘플 기도문을 체험하실 수 있습니다.');
  
  // Open settings modal and focus API key
  openModal(elements.settingsModal);
  switchEngineTab('gemini');
  if (elements.settingGeminiKey) {
    elements.settingGeminiKey.focus();
  }

  // If user still wants to see instant demo right away, add a one-click button in modal if not present
  let demoBar = document.getElementById('demoPromptBar');
  if (!demoBar && elements.paneGemini) {
    demoBar = document.createElement('div');
    demoBar.id = 'demoPromptBar';
    demoBar.className = 'api-prompt-box';
    demoBar.innerHTML = `
      <div class="api-prompt-title">✨ API 키 없이 바로 체험하기</div>
      <p class="api-prompt-desc">키 등록 없이 지금 입력하신 주제의 <strong>샘플 성경구절과 기도문</strong>을 즉시 확인하시겠습니까?</p>
      <div class="api-prompt-actions">
        <button type="button" id="btnRunDemoNow" class="btn-primary">✨ 샘플 기도문 바로 체험하기</button>
      </div>
    `;
    elements.paneGemini.prepend(demoBar);

    document.getElementById('btnRunDemoNow').addEventListener('click', () => {
      closeModal(elements.settingsModal);
      runSamplePrayerStream(category, topic, tone, recipient);
    });
  }
}

async function runPrayerGeneration(category, topic, tone, recipient) {
  if (state.isGenerating) return;
  state.isGenerating = true;

  // Stop any speaking audio
  stopPrayerAudio();

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

  // UI State: Hide results, show streaming section
  elements.resultContainer.classList.add('hidden');
  elements.streamingSection.classList.remove('hidden');
  elements.btnSubmitPrayer.disabled = true;
  elements.btnSubmitPrayer.style.opacity = '0.6';

  elements.generatingStatusTitle.textContent = '말씀과 기도문을 정성껏 작성하고 있습니다...';
  elements.generatingStatusSubtitle.textContent = state.provider === 'gemini'
    ? `Google Gemini (${state.geminiModel}) 클라우드 AI가 묵상 중입니다`
    : `로컬 AI (${state.activeModel})가 묵상 중입니다`;

  if (elements.liveStreamPreview) elements.liveStreamPreview.innerHTML = '<span class="typing-cursor"></span>';
  if (elements.streamingSection) elements.streamingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const systemPrompt = `당신은 성도들의 간절한 기도를 돕는 은혜로운 기독교 AI 기도 도우미입니다.
사용자가 입력한 기도 제목에 대해 아래 양식에 맞추어 [관련 성경구절 정확히 3개]와 [따뜻하고 은혜로운 기도문]을 작성하세요.
중요 규칙:
1. 기도문 시작 부분에 '은혜의 기도문' 같은 제목을 절대 붙이지 마세요. 곧바로 하나님 아버지 또는 주님을 부르며 시작하세요.
2. 기도문의 마지막 문장은 중간에 끊기지 않게 완전하게 매듭짓고, 반드시 '우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.'으로 끝마치세요.
3. 정갈한 맞춤법과 불규칙 활용: 한국어 기도문 맞춤법과 동사 활용(예: '듣다'의 활용은 '간구를 들어', '귀를 기울이사 들어 주옵소서'이며 '간구를 들아'는 심각한 오탈자이므로 절대 금지, '주시옵소서', '주시옵시사')을 철저히 지키고, 비문이나 오탈자가 없도록 정갈하게 작성하세요.

### 📖 관련 성경 말씀
1. **[책 장:절]**: "말씀 본문 내용"
   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속
2. **[책 장:절]**: "말씀 본문 내용"
   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속
3. **[책 장:절]**: "말씀 본문 내용"
   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속

### 🙏 은혜의 기도문
(하나님 아버지를 향한 진솔한 고백과 간구, 감사와 평안의 기도문 3~4문단)

우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.`;

  const userPrompt = `[기도 분야]: ${category} | [대상]: ${recipient} | [마음/어조]: ${tone}
[기도 제목]:
${topic}`;

  let accumulatedContent = '';

  try {
    // Check if we can use server proxy first
    if (state.hasBackendServer) {
      try {
        const response = await fetch('/api/generate_stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic,
            category: category,
            tone: tone,
            recipient: recipient,
            provider: state.provider,
            gemini_api_key: state.geminiKey,
            gemini_model: state.geminiModel,
            model: state.activeModel,
            host: state.hostUrl,
            fast_mode: true
          })
        });

        if (response.ok) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop();

            for (const eventBlock of lines) {
              if (!eventBlock.trim()) continue;
              let eventType = 'message';
              let dataStr = '';

              for (const line of eventBlock.split('\n')) {
                if (line.startsWith('event: ')) eventType = line.slice(7).trim();
                else if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
              }
              if (!dataStr) continue;

              try {
                const payload = JSON.parse(dataStr);
                if (eventType === 'token') {
                  accumulatedContent += payload.token;
                  if (elements.liveStreamPreview) {
                    elements.liveStreamPreview.innerHTML = escapeHtml(accumulatedContent) + '<span class="typing-cursor"></span>';
                    elements.liveStreamPreview.scrollTop = elements.liveStreamPreview.scrollHeight;
                  }
                } else if (eventType === 'done') {
                  clearInterval(timerInterval);
                  renderFinalResults({
                    topic: topic,
                    category: category,
                    tone: tone,
                    recipient: recipient,
                    verses: payload.verses || [],
                    prayer: payload.prayer || accumulatedContent,
                    raw: payload.raw || accumulatedContent,
                    date: new Date().toISOString()
                  });
                  return;
                }
              } catch (e) {}
            }
          }
          return;
        }
      } catch (serverErr) {
        console.warn('Server proxy unavailable, falling back to direct client execution:', serverErr);
      }
    }

    // Direct Client Execution Mode
    if (state.provider === 'gemini') {
      accumulatedContent = await callGeminiDirectStream(
        state.geminiKey,
        state.geminiModel,
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
    } else {
      // LM Studio
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
    elements.btnSubmitPrayer.disabled = false;
    elements.btnSubmitPrayer.style.opacity = '1';
  }
}

// Direct Google Gemini API Streaming from browser
async function callGeminiDirectStream(apiKey, model, systemPrompt, userPrompt, onToken) {
  if (!model || model.includes('2.5') || model.includes('1.5')) {
    model = 'gemini-3.5-flash';
  }

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
      maxOutputTokens: 1200
    }
  };

  if (model.includes('3.') || model.includes('flash')) {
    payload.generationConfig.thinkingConfig = { thinkingLevel: "low" };
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    throw new Error('Google AI 서버에 연결할 수 없습니다. 인터넷 상태 또는 API 키를 확인해주세요.');
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
    max_tokens: 1200,
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

// Instant Demo Sample Prayer Stream (Typing Animation)
async function runSamplePrayerStream(category, topic, tone, recipient) {
  state.isGenerating = true;
  stopPrayerAudio();

  const sample = SAMPLE_PRAYERS[category] || SAMPLE_PRAYERS["평안과 위로"];

  // Show streaming
  elements.resultContainer.classList.add('hidden');
  elements.streamingSection.classList.remove('hidden');
  elements.btnSubmitPrayer.disabled = true;
  elements.btnSubmitPrayer.style.opacity = '0.6';

  elements.generatingStatusTitle.textContent = '샘플 말씀과 기도문을 작성하고 있습니다...';
  elements.generatingStatusSubtitle.textContent = '은혜의 기도 체험 모드가 실행 중입니다';

  if (elements.liveStreamPreview) elements.liveStreamPreview.innerHTML = '<span class="typing-cursor"></span>';
  if (elements.streamingSection) elements.streamingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Synthesize text
  let fullDemoText = `### 📖 관련 성경 말씀\n`;
  sample.verses.forEach((v, idx) => {
    fullDemoText += `${idx + 1}. **[${v.reference}]**: "${v.text}"\n   - *묵상의 은혜*: ${v.meditation}\n`;
  });
  fullDemoText += `\n### 🙏 은혜의 기도문\n${sample.prayer}`;

  // Stream in fast chunks
  let currentIdx = 0;
  const chunkSize = 16;
  
  const timer = setInterval(() => {
    currentIdx += chunkSize;
    const sub = fullDemoText.slice(0, currentIdx);
    if (elements.liveStreamPreview) {
      elements.liveStreamPreview.innerHTML = escapeHtml(sub) + '<span class="typing-cursor"></span>';
      elements.liveStreamPreview.scrollTop = elements.liveStreamPreview.scrollHeight;
    }

    if (currentIdx >= fullDemoText.length) {
      clearInterval(timer);
      state.isGenerating = false;
      elements.btnSubmitPrayer.disabled = false;
      elements.btnSubmitPrayer.style.opacity = '1';

      renderFinalResults({
        topic: topic,
        category: category,
        tone: tone,
        recipient: recipient,
        verses: sample.verses,
        prayer: sample.prayer,
        raw: fullDemoText,
        date: new Date().toISOString()
      });
      showToast('샘플 기도문이 완성되었습니다! (설정에서 구글 무료 API 키를 넣으시면 매일 1,500회 실시간 AI 기도가 가능합니다)');
    }
  }, 25);
}

// ==========================================================================
// Parsing & Markdown
// ==========================================================================
function parsePrayerMarkdown(text) {
  const verses = [];
  let verseBlock = '';
  let prayerBlock = '';

  const prayerMatch = text.match(/###?\s*.*?(?:기도|Prayer).*?(?:\n|$)/i);
  if (prayerMatch) {
    verseBlock = text.slice(0, prayerMatch.index).trim();
    prayerBlock = text.slice(prayerMatch.index + prayerMatch[0].length).trim();
  } else {
    const splits = text.split(/###\s*/);
    if (splits.length >= 3) {
      verseBlock = splits[1].trim();
      prayerBlock = splits.slice(2).join('###').trim();
    } else {
      verseBlock = text;
      prayerBlock = text;
    }
  }

  const targetForVerses = verseBlock || text;
  const lines = targetForVerses.split('\n');
  let currentVerse = null;

  const verseRegex = /^(?:\d+[\.\)]|\-|\*)\s*(?:\*\*)?\[?([가-힣A-Za-z0-9\s]+?\s*\d+:\d+(?:-\d+)?)\]?(?:\*\*)?\s*[:\-–]?\s*(.*)/;

  for (const line of lines) {
    const lineClean = line.trim();
    const match = lineClean.match(verseRegex);
    if (match) {
      const ref = match[1].trim();
      let body = match[2].trim().replace(/^\*+|\*+$/g, '').replace(/^["“”]|["“”]$/g, '').trim();
      currentVerse = {
        reference: ref,
        text: body,
        meditation: ''
      };
      verses.push(currentVerse);
    } else if (currentVerse && (lineClean.includes('묵상') || lineClean.includes('의미') || lineClean.startsWith('-'))) {
      const medClean = lineClean.replace(/^[\-\*]\s*(\*묵상.*?\*|\*|묵상.*?[:\-])?\s*/, '').replace(/^\*+|\*+$/g, '').trim();
      if (medClean) {
        currentVerse.meditation = medClean;
      }
    }
  }

  // Prayer text cleanup
  let cleanPrayer = prayerBlock;
  cleanPrayer = cleanPrayer.replace(/^###?\s*.*(?:기도|Prayer).*?\n/gm, '');

  const pLines = cleanPrayer.split('\n');
  const filteredLines = [];
  let headerSkipped = false;
  for (const l of pLines) {
    let stripped = l.replace(/^[#*\-–—\s]+/, '').replace(/[#*\s]+$/, '').trim();
    const noEmoji = stripped.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    if (!headerSkipped && (noEmoji.includes('은혜의 기도문') || noEmoji.includes('은혜의 기도') || noEmoji === '기도문')) {
      continue;
    }
    headerSkipped = true;
    filteredLines.push(l);
  }
  cleanPrayer = filteredLines.join('\n').trim();

  // Grammar correction
  cleanPrayer = sanitizePrayerGrammar(cleanPrayer);

  // Closing benediction check
  const cutoffRegex = /(?:우리\s*주\s*)?(?:저를\s*사랑하시는\s*)?예수\s*그리스도의(?:\s*이름으로)?\s*$/;
  const cutoffRegex2 = /(?:우리\s*주\s*)?예수님의(?:\s*이름으로)?\s*$/;
  if (cutoffRegex.test(cleanPrayer)) {
    cleanPrayer = cleanPrayer.replace(cutoffRegex, '').trimRight() + '\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';
  } else if (cutoffRegex2.test(cleanPrayer)) {
    cleanPrayer = cleanPrayer.replace(cutoffRegex2, '').trimRight() + '\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';
  } else if (!/(?:아멘[.!]*|Amen)$/.test(cleanPrayer.trim())) {
    cleanPrayer += '\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';
  }

  // Fallback verses if extraction was empty
  if (verses.length === 0) {
    verses.push(
      { reference: "빌립보서 4:6-7", text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", meditation: "염려 대신 기도로 나아갈 때 세상이 줄 수 없는 평강을 약속하십니다." },
      { reference: "시편 23:1-3", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다", meditation: "선한 목자 되신 하나님께서 가장 안전하고 은혜로운 길로 인도하십니다." },
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

  elements.streamingSection.classList.add('hidden');
  elements.resultContainer.classList.remove('hidden');

  elements.resultCategoryLabel.textContent = `${data.category} • ${data.tone}`;
  elements.prayerRecipientTag.textContent = `${data.recipient}을(를) 위해 드리는 정성 어린 기도`;

  // Render 3 Bible Verses
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
      meditation: "선한 목자 되신 주님께서 내 삶의 모든 길을 인도하십니다."
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

    card.querySelector('.verse-copy-btn').addEventListener('click', () => {
      copyToClipboard(`[${v.reference}]\n"${v.text}"\n(묵상: ${v.meditation || ''})`);
      showToast(`${v.reference} 구절이 복사되었습니다.`);
    });

    elements.versesGrid.appendChild(card);
  });

  // Render Prayer Paragraphs
  const cleanedPrayer = cleanPrayerText(data.prayer);
  const paragraphs = cleanedPrayer
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const mainParagraphs = [];
  let closingText = "우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.";

  for (let p of paragraphs) {
    if (p.includes("우리 주 예수 그리스도") || p.includes("예수님의 이름으로") || p.endsWith("아멘.")) {
      closingText = p;
    } else {
      mainParagraphs.push(p);
    }
  }

  closingText = sanitizePrayerGrammar(closingText);
  elements.prayerBody.innerHTML = mainParagraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  
  const closingEl = document.getElementById('prayerClosingDeclaration');
  if (closingEl) {
    closingEl.textContent = `"${closingText}"`;
  }

  // Scroll into view
  elements.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // If backend server is available, attempt Edge-TTS
  if (state.hasBackendServer) {
    const selectedVoice = elements.selectVoice ? elements.selectVoice.value : state.ttsVoice;
    const cacheKey = `${selectedVoice}_${cleanedPrayer.length}_${cleanedPrayer.slice(0, 30)}`;

    if (state.audioCache[cacheKey]) {
      playAudioUrl(state.audioCache[cacheKey]);
      return;
    }

    state.isAudioLoading = true;
    elements.btnTTSPrayer.classList.add('loading');
    elements.ttsBtnText.textContent = '음성 생성 중...';

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedPrayer,
          voice: selectedVoice,
          rate: '-4%',
          pitch: '-1Hz'
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        state.audioCache[cacheKey] = audioUrl;
        state.isAudioLoading = false;
        elements.btnTTSPrayer.classList.remove('loading');
        playAudioUrl(audioUrl);
        return;
      }
    } catch (err) {
      console.warn('Backend TTS failed, using Web Speech API:', err);
    }
    state.isAudioLoading = false;
    elements.btnTTSPrayer.classList.remove('loading');
  }

  // Pure Client Web Speech API (Chunked for zero-timeout on mobile & desktop)
  playWebSpeechTTS(cleanedPrayer);
}

function playAudioUrl(url) {
  if (state.audioPlayer) {
    state.audioPlayer.pause();
    state.audioPlayer = null;
  }

  const audio = new Audio(url);
  state.audioPlayer = audio;

  audio.onplay = () => {
    state.isSpeaking = true;
    elements.btnTTSPrayer.classList.add('playing');
    elements.ttsBtnText.textContent = '낭독 중지';
    showToast('은혜로운 AI 음성으로 기도문 낭독을 시작합니다.');
  };

  audio.onended = () => stopPrayerAudio();
  audio.onerror = () => stopPrayerAudio();

  audio.play().catch(err => {
    stopPrayerAudio();
  });
}

function stopPrayerAudio() {
  if (state.audioPlayer) {
    state.audioPlayer.pause();
    state.audioPlayer.currentTime = 0;
    state.audioPlayer = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.speechQueue = [];
  state.speechQueueIndex = 0;
  state.isSpeaking = false;
  state.isAudioLoading = false;
  if (elements.btnTTSPrayer) {
    elements.btnTTSPrayer.classList.remove('playing');
    elements.btnTTSPrayer.classList.remove('loading');
  }
  if (elements.ttsBtnText) {
    elements.ttsBtnText.textContent = '기도문 듣기';
  }
}

// Sentence-by-sentence Web Speech API playback to prevent browser synthesis timeout
function playWebSpeechTTS(text) {
  if (!('speechSynthesis' in window)) {
    showToast('현재 브라우저가 음성 낭독을 지원하지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[#*`~_\[\]()"]/g, '')
    .trim();

  // Split into sentences
  const sentences = cleanText
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return;

  state.speechQueue = sentences;
  state.speechQueueIndex = 0;
  state.isSpeaking = true;
  elements.btnTTSPrayer.classList.add('playing');
  elements.ttsBtnText.textContent = '낭독 중지';
  showToast('기도문 음성 낭독을 시작합니다.');

  playNextSpeechSentence();
}

function playNextSpeechSentence() {
  if (!state.isSpeaking || state.speechQueueIndex >= state.speechQueue.length) {
    stopPrayerAudio();
    return;
  }

  const sentence = state.speechQueue[state.speechQueueIndex];
  state.speechQueueIndex++;

  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.88;
  utterance.pitch = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang.startsWith('ko') || v.name.includes('Korean') || v.name.includes('한국어'));
  if (koVoice) utterance.voice = koVoice;

  utterance.onend = () => {
    if (state.isSpeaking) {
      setTimeout(playNextSpeechSentence, 150);
    }
  };

  utterance.onerror = () => {
    if (state.isSpeaking) {
      playNextSpeechSentence();
    }
  };

  window.speechSynthesis.speak(utterance);
}

// ==========================================================================
// Prayer Box (LocalStorage) & Cards
// ==========================================================================
function copyAllPrayer() {
  if (!state.currentPrayerData) return;
  const d = state.currentPrayerData;
  let text = `🕊️ 은혜의 기도 (${d.category})\n\n`;
  text += `[주님이 주시는 오늘의 약속의 말씀]\n`;
  d.verses.forEach((v, idx) => {
    text += `${idx + 1}. [${v.reference}] "${v.text}"\n   - 묵상: ${v.meditation}\n`;
  });
  text += `\n[은혜의 기도문]\n${cleanPrayerText(d.prayer)}\n`;
  copyToClipboard(text);
  showToast('말씀과 기도문 전체가 복사되었습니다.');
}

function saveCurrentPrayer() {
  if (!state.currentPrayerData) return;
  const d = state.currentPrayerData;
  const item = {
    id: 'prayer_' + Date.now(),
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }),
    topic: d.topic,
    category: d.category,
    tone: d.tone,
    recipient: d.recipient,
    verses: d.verses,
    prayer: d.prayer
  };

  state.savedPrayers.unshift(item);
  localStorage.setItem('grace_saved_prayers', JSON.stringify(state.savedPrayers));
  updateSavedBadge();
  showToast('나의 기도함에 정성껏 저장되었습니다 📜');
}

function updateSavedBadge() {
  const count = state.savedPrayers.length;
  if (elements.savedCountBadge) {
    elements.savedCountBadge.textContent = count;
  }
}

function renderHistoryList() {
  if (!elements.historyList) return;
  elements.historyList.innerHTML = '';
  if (elements.historyTotalCount) {
    elements.historyTotalCount.textContent = `저장된 기도: ${state.savedPrayers.length}편`;
  }

  if (state.savedPrayers.length === 0) {
    elements.historyList.innerHTML = `
      <div class="history-empty">
        <span class="empty-icon">📜</span>
        <p>아직 기도함에 보관된 기도문이 없습니다.</p>
        <span class="empty-sub">은혜로운 기도를 생성한 후 [기도함 저장]을 눌러보세요.</span>
      </div>
    `;
    return;
  }

  state.savedPrayers.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'history-item-card';
    const verseCount = (item.verses && item.verses.length) || 3;
    const snippet = item.prayer.replace(/[#*`~_\[\]]/g, '').slice(0, 120) + '...';

    card.innerHTML = `
      <div class="history-card-header">
        <span class="history-card-date">${item.date}</span>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span class="history-card-tag">${item.category}</span>
          <button class="history-del-btn" title="삭제" data-id="${item.id}">✕</button>
        </div>
      </div>
      <h4 class="history-card-topic">${escapeHtml(item.topic)}</h4>
      <p class="history-card-snippet">${escapeHtml(snippet)}</p>
      <div class="history-card-footer">
        <span class="history-verse-count">📖 말씀 ${verseCount}구절 수록</span>
        <button class="btn-subtle history-load-btn" data-id="${item.id}">다시 보기</button>
      </div>
    `;

    // Delete single item
    card.querySelector('.history-del-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      state.savedPrayers = state.savedPrayers.filter(p => p.id !== item.id);
      localStorage.setItem('grace_saved_prayers', JSON.stringify(state.savedPrayers));
      updateSavedBadge();
      renderHistoryList();
      showToast('기도문이 삭제되었습니다.');
    });

    // View saved prayer
    card.querySelector('.history-load-btn').addEventListener('click', () => {
      closeModal(elements.historyModal);
      renderFinalResults(item);
    });

    elements.historyList.appendChild(card);
  });
}

function clearAllHistory() {
  if (state.savedPrayers.length === 0) return;
  if (confirm('기도함에 저장된 모든 기도를 비우시겠습니까?')) {
    state.savedPrayers = [];
    localStorage.removeItem('grace_saved_prayers');
    updateSavedBadge();
    renderHistoryList();
    showToast('기도함이 비워졌습니다.');
  }
}

function openPrayerCardModal() {
  if (!state.currentPrayerData) return;
  const d = state.currentPrayerData;
  const firstVerse = (d.verses && d.verses[0]) || { reference: "빌립보서 4:6", text: "아무 것도 염려하지 말고 기도와 간구로 너희 구할 것을 감사함으로 아뢰라" };

  if (elements.cardVerseRef) elements.cardVerseRef.textContent = firstVerse.reference;
  if (elements.cardVerseQuote) elements.cardVerseQuote.textContent = `"${firstVerse.text}"`;
  if (elements.cardTopicTitle) elements.cardTopicTitle.textContent = d.topic;

  const cleaned = cleanPrayerText(d.prayer);
  const snippet = cleaned.slice(0, 160) + '...';
  if (elements.cardPrayerSnippet) elements.cardPrayerSnippet.textContent = snippet;

  const now = new Date();
  if (elements.cardDate) {
    elements.cardDate.textContent = `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`;
  }

  openModal(elements.cardModal);
}

function copyCardSummary() {
  if (!state.currentPrayerData) return;
  const d = state.currentPrayerData;
  const firstVerse = (d.verses && d.verses[0]) || { reference: "빌 4:6", text: "" };
  const cardText = `🕊️ 은혜의 기도 카드\n\n[말씀] ${firstVerse.reference}\n"${firstVerse.text}"\n\n[기도 제목] ${d.topic}\n\n${cleanPrayerText(d.prayer)}\n\nGraceAI 은혜의 기도`;
  copyToClipboard(cardText);
  showToast('말씀 카드 내용이 복사되었습니다.');
}

// Helpers
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
}

function showToast(message, isError = false) {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span class="toast-icon">${isError ? '⚠️' : '✝'}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
