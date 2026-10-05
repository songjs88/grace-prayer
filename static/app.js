/**
 * GraceAI (은혜의 기도) - Client Application
 * Connects to local Python server & LM Studio (gemma-4-12b-it)
 * Features: SSE real-time streaming, 3 Bible verse cards, heartfelt prayer rendering,
 * Web Speech TTS, Prayer Box (localStorage), and Prayer Card export.
 */

// Application State
const state = {
  provider: localStorage.getItem('grace_provider') || 'gemini',
  geminiKey: localStorage.getItem('grace_gemini_key') || '',
  geminiModel: localStorage.getItem('grace_gemini_model') || 'gemini-2.5-flash',
  hasGeminiEnvKey: false,
  lmStudioOnline: false,
  activeModel: 'gemma-4-12b-it',
  hostUrl: 'http://127.0.0.1:1234',
  currentPrayerData: null,
  isGenerating: false,
  isSpeaking: false,
  isAudioLoading: false,
  speechUtterance: null,
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
  prayerSpeedMode: document.getElementById('prayerSpeedMode'),
  btnSubmitPrayer: document.getElementById('btnSubmitPrayer'),
  btnModelTag: document.getElementById('btnModelTag'),

  // Streaming & Loading
  streamingSection: document.getElementById('streamingSection'),
  generatingStatusTitle: document.getElementById('generatingStatusTitle'),
  generatingStatusSubtitle: document.getElementById('generatingStatusSubtitle'),
  elapsedTimerBadge: document.getElementById('elapsedTimerBadge'),
  thinkingBox: document.getElementById('thinkingBox'),
  thinkingToggle: document.getElementById('thinkingToggle'),
  thinkingPreview: document.getElementById('thinkingPreview'),
  thinkingContent: document.getElementById('thinkingContent'),
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
  initServerConfig();
  setupEventListeners();
  updateCharCount();
});

function initVoiceSelector() {
  if (elements.selectVoice) {
    elements.selectVoice.value = state.ttsVoice;
    elements.selectVoice.addEventListener('change', () => {
      state.ttsVoice = elements.selectVoice.value;
      localStorage.setItem('grace_tts_voice', state.ttsVoice);
      if (elements.settingDefaultVoice) {
        elements.settingDefaultVoice.value = state.ttsVoice;
      }
      if (state.isSpeaking) {
        stopPrayerAudio();
      }
    });
  }
  if (elements.settingDefaultVoice) {
    elements.settingDefaultVoice.value = state.ttsVoice;
    elements.settingDefaultVoice.addEventListener('change', () => {
      state.ttsVoice = elements.settingDefaultVoice.value;
      localStorage.setItem('grace_tts_voice', state.ttsVoice);
      if (elements.selectVoice) {
        elements.selectVoice.value = state.ttsVoice;
      }
    });
  }
}

function initTheme() {
  if (state.theme === 'parchment') {
    document.body.classList.add('theme-parchment');
  } else {
    document.body.classList.remove('theme-parchment');
  }
}

// ==========================================================================
// AI Engine Configuration & Status (Gemini & LM Studio)
// ==========================================================================
async function initServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      state.hasGeminiEnvKey = !!data.has_gemini_env;
      
      // If server has Gemini ENV key or user hasn't explicitly set provider
      if (!localStorage.getItem('grace_provider')) {
        state.provider = data.default_provider || 'gemini';
      }
      
      if (data.default_gemini_model && !localStorage.getItem('grace_gemini_model')) {
        state.geminiModel = data.default_gemini_model;
      }
      
      if (data.gemini_models && elements.settingGeminiModel) {
        elements.settingGeminiModel.innerHTML = data.gemini_models.map(m =>
          `<option value="${m.id}" ${m.id === state.geminiModel ? 'selected' : ''}>${m.name}</option>`
        ).join('');
      }
    }
  } catch (err) {
    console.warn('Config fetch notice:', err);
  }

  // Populate inputs in settings modal
  if (elements.settingGeminiKey) {
    elements.settingGeminiKey.value = state.geminiKey;
  }
  if (elements.settingGeminiModel) {
    elements.settingGeminiModel.value = state.geminiModel;
  }

  // Switch to saved tab UI
  switchEngineTab(state.provider, false);
}

