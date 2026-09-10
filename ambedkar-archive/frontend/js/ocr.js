/**
 * ocr.js — Rare Manuscript OCR Explorer Engine & Sandbox Handler
 */

const OCR_SAMPLES = {
  'ocr-1': {
    title: 'Original Draft of Constitution Article 14 (1948)',
    refNo: 'AIC-MANU-1948-004',
    confidence: '98.4%',
    vintageText: `Draft Article 14 [State Equality]
"The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."

[Margin Note by Dr. Ambedkar]:
Ensure equal protection applies to all persons regardless of citizenship status. Non-discrimination clause in Art. 15 must supplement this unconditionally.`,
    ocrText: `Draft Article 14 [State Equality]
"The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."

[Handwritten Marginalia - Transcribed]:
Ensure equal protection applies to all persons regardless of citizenship status. Non-discrimination clause in Art. 15 must supplement this unconditionally.
Signed: B. R. Ambedkar (Chairman, Drafting Committee)`,
    translation: `Draft Article 14 [Legal Equality]
"State will not deny equality before law or equal protection of laws to any individual in India."

[Marathi Note]: कायदा आणि कायद्याचे समान संरक्षण सर्वांना मिळालेच पाहिजे.`,
    entities: [
      { name: 'Article 14', type: 'Constitutional Provision' },
      { name: 'State Equality', type: 'Legal Concept' },
      { name: 'Dr. B. R. Ambedkar', type: 'Author / Signatory' },
      { name: 'Drafting Committee', type: 'Institution' }
    ]
  },
  'ocr-2': {
    title: 'Letter to Dr. B. S. Moonje on Communal Award (1932)',
    refNo: 'AIC-LETTER-1932-019',
    confidence: '96.1%',
    vintageText: `Dear Dr. Moonje,
Regarding the representation of the Depressed Classes in the upcoming electoral reforms: We cannot compromise on joint vs separate electorates unless political safeguards are guaranteed in law.

Yours Sincerely,
B. R. Ambedkar`,
    ocrText: `Dear Dr. Moonje,
Regarding the representation of the Depressed Classes in the upcoming electoral reforms: We cannot compromise on joint vs separate electorates unless political safeguards are guaranteed in law.

Yours Sincerely,
B. R. Ambedkar`,
    translation: `प्रिय डॉ. मुंजे,
आगामी निवडणूक सुधारणांमध्ये दलितांच्या प्रतिनिधित्वाबाबत: कायदेशीर राजकीय संरक्षण हमीशिवाय आम्ही संयुक्त किंवा स्वतंत्र मतदारसंघावर तडजोड करू शकत नाही.

आपला नम्र,
बी. आर. आंबेडकर`,
    entities: [
      { name: 'Dr. B. S. Moonje', type: 'Recipient' },
      { name: 'Communal Award', type: 'Historical Event' },
      { name: 'Depressed Classes', type: 'Social Group' }
    ]
  },
  'ocr-3': {
    title: 'Annihilation of Caste - Pamphlet Proof (1936)',
    refNo: 'AIC-PUB-1936-001',
    confidence: '99.2%',
    vintageText: `ANNIHILATION OF CASTE
With a Reply to Mahatma Gandhi

Speech prepared by Dr. B. R. Ambedkar for the 1936 Annual Conference of the Jat-Pat-Todak Mandal of Lahore.

"Caste is not a physical object like a wall of bricks... Caste is a notion; it is a state of the mind."`,
    ocrText: `ANNIHILATION OF CASTE
With a Reply to Mahatma Gandhi

Speech prepared by Dr. B. R. Ambedkar for the 1936 Annual Conference of the Jat-Pat-Todak Mandal of Lahore.

"Caste is not a physical object like a wall of bricks or a line of barbed wire... Caste is a notion; it is a state of the mind."`,
    translation: `जातीचा उच्छेद (जाती निर्मूलन)
महात्मा गांधींना उत्तरासह

लाहोर येथील जात-पात तोडक मंडळाच्या १९३६ च्या वार्षिक परिषदेसाठी डॉ. बी. आर. आंबेडकर यांनी तयार केलेले भाषण.`,
    entities: [
      { name: 'Jat-Pat-Todak Mandal', type: 'Organization' },
      { name: 'Lahore', type: 'Location' },
      { name: '1936', type: 'Year' }
    ]
  },
  'ocr-4': {
    title: 'Mooknayak Newspaper Editorial Scan (1920)',
    refNo: 'AIC-NEWS-1920-001',
    confidence: '94.8%',
    vintageText: `मूकनायक - ३१ जानेवारी १९२०
"हिंदुस्थान हे विषमतेचे माहेरघर आहे. अस्पृश्यांच्या दुःखाला वाचा फोडण्यासाठी 'मूकनायक' वृत्तपत्र सुरू करत आहोत."`,
    ocrText: `मूकनायक - ३१ जानेवारी १९२०
"हिंदुस्थान हे विषमतेचे माहेरघर आहे. अस्पृश्यांच्या दुःखाला वाचा फोडण्यासाठी 'मूकनायक' वृत्तपत्र सुरू करत आहोत."`,
    translation: `MOOKNAYAK (The Leader of the Mute) - January 31, 1920
"India is the abode of inequality. We are launching the 'Mooknayak' newspaper to give voice to the suffering of the untouchables."`,
    entities: [
      { name: 'Mooknayak', type: 'Newspaper' },
      { name: 'January 31, 1920', type: 'Date' }
    ]
  }
};

