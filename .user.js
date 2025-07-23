// ==UserScript==
// @name         Aegis: Behavioral Obfuscator + Manipulation Detector
// @namespace    https://github.com/YOUR_USERNAME/aegis
// @version      1.0
// @description  Obfuscate behavioral patterns and detect emotional manipulation in real time.
// @author       Justin
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const config = {
    debug: false
  };

  // Create debug panel
  function injectDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'aegis-debug-panel';
    panel.innerHTML = `
      <div id="aegis-header">🛡️ Aegis Status Panel
        <div id="aegis-severity-bar" style="height: 8px; width: 100%; margin-top: 4px; background: green; border-radius: 3px;"></div>
      </div>
      <div id="aegis-body">
        <div id="aegis-logs" style="height: 160px; overflow-y: auto; margin-top: 6px;"></div>
      </div>
    `;
    Object.assign(panel.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '320px',
      height: '220px',
      backgroundColor: '#111',
      color: '#0f0',
      fontSize: '12px',
      border: '1px solid #0f0',
      zIndex: 999999,
      overflow: 'hidden',
      padding: '10px',
      fontFamily: 'monospace',
      display: 'none'
    });
    document.body.appendChild(panel);
  }

  function aegisLog(message) {
    const logBox = document.getElementById('aegis-logs');
    if (logBox) {
      const line = document.createElement('div');
      line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }
    console.log(`[Aegis] ${message}`);
  }

  // Toggle panel with Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      const panel = document.getElementById('aegis-debug-panel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    }
  });

  // Periodic heartbeat
  setInterval(() => {
    aegisLog("💓 Heartbeat - script is alive");
  }, 5000);

  const manipulationTriggers = [
    "limited time", "act now", "only today", "don't miss", "urgent",
    "exclusive deal", "fear of missing out", "fomo", "breaking news",
    "just for you", "recommended for you", "you won't believe",
    "secret", "unlock", "clickbait", "manipulate", "watch now",
    "only available if", "emotionally", "personalized for you"
  ];

  const emotionalWeights = {
    fear: ["fear", "scared", "terrifying", "horrific", "alarming"],
    urgency: ["hurry", "now", "limited", "act fast", "immediately", "deadline"],
    flattery: ["you deserve", "you're special", "handpicked", "chosen", "gift for you"],
    pressure: ["don't miss", "can't wait", "must", "should", "have to"],
    anxiety: ["worry", "stress", "nervous", "concerned", "anxious"]
  };

  function getVisibleTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: node => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const style = window.getComputedStyle(parent);
        if (style.display !== "none" && style.visibility !== "hidden" && node.textContent.trim()) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function updateSeverityBar(score) {
    const bar = document.getElementById('aegis-severity-bar');
    if (!bar) return;

    if (score >= 5) {
      bar.style.background = '#ff4c4c';
      bar.style.width = '100%';
    } else if (score >= 2) {
      bar.style.background = '#ffd700';
      bar.style.width = (score / 5 * 100) + '%';
    } else {
      bar.style.background = '#4caf50';
      bar.style.width = '20%';
    }
  }

  function scanPageForManipulation() {
    const bodyText = document.body.innerText.toLowerCase();
    for (const phrase of manipulationTriggers) {
      if (bodyText.includes(phrase.toLowerCase())) {
        aegisLog(`⚠️ Trigger phrase detected: "${phrase}"`);
      }
    }
  }

  function analyzeEmotionalContent() {
    let score = 0;
    let details = [];

    const nodes = getVisibleTextNodes();
    for (const node of nodes) {
      const text = node.textContent.toLowerCase();
      for (const [emotion, words] of Object.entries(emotionalWeights)) {
        for (const word of words) {
          const matches = text.match(new RegExp(`\\b${word}\\b`, "gi"));
          if (matches) {
            score += matches.length;
            details.push(`${emotion} (${word})`);
          }
        }
      }
    }

    if (score >= 5) {
      aegisLog(`🧠 Emotional intensity high [Score: ${score}]: ${details.slice(0,5).join(', ')}...`);
    } else if (score >= 2) {
      aegisLog(`🧠 Mild emotional pressure detected [Score: ${score}]: ${details.slice(0,3).join(', ')}`);
    }
    updateSeverityBar(score);
  }

  function startDetectionModules() {
    aegisLog("🧠 Manipulation detection module activated.");
    scanPageForManipulation();
    analyzeEmotionalContent();

    const observer = new MutationObserver(() => {
      scanPageForManipulation();
      analyzeEmotionalContent();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  injectDebugPanel();
  aegisLog("🔰 Aegis initialized.");
  startDetectionModules();

})();