function updateEngineUI() {
  if (state.provider === 'gemini') {
    if (state.hasGeminiEnvKey || state.geminiKey) {
      elements.lmStudioBadge.className = 'status-pill status-online';
      elements.statusText.textContent = `✨ Gemini 준비됨 (${state.geminiModel})`;
      elements.btnModelTag.textContent = state.geminiModel;
    } else {
      elements.lmStudioBadge.className = 'status-pill status-offline';
      elements.statusText.textContent = '⚙️ Gemini 키 설정 필요';
      elements.btnModelTag.textContent = 'Gemini 키 입력';
    }
  } else {
    // LM Studio
    checkLMStudioStatus();
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
  elements.lmStudioBadge.className = 'status-pill status-checking';
  elements.statusText.textContent = 'LM Studio 확인 중...';

  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (data.online) {
      state.lmStudioOnline = true;
      state.activeModel = data.active_model || 'gemma-4-12b-it';
      elements.lmStudioBadge.className = 'status-pill status-online';
      elements.statusText.textContent = `LM Studio 연결됨 (${state.activeModel})`;
      elements.btnModelTag.textContent = state.activeModel;

      if (data.models && data.models.length > 0 && elements.settingModel) {
        elements.settingModel.innerHTML = data.models.map(m => 
          `<option value="${m}" ${m === state.activeModel ? 'selected' : ''}>${m}</option>`
        ).join('');
      }
      if (elements.serverStateVal) {
        elements.serverStateVal.textContent = '🟢 정상 실행 중';
        elements.serverStateVal.style.color = '#10b981';
      }
      if (elements.activeModelVal) {
        elements.activeModelVal.textContent = state.activeModel;
      }
    } else {
      markLMOffline(data.error);
    }
  } catch (err) {
    markLMOffline(err.message);
  }
}