let currentOcrKey = 'ocr-1';
let currentTab = 'ocrText';

document.addEventListener('DOMContentLoaded', () => {
  renderOcrSample(currentOcrKey);

  // Select Change
  const selectEl = document.getElementById('ocr-doc-select');
  if (selectEl) {
    selectEl.addEventListener('change', (e) => {
      currentOcrKey = e.target.value;
      renderOcrSample(currentOcrKey);
    });
  }

  // Quick Preset Buttons
  document.querySelectorAll('.ocr-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ocr-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      if (docSelect) docSelect.value = presetKey;
      currentOcrKey = presetKey;
      renderOcrSample(presetKey);
    });
  });

  // Tabs
  const tabOcr = document.getElementById('tab-ocr-text');
  const tabTrans = document.getElementById('tab-ocr-trans');
  const tabEntities = document.getElementById('tab-ocr-entities');

  if (tabOcr) {
    tabOcr.addEventListener('click', () => {
      setTabActive(tabOcr);
      currentTab = 'ocrText';
      updateOcrOutput();
    });
  }

  if (tabTrans) {
    tabTrans.addEventListener('click', () => {
      setTabActive(tabTrans);
      currentTab = 'translation';
      updateOcrOutput();
    });
  }

  if (tabEntities) {
    tabEntities.addEventListener('click', () => {
      setTabActive(tabEntities);
      currentTab = 'entities';
      updateOcrOutput();
    });
  }

  // Action Buttons
  const reOcrBtn = document.getElementById('run-reocr-btn');
  if (reOcrBtn) {
    reOcrBtn.addEventListener('click', () => {
      triggerScanAnimation();
    });
  }

  const copyBtn = document.getElementById('copy-ocr-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('ocr-output-content').innerText;
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast('OCR output copied to clipboard!');
      });
    });
  }

  const exportBtn = document.getElementById('export-txt-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const sample = OCR_SAMPLES[currentOcrKey];
      const content = `Document: ${sample.title}\nRef: ${sample.refNo}\nConfidence: ${sample.confidence}\n\n--- OCR EXTRACTED TEXT ---\n${sample.ocrText}\n\n--- TRANSLATION ---\n${sample.translation}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${sample.refNo}_OCR.txt`;
      link.click();
    });
  }

  // File Upload Sandbox
  const fileInput = document.getElementById('ocr-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const statusEl = document.getElementById('upload-status');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = `⏳ Uploading "${file.name}" to AI OCR Engine...`;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append('manuscript', file);

      try {
        const ocrEndpoint = (typeof API_BASE !== 'undefined' ? API_BASE : '/api') + '/ocr/scan';
        const res = await fetch(ocrEndpoint, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.success) {
          if (statusEl) statusEl.textContent = `✅ OCR Extraction Complete! Confidence: ${data.data.confidence}`;
          
          // Add custom sample
          OCR_SAMPLES['custom-upload'] = {
            title: `Custom Upload: ${file.name}`,
            refNo: 'CUSTOM-UPLOAD-001',
            confidence: data.data.confidence,
            vintageText: data.data.rawText,
            ocrText: data.data.ocrText,
            translation: 'Translation generated automatically for custom upload.',
            entities: data.data.entities || []
          };

          // Add to select
          if (selectEl) {
            const opt = document.createElement('option');
            opt.value = 'custom-upload';
            opt.textContent = `Uploaded: ${file.name}`;
            selectEl.appendChild(opt);
            selectEl.value = 'custom-upload';
          }

          currentOcrKey = 'custom-upload';
          renderOcrSample(currentOcrKey);
        } else {
          if (statusEl) statusEl.textContent = `⚠️ Demo Mode: Mocking OCR result for ${file.name}`;
          simulateLocalOcr(file.name);
        }
      } catch (err) {
        if (statusEl) statusEl.textContent = `ℹ️ API Offline: Generated offline OCR result for ${file.name}`;
        simulateLocalOcr(file.name);
      }
    });
  }
});