function markLMOffline(errorMsg) {
  state.lmStudioOnline = false;
  if (state.provider === 'lmstudio') {
    elements.lmStudioBadge.className = 'status-pill status-offline';
    elements.statusText.textContent = 'LM Studio 미연결 (클릭하여 설정)';
    elements.btnModelTag.textContent = 'LM Studio 오프라인';
  }
  if (elements.serverStateVal) {
    elements.serverStateVal.textContent = '🔴 연결 실패 (서버 미실행)';
    elements.serverStateVal.style.color = '#ef4444';
  }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  elements.btnThemeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'midnight' ? 'parchment' : 'midnight';
    localStorage.setItem('grace_theme', state.theme);
    initTheme();
    showToast(`테마가 변경되었습니다 (${state.theme === 'midnight' ? '새벽 미명' : '따뜻한 양피지'})`);
  });

  // Topic Chips
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

  // Character Count & Input Clear
  elements.prayerTopicInput.addEventListener('input', updateCharCount);
  elements.btnClearTopic.addEventListener('click', () => {
    elements.prayerTopicInput.value = '';
    elements.prayerTopicInput.focus();
    updateCharCount();
  });

  // Form Submit (Prayer Generation)
  elements.prayerForm.addEventListener('submit', handlePrayerSubmit);

  // Collapsible Options Drawer
  if (elements.btnToggleOptions && elements.collapsibleOptions) {
    elements.btnToggleOptions.addEventListener('click', () => {
      const isCollapsed = elements.collapsibleOptions.classList.toggle('collapsed');
      elements.btnToggleOptions.setAttribute('aria-expanded', !isCollapsed);
      const arrow = elements.btnToggleOptions.querySelector('.btn-toggle-arrow');
      if (arrow) {
        arrow.textContent = isCollapsed ? '▼' : '▲';
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

  // Quick Model Tag click to open settings
  if (elements.btnModelTag) {
    elements.btnModelTag.addEventListener('click', () => openModal(elements.settingsModal));
  }

  // Thinking Box Toggle
  elements.thinkingToggle.addEventListener('click', () => {
    const isHidden = elements.thinkingContent.classList.toggle('hidden');
    elements.thinkingToggle.querySelector('.thinking-chevron').textContent = isHidden ? '▼' : '▲';
  });

  // Modals
  elements.lmStudioBadge.addEventListener('click', () => openModal(elements.settingsModal));
  elements.btnOpenSettings.addEventListener('click', () => openModal(elements.settingsModal));
  elements.btnCloseSettings.addEventListener('click', () => closeModal(elements.settingsModal));

  elements.btnOpenHistory.addEventListener('click', () => {
    renderHistoryList();
    openModal(elements.historyModal);
  });
  elements.btnCloseHistory.addEventListener('click', () => closeModal(elements.historyModal));
  elements.btnClearAllHistory.addEventListener('click', clearAllHistory);

  elements.btnOpenCardModal.addEventListener('click', openPrayerCardModal);
  elements.btnCloseCardModal.addEventListener('click', () => closeModal(elements.cardModal));

  // Result Actions
  elements.btnCopyAll.addEventListener('click', copyAllPrayer);
  elements.btnSavePrayer.addEventListener('click', saveCurrentPrayer);
  elements.btnTTSPrayer.addEventListener('click', togglePrayerAudio);
  elements.btnCopyCardText.addEventListener('click', copyCardSummary);
  elements.btnPrintCard.addEventListener('click', () => window.print());

  // Settings Save & Test
  elements.btnTestConnection.addEventListener('click', async () => {
    const host = elements.settingHost.value.trim() || 'http://127.0.0.1:1234';
    showToast('LM Studio 연결 테스트 중...');
    await checkLMStudioStatus();
  });

  elements.btnSaveSettings.addEventListener('click', () => {
    // Save Gemini options
    if (elements.settingGeminiKey) {
      state.geminiKey = elements.settingGeminiKey.value.trim();
      localStorage.setItem('grace_gemini_key', state.geminiKey);
    }
    if (elements.settingGeminiModel) {
      state.geminiModel = elements.settingGeminiModel.value;
      localStorage.setItem('grace_gemini_model', state.geminiModel);
    }

    // Save LM Studio options
    if (elements.settingModel) {
      state.activeModel = elements.settingModel.value;
    }
    if (elements.settingHost) {
      state.hostUrl = elements.settingHost.value.trim();
    }

    // Save Voice
    if (elements.settingDefaultVoice) {
      state.ttsVoice = elements.settingDefaultVoice.value;
      localStorage.setItem('grace_tts_voice', state.ttsVoice);
      if (elements.selectVoice) elements.selectVoice.value = state.ttsVoice;
    }

    updateEngineUI();
    closeModal(elements.settingsModal);
    const engineLabel = state.provider === 'gemini' ? 'Google Gemini' : 'LM Studio';
    showToast(`설정이 저장되었습니다 (${engineLabel})`);
  });

  // Modal Backdrop click to close
  [elements.settingsModal, elements.historyModal, elements.cardModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });
}

function updateCharCount() {
  const len = elements.prayerTopicInput.value.length;
  elements.charCount.textContent = `${len} / 500자`;
}

function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

// ==========================================================================
// Prayer Generation & SSE Streaming
// ==========================================================================
async function handlePrayerSubmit(e) {
  e.preventDefault();
  const topic = elements.prayerTopicInput.value.trim();
  if (!topic) {
    showToast('기도 제목을 입력해 주세요.');
    return;
  }

  // Check if Gemini is active and API key is needed
  if (state.provider === 'gemini' && !state.hasGeminiEnvKey && !state.geminiKey) {
    showToast('구글 Gemini API 키를 입력해주세요. 설정 창을 엽니다.');
    openModal(elements.settingsModal);
    switchEngineTab('gemini');
    if (elements.settingGeminiKey) elements.settingGeminiKey.focus();
    return;
  }

  if (state.isGenerating) return;
  state.isGenerating = true;

  // Stop any speaking audio
  stopPrayerAudio();

  // Active Category & Options
  const activeChip = document.querySelector('.topic-chip.active');
  const category = activeChip ? activeChip.dataset.category : '일반 기도';
  const tone = elements.prayerTone.value;
  const recipient = elements.prayerRecipient.value;
  const speedMode = elements.prayerSpeedMode ? elements.prayerSpeedMode.value : 'fast';

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

  elements.generatingStatusTitle.textContent = speedMode === 'fast' 
    ? '말씀과 기도문을 빠르게 작성하고 있습니다...' 
    : '말씀을 묵상하고 있습니다...';
    
  const engineDesc = state.provider === 'gemini' 
    ? `Google Gemini (${state.geminiModel}) 클라우드 AI` 
    : `${state.activeModel} 로컬 AI`;
  elements.generatingStatusSubtitle.textContent = `${engineDesc}가 성경 말씀 3개와 기도문을 짓는 중입니다`;

  elements.thinkingBox.classList.add('hidden');
  elements.thinkingContent.textContent = '';
  elements.liveStreamPreview.innerHTML = '<span class="typing-cursor"></span>';

  // Smooth scroll to streaming card
  elements.streamingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  let accumulatedContent = '';
  let accumulatedThinking = '';

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
        fast_mode: (speedMode === 'fast')
      })
    });

    if (!response.ok) {
      throw new Error(`서버 응답 오류 (${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // keep last incomplete chunk

      for (const eventBlock of lines) {
        if (!eventBlock.trim()) continue;
        
        let eventType = 'message';
        let dataStr = '';

        for (const line of eventBlock.split('\n')) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        if (!dataStr) continue;

        try {
          const payload = JSON.parse(dataStr);

          if (eventType === 'status') {
            elements.generatingStatusTitle.textContent = payload.message || '작성 중...';
          } else if (eventType === 'thinking') {
            accumulatedThinking += payload.token;
            elements.thinkingBox.classList.remove('hidden');
            elements.thinkingContent.textContent = accumulatedThinking;
            elements.thinkingPreview.textContent = accumulatedThinking.slice(-40) + '...';
          } else if (eventType === 'token') {
            accumulatedContent += payload.token;
            // Update preview
            elements.liveStreamPreview.innerHTML = escapeHtml(accumulatedContent) + '<span class="typing-cursor"></span>';
            elements.liveStreamPreview.scrollTop = elements.liveStreamPreview.scrollHeight;
          } else if (eventType === 'done') {
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
          } else if (eventType === 'error') {
            throw new Error(payload.message || '기도 생성 중 오류가 발생했습니다.');
          }
        } catch (parseErr) {
          console.warn('SSE Chunk parse notice:', parseErr);
        }
      }
    }

  } catch (err) {
    console.error('Generation error:', err);
    showToast(`오류: ${err.message}`, true);
    elements.generatingStatusTitle.textContent = '생성 중 문제가 발생했습니다';
    elements.generatingStatusSubtitle.textContent = 'LM Studio의 서버 상태와 모델 로딩 상태를 확인해주세요.';
  } finally {
    clearInterval(timerInterval);
    state.isGenerating = false;
    elements.btnSubmitPrayer.disabled = false;
    elements.btnSubmitPrayer.style.opacity = '1';
  }
}

// ==========================================================================
// Result Rendering
// ==========================================================================
function renderFinalResults(data) {
  state.currentPrayerData = data;

  // Hide loading/streaming
  elements.streamingSection.classList.add('hidden');
  elements.resultContainer.classList.remove('hidden');

  // Set Labels
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

    // Copy single verse event
    card.querySelector('.verse-copy-btn').addEventListener('click', () => {
      copyToClipboard(`[${v.reference}]\n"${v.text}"\n(묵상: ${v.meditation || ''})`);
      showToast(`${v.reference} 구절이 복사되었습니다.`);
    });

    elements.versesGrid.appendChild(card);
  });

  // Clean and format prayer text
  const cleanPrayer = cleanPrayerText(data.prayer);
  data.prayer = cleanPrayer;
  
  // Format into paragraphs and separate closing declaration
  const allParagraphs = cleanPrayer.split('\n\n').filter(p => p.trim());
  const mainParagraphs = [];
  let closingText = '우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.';

  for (const p of allParagraphs) {
    const trimmed = p.trim();
    if (trimmed.includes('예수 그리스도의 이름으로') || trimmed.includes('예수님의 이름으로') || trimmed === '아멘.' || trimmed === '아멘') {
      closingText = trimmed.replace(/^["'“”]|["'“”]$/g, '').trim();
    } else {
      mainParagraphs.push(trimmed);
    }
  }

  elements.prayerBody.innerHTML = mainParagraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  const closingEl = document.getElementById('prayerClosingDeclaration');
  if (closingEl) {
    closingEl.textContent = `"${closingText}"`;
  }

  // Auto-scroll down smoothly to results
  elements.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Clean redundant headers (e.g. '🙏 은혜의 기도문') and repair cut-off endings
function cleanPrayerText(raw) {
  if (!raw) return '';
  let text = String(raw).trim();

  // 1. Remove all header-like lines at the beginning
  const lines = text.split('\n');
  const filteredLines = [];
  let headerSkipped = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (filteredLines.length > 0) filteredLines.push('');
      continue;
    }

    const stripped = trimmed
      .replace(/^[#*\-–—\s]+/, '')
      .replace(/[#*\s]+$/, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    if (!headerSkipped && (
        stripped === '은혜의 기도문' ||
        stripped === '은혜의 기도' ||
        stripped === '기도문' ||
        stripped === '기도' ||
        stripped.includes('은혜의 기도문') ||
        stripped.toLowerCase().startsWith('prayer')
    )) {
      continue; // Skip redundant title line
    }

    headerSkipped = true;
    filteredLines.push(trimmed);
  }

  text = filteredLines.join('\n').trim();

  // 2. Ensure closing sentence is complete (fixes cut-off at "예수 그리스도의 ")
  const cutoffRegex = /(?:우리\s*주\s*)?(?:저를\s*사랑하시는\s*)?예수\s*그리스도의(?:\s*이름으로)?\s*$/;
  const cutoffRegex2 = /(?:우리\s*주\s*)?예수님의(?:\s*이름으로)?\s*$/;

  if (cutoffRegex.test(text)) {
    text = text.replace(cutoffRegex, '').trim();
    text += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.";
  } else if (cutoffRegex2.test(text)) {
    text = text.replace(cutoffRegex2, '').trim();
    text += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.";
  } else {
    if (!text.endsWith("아멘.") && !text.endsWith("아멘") && !text.endsWith("아멘!")) {
      text += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.";
    }
  }

  return text;
}

// ==========================================================================
// Text-to-Speech (Edge-TTS High Quality AI Voice Recitation)
// ==========================================================================
async function togglePrayerAudio() {
  if (state.isSpeaking) {
    stopPrayerAudio();
    return;
  }

  if (state.isAudioLoading) {
    return;
  }

  if (!state.currentPrayerData || !state.currentPrayerData.prayer) {
    showToast('낭독할 기도문이 없습니다.');
    return;
  }

  const selectedVoice = elements.selectVoice ? elements.selectVoice.value : state.ttsVoice;
  const cleanedPrayer = cleanPrayerText(state.currentPrayerData.prayer);
  
  if (!cleanedPrayer) {
    showToast('낭독할 기도문 내용이 없습니다.');
    return;
  }

  // Cache key based on voice and text fingerprint
  const cacheKey = `${selectedVoice}_${cleanedPrayer.length}_${cleanedPrayer.slice(0, 30)}`;

  // If already in audio cache, play immediately without network wait
  if (state.audioCache[cacheKey]) {
    playAudioUrl(state.audioCache[cacheKey]);
    return;
  }

  // Show visual loading state
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

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `서버 응답 오류 (${res.status})`);
    }

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    state.audioCache[cacheKey] = audioUrl;

    state.isAudioLoading = false;
    elements.btnTTSPrayer.classList.remove('loading');

    playAudioUrl(audioUrl);
  } catch (err) {
    console.error('Edge-TTS error:', err);
    state.isAudioLoading = false;
    elements.btnTTSPrayer.classList.remove('loading');
    elements.ttsBtnText.textContent = '기도문 듣기';
    showToast(`AI 음성 생성 오류: ${err.message}. 브라우저 음성으로 대체합니다.`);
    fallbackWebSpeechTTS(cleanedPrayer);
  }
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

  audio.onended = () => {
    stopPrayerAudio();
  };

  audio.onerror = (e) => {
    console.error('Audio playback error:', e);
    stopPrayerAudio();
    showToast('오디오 재생 중 오류가 발생했습니다.');
  };

  audio.play().catch(err => {
    console.error('Audio play rejection:', err);
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
  state.isSpeaking = false;
  state.isAudioLoading = false;
  elements.btnTTSPrayer.classList.remove('playing');
  elements.btnTTSPrayer.classList.remove('loading');
  elements.ttsBtnText.textContent = '기도문 듣기';
}

function fallbackWebSpeechTTS(cleanedPrayer) {
  if (!('speechSynthesis' in window)) return;
  const textToRead = cleanedPrayer
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[#*`~_\[\]()]/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.88;
  utterance.pitch = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang.startsWith('ko'));
  if (koVoice) utterance.voice = koVoice;

  utterance.onstart = () => {
    state.isSpeaking = true;
    elements.btnTTSPrayer.classList.add('playing');
    elements.ttsBtnText.textContent = '낭독 중지';
  };
  utterance.onend = () => stopPrayerAudio();
  utterance.onerror = () => stopPrayerAudio();
  window.speechSynthesis.speak(utterance);
}

// ==========================================================================
// Copy & Save Features
// ==========================================================================
function copyAllPrayer() {
  if (!state.currentPrayerData) return;

  const d = state.currentPrayerData;
  let fullText = `[은혜의 기도: ${d.topic}]\n\n`;
  fullText += `📖 오늘의 약속의 말씀 (3구절)\n`;
  if (d.verses && d.verses.length) {
    d.verses.forEach((v, i) => {
      fullText += `${i + 1}. [${v.reference}] "${v.text}"\n   - 묵상: ${v.meditation || ''}\n`;
    });
  }
  const cleanP = cleanPrayerText(d.prayer);
  const sourceName = (state.provider === 'gemini') ? `GraceAI - Google Gemini (${state.geminiModel})` : `GraceAI - LM Studio (${state.activeModel})`;
  fullText += `\n🙏 은혜의 기도문\n${cleanP}\n\n(출처: ${sourceName})`;

  copyToClipboard(fullText);
  showToast('성경구절 3개와 기도문 전체가 복사되었습니다!');
}

function saveCurrentPrayer() {
  if (!state.currentPrayerData) return;

  const exists = state.savedPrayers.some(p => p.topic === state.currentPrayerData.topic && p.prayer === state.currentPrayerData.prayer);
  if (exists) {
    showToast('이미 나의 기도함에 저장된 기도입니다.');
    return;
  }

  state.savedPrayers.unshift({
    id: Date.now(),
    ...state.currentPrayerData
  });

  localStorage.setItem('grace_saved_prayers', JSON.stringify(state.savedPrayers));
  updateSavedBadge();
  showToast('💖 나의 기도함에 은혜롭게 저장되었습니다.');
}