function setTabActive(activeBtn) {
  const tabs = [document.getElementById('tab-ocr-text'), document.getElementById('tab-ocr-trans'), document.getElementById('tab-ocr-entities')];
  tabs.forEach(t => { if (t) t.classList.remove('active'); });
  if (activeBtn) activeBtn.classList.add('active');
}

function renderOcrSample(key) {
  const sample = OCR_SAMPLES[key] || OCR_SAMPLES['ocr-1'];

  const refEl = document.getElementById('ocr-ref-no');
  const confEl = document.getElementById('ocr-confidence');
  const vintageEl = document.getElementById('vintage-doc-text');

  if (refEl) refEl.textContent = sample.refNo;
  if (confEl) confEl.textContent = sample.confidence;
  if (vintageEl) vintageEl.textContent = sample.vintageText;

  triggerScanAnimation();
  updateOcrOutput();
}

function updateOcrOutput() {
  const sample = OCR_SAMPLES[currentOcrKey] || OCR_SAMPLES['ocr-1'];
  const outputBox = document.getElementById('ocr-output-content');
  if (!outputBox) return;

  if (currentTab === 'ocrText') {
    outputBox.textContent = sample.ocrText;
  } else if (currentTab === 'translation') {
    outputBox.textContent = sample.translation;
  } else if (currentTab === 'entities') {
    outputBox.innerHTML = sample.entities.map(e => `
      <div class="flex justify-between items-center p-2 mb-2 bg-glass rounded">
        <strong class="text-gold">${e.name}</strong>
        <span class="badge badge-blue text-xs">${e.type}</span>
      </div>
    `).join('');
  }
}

function triggerScanAnimation() {
  const scanline = document.getElementById('ocr-scanline');
  if (!scanline) return;

  scanline.style.animation = 'none';
  scanline.offsetHeight; // trigger reflow
  scanline.style.animation = 'scan 2s ease-in-out infinite';

  setTimeout(() => {
    scanline.style.animation = 'none';
  }, 2200);
}

function simulateLocalOcr(filename) {
  OCR_SAMPLES['custom-upload'] = {
    title: `Uploaded Document (${filename})`,
    refNo: `LOCAL-SCAN-${Date.now().toString().slice(-4)}`,
    confidence: '97.6%',
    vintageText: `[Scanned Document Content from ${filename}]
"All human beings are born free and equal in dignity and rights."`,
    ocrText: `[AI Extracted OCR Text from ${filename}]
"All human beings are born free and equal in dignity and rights."
Extracted by Ambedkar Heritage OCR Engine v2.4`,
    translation: `[मराठी भाषांतर]
"सर्व मानवी प्राी जन्मतःच स्वतंत्र व प्रतिष्ठेने व अधिकारांनी समान असतात."`,
    entities: [
      { name: filename, type: 'Uploaded File' },
      { name: 'Human Rights', type: 'Topic' }
    ]
  };

  const selectEl = document.getElementById('ocr-doc-select');
  if (selectEl && !selectEl.querySelector('option[value="custom-upload"]')) {
    const opt = document.createElement('option');
    opt.value = 'custom-upload';
    opt.textContent = `Uploaded: ${filename}`;
    selectEl.appendChild(opt);
  }
  if (selectEl) selectEl.value = 'custom-upload';

  currentOcrKey = 'custom-upload';
  renderOcrSample(currentOcrKey);
}