function updateSavedBadge() {
  elements.savedCountBadge.textContent = state.savedPrayers.length;
}

function renderHistoryList() {
  elements.historyTotalCount.textContent = `저장된 기도: ${state.savedPrayers.length}편`;

  if (state.savedPrayers.length === 0) {
    elements.historyList.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-dim);">
        <p style="font-size: 2rem; margin-bottom: 0.5rem;">📜</p>
        <p>아직 저장된 기도가 없습니다.</p>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">기도문을 생성한 후 [기도함 저장]을 눌러보세요.</p>
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = state.savedPrayers.map((p, idx) => {
    const dateFormatted = p.date ? new Date(p.date).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : '저장된 기도';

    return `
      <div class="history-item-card" data-idx="${idx}">
        <div class="history-item-meta">
          <span>${escapeHtml(p.category || '기도')} • ${escapeHtml(p.tone || '')}</span>
          <span>${dateFormatted}</span>
        </div>
        <h4 class="history-item-title">${escapeHtml(p.topic)}</h4>
        <p class="history-item-snippet">${escapeHtml(p.prayer || '')}</p>
      </div>
    `;
  }).join('');

  // Click on history item to view
  elements.historyList.querySelectorAll('.history-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx, 10);
      const selected = state.savedPrayers[idx];
      if (selected) {
        closeModal(elements.historyModal);
        renderFinalResults(selected);
        showToast('보관함에서 기도를 불러왔습니다.');
      }
    });
  });
}

function clearAllHistory() {
  if (state.savedPrayers.length === 0) return;
  if (confirm('저장된 기도 기록을 모두 삭제하시겠습니까?')) {
    state.savedPrayers = [];
    localStorage.removeItem('grace_saved_prayers');
    updateSavedBadge();
    renderHistoryList();
    showToast('기도함이 비워졌습니다.');
  }
}

// ==========================================================================
// Prayer Card Modal & Export
// ==========================================================================
function openPrayerCardModal() {
  if (!state.currentPrayerData) {
    showToast('먼저 기도를 생성해주세요.');
    return;
  }

  const d = state.currentPrayerData;
  const firstVerse = (d.verses && d.verses[0]) || { reference: '빌립보서 4:6', text: '아무 것도 염려하지 말고 기도와 간구로 하나님께 아뢰라' };

  elements.cardVerseRef.textContent = firstVerse.reference;
  elements.cardVerseQuote.textContent = `"${firstVerse.text}"`;
  elements.cardTopicTitle.textContent = `[${d.category}] ${d.topic}`;

  // Short snippet of prayer
  const cleanP = (d.prayer || '').replace(/[#*]/g, '').trim();
  const shortSnippet = cleanP.slice(0, 220) + (cleanP.length > 220 ? '...' : '');
  elements.cardPrayerSnippet.textContent = shortSnippet;

  const now = new Date();
  elements.cardDate.textContent = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;

  openModal(elements.cardModal);
}

function copyCardSummary() {
  const vRef = elements.cardVerseRef.textContent;
  const vQuote = elements.cardVerseQuote.textContent;
  const title = elements.cardTopicTitle.textContent;
  const snippet = elements.cardPrayerSnippet.textContent;
  const text = `🎴 [GraceAI 은혜의 말씀 카드]\n\n📖 ${vRef}\n${vQuote}\n\n🙏 ${title}\n${snippet}\n\n- GraceAI 은혜의 기도`;

  copyToClipboard(text);
  showToast('카드 텍스트가 클립보드에 복사되었습니다.');
}

// ==========================================================================
// Utility Helpers
// ==========================================================================
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-999999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) toast.style.borderColor = '#ef4444';
  toast.innerHTML = `
    <span>${isError ? '⚠️' : '✨'}</span>
    <span>${escapeHtml(message)}</span>
  `;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
