/**
 * St. Ann's College of Engineering & Technology (SACET)
 * Official Autonomous College Web Portal & AI Campus Counselor Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Chat Widget DOM Elements
  const chatWidgetPanel = document.getElementById("chatWidgetPanel");
  const chatLauncherBtn = document.getElementById("chatLauncherBtn");
  const chatCloseBtn = document.getElementById("chatCloseBtn");
  const chatExpandBtn = document.getElementById("chatExpandBtn");
  const chatClearBtn = document.getElementById("chatClearBtn");
  const chatStream = document.getElementById("chatStream");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const micBtn = document.getElementById("micBtn");
  const quickChips = document.querySelectorAll(".chip-btn");
  const deptAskBtns = document.querySelectorAll(".dept-ask-btn");
  const ctaAiTriggers = document.querySelectorAll(".trigger-ai-btn");

  // Mobile Nav & Slider DOM Elements
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");
  const sliderSlides = document.querySelectorAll(".slider-slide");
  const sliderDots = document.querySelectorAll(".slider-dots .dot");
  const slidePrev = document.getElementById("slidePrev");
  const slideNext = document.getElementById("slideNext");

  // State
  let messageHistory = [];
  let isGenerating = false;
  let speechRecognition = null;
  let isListening = false;
  let currentSlide = 0;
  let slideTimer = null;

  // 1. Initialize Knowledge Base
  await window.knowledgeBase.init();

  // 2. Initial Welcome Message
  function displayWelcomeMessage() {
    chatStream.innerHTML = "";
    appendBotMessage(
      `Hello! Welcome to **St. Ann's College of Engineering & Technology (SACET), Chirala**.\n\n` +
      `I am your official **AI Campus Counselor**, powered by **Qwen 2.5 72B Instruct**, fully grounded in **all 127 official pages & 130 circulars from sacet.ac.in**.\n\n` +
      `Ask me anything about:\n` +
      `* 👨‍🏫 **All Department HODs & Faculty:** (Data Science: **Dr. Katteda Subba Rao, Ph.D.**, CSE: **Dr. P. Harini**, AI&ML: **Dr. Hari Kishan Chapala**, Cyber: **Dr. V. Venu Gopal**, IoT: **Dr. Sreeram Indraneel**, ECE, EEE, Mech, Civil, MBA, MCA)\n` +
      `* 🎓 **Admissions & Codes:** AP EAPCET / EAMCET Code: \`SACE\` • 100% Admissions Achieved\n` +
      `* 💰 **AFRC Official Fees:** B.Tech: ₹56,800/yr • MBA/MCA: ₹35,000/yr • 100% JVD Reimbursement\n` +
      `* 💼 **Campus Placements:** TPO Mr. N. Purna Chandra Rao (09866031363) • ₹12.5 LPA Top Package • TCS, Infosys, Wipro\n` +
      `* 📰 **Live 2026 Bulletins:** Autonomous R26 Regulations, NCC CATC-I Camp, PACE Festino Champions\n` +
      `* 🚌 **30+ Bus Routes & Hostels:** Chirala, Bapatla, Ongole • On-campus secure hostels\n\n` +
      `*Click any quick suggestion above or type your question below!*`
    );
  }

  displayWelcomeMessage();

  // 3. Floating Chat Launcher & Controls
  if (chatLauncherBtn && chatWidgetPanel) {
    chatLauncherBtn.addEventListener("click", () => {
      openChatWidget();
    });
  }

  if (chatCloseBtn && chatWidgetPanel) {
    chatCloseBtn.addEventListener("click", () => {
      closeChatWidget();
    });
  }

  if (chatExpandBtn && chatWidgetPanel) {
    chatExpandBtn.addEventListener("click", () => {
      chatWidgetPanel.classList.toggle("fullscreen");
      const isFull = chatWidgetPanel.classList.contains("fullscreen");
      chatExpandBtn.innerHTML = isFull ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>';
    });
  }

  if (chatClearBtn) {
    chatClearBtn.addEventListener("click", () => {
      messageHistory = [];
      displayWelcomeMessage();
    });
  }

  function openChatWidget() {
    if (!chatWidgetPanel) return;
    chatWidgetPanel.classList.add("open");
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 200);
  }

  function closeChatWidget() {
    if (!chatWidgetPanel) return;
    chatWidgetPanel.classList.remove("open");
    chatWidgetPanel.classList.remove("fullscreen");
    if (chatExpandBtn) {
      chatExpandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  }

  // 4. Input Handlers
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    chatInput.addEventListener("input", () => {
      if (sendBtn) {
        sendBtn.disabled = !chatInput.value.trim() || isGenerating;
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
  }

  // 5. Quick Suggestion Chips
  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      if (prompt) {
        openChatWidget();
        chatInput.value = prompt;
        handleSend();
      }
    });
  });

  // 6. Department "Ask AI" Buttons
  deptAskBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const prompt = btn.getAttribute("data-prompt");
      if (prompt) {
        openChatWidget();
        chatInput.value = prompt;
        setTimeout(() => handleSend(), 300);
      }
    });
  });

  // 7. Hero CTA AI Triggers
  ctaAiTriggers.forEach(cta => {
    cta.addEventListener("click", (e) => {
      e.preventDefault();
      const prompt = cta.getAttribute("data-prompt");
      openChatWidget();
      if (prompt) {
        chatInput.value = prompt;
        setTimeout(() => handleSend(), 300);
      }
    });
  });

  // 8. Voice Recognition
  setupVoiceInput();

  // ================= Chat Messaging Pipeline =================
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isGenerating) return;

    chatInput.value = "";
    if (sendBtn) sendBtn.disabled = true;
    isGenerating = true;

    // User Bubble
    const userMsg = { role: "user", content: text };
    messageHistory.push(userMsg);
    appendUserMessage(text);

    // Bot Bubble Placeholder
    const botRow = document.createElement("div");
    botRow.className = "chat-row bot";
    botRow.innerHTML = `
      <div class="chat-bubble">
        <span style="display: inline-flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; font-weight: 500;">
          <span class="pulsing-dot" style="background: #f4c400; width: 8px; height: 8px; border-radius: 50%;"></span> Consulting verified SACET records...
        </span>
      </div>
    `;
    chatStream.appendChild(botRow);
    scrollToBottom();

    try {
      let accumulated = "";
      const onChunk = (chunkText) => {
        accumulated = chunkText;
        const bubble = botRow.querySelector(".chat-bubble");
        bubble.innerHTML = renderMarkdown(accumulated);
        scrollToBottom();
      };

      const finalReply = await window.qwenApi.sendMessage(text, messageHistory, onChunk);
      
      messageHistory.push({ role: "assistant", content: finalReply });
      const bubble = botRow.querySelector(".chat-bubble");
      bubble.innerHTML = renderMarkdown(finalReply);
      attachMessageActions(botRow, finalReply);

    } catch (err) {
      console.error(err);
      const bubble = botRow.querySelector(".chat-bubble");
      bubble.innerHTML = `<span style="color: #ef4444; font-weight: 600;">⚠️ Connection Note:</span> ${escapeHtml(err.message)}`;
    } finally {
      isGenerating = false;
      if (sendBtn) sendBtn.disabled = !chatInput.value.trim();
      scrollToBottom();
    }
  }

  function appendUserMessage(text) {
    const row = document.createElement("div");
    row.className = "chat-row user";
    row.innerHTML = `<div class="chat-bubble">${escapeHtml(text).replace(/\n/g, "<br>")}</div>`;
    chatStream.appendChild(row);
    scrollToBottom();
  }

  function appendBotMessage(md) {
    const row = document.createElement("div");
    row.className = "chat-row bot";
    row.innerHTML = `<div class="chat-bubble">${renderMarkdown(md)}</div>`;
    chatStream.appendChild(row);
    attachMessageActions(row, md);
    scrollToBottom();
  }

  function attachMessageActions(row, content) {
    const bubble = row.querySelector(".chat-bubble");
    if (!bubble || row.querySelector(".bubble-meta-actions")) return;

    const bar = document.createElement("div");
    bar.className = "bubble-meta-actions";

    // Copy Button
    const copy = document.createElement("button");
    copy.className = "bubble-btn";
    copy.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
    copy.onclick = () => {
      navigator.clipboard.writeText(content);
      copy.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
      setTimeout(() => copy.innerHTML = '<i class="fa-solid fa-copy"></i> Copy', 2000);
    };

    // Read Aloud
    const tts = document.createElement("button");
    tts.className = "bubble-btn";
    tts.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
    tts.onclick = () => {
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          tts.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
          return;
        }
        const clean = content.replace(/[#*`_>]/g, "").replace(/\n+/g, ". ");
        const utt = new SpeechSynthesisUtterance(clean);
        utt.rate = 1.0;
        utt.onend = () => { tts.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen'; };
        window.speechSynthesis.speak(utt);
        tts.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
      }
    };

    bar.appendChild(copy);
    bar.appendChild(tts);
    row.appendChild(bar);
  }

  function scrollToBottom() {
    chatStream.scrollTop = chatStream.scrollHeight;
  }

  // Voice Input Setup
  function setupVoiceInput() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (micBtn) micBtn.style.display = "none";
      return;
    }

    speechRecognition = new SR();
    speechRecognition.continuous = false;
    speechRecognition.lang = "en-US";

    speechRecognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      chatInput.value = transcript;
      chatInput.dispatchEvent(new Event("input"));
      stopListening();
    };

    speechRecognition.onerror = () => stopListening();
    speechRecognition.onend = () => stopListening();

    if (micBtn) {
      micBtn.addEventListener("click", () => {
        if (isListening) {
          speechRecognition.stop();
          stopListening();
        } else {
          speechRecognition.start();
          isListening = true;
          micBtn.style.color = "#ef4444";
        }
      });
    }

    function stopListening() {
      isListening = false;
      if (micBtn) micBtn.style.color = "";
    }
  }

  // ================= 9. Hero Carousel Controller =================
  if (sliderSlides.length > 0) {
    function goToSlide(idx) {
      sliderSlides.forEach((s, i) => {
        s.classList.toggle("active", i === idx);
      });
      sliderDots.forEach((d, i) => {
        d.classList.toggle("active", i === idx);
      });
      currentSlide = idx;
    }

    function nextSlide() {
      const n = (currentSlide + 1) % sliderSlides.length;
      goToSlide(n);
    }

    function prevSlide() {
      const p = (currentSlide - 1 + sliderSlides.length) % sliderSlides.length;
      goToSlide(p);
    }

    if (slideNext) slideNext.addEventListener("click", () => { nextSlide(); resetSlideTimer(); });
    if (slidePrev) slidePrev.addEventListener("click", () => { prevSlide(); resetSlideTimer(); });

    sliderDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetSlideTimer();
      });
    });

    function resetSlideTimer() {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 5000);
    }

    slideTimer = setInterval(nextSlide, 5000);
  }

  // ================= 10. Mobile Navigation Toggle =================
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileNavToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  // Submenu click for mobile devices
  const navDropdownLinks = document.querySelectorAll(".nav-item > .nav-link");
  navDropdownLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 992) {
        const parent = link.closest(".nav-item");
        if (parent && parent.querySelector(".dropdown-menu")) {
          e.preventDefault();
          parent.classList.toggle("open-sub");
        }
      }
    });
  });

  // Auto-close mobile nav when selecting an item
  document.querySelectorAll(".dropdown-item, .nav-menu a").forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 992 && navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        if (mobileNavToggle) mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  });

  // Click outside to close mobile nav
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 992 && navMenu && navMenu.classList.contains("open")) {
      if (!navMenu.contains(e.target) && mobileNavToggle && !mobileNavToggle.contains(e.target)) {
        navMenu.classList.remove("open");
        mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    }
  });

  // ================= Markdown Renderer & Sanitizer =================
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderMarkdown(md) {
    if (!md) return "";
    let html = escapeHtml(md);

    // 1. Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#02294f; color:#F1F5F9; padding:12px; border-radius:8px; overflow-x:auto; font-family:\'JetBrains Mono\', monospace; font-size:12px; margin:8px 0;"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; color:#063b73; padding:2px 5px; border-radius:4px; font-family:\'JetBrains Mono\', monospace; font-size:12px; border:1px solid #cbd5e1;">$1</code>');

    // 2. Markdown Tables
    html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
      const lines = match.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return match;
      let tableHtml = '<div style="overflow-x:auto; margin:10px 0;"><table style="width:100%; border-collapse:collapse; font-size:12.5px;">';
      let inBody = false;
      lines.forEach((line, idx) => {
        if (line.includes('---')) {
          inBody = true;
          return;
        }
        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (idx === 0) {
          tableHtml += '<thead style="background:#063b73; color:#fff;"><tr>' + cells.map(c => `<th style="padding:8px 10px; border:1px solid #dbe3ec;">${c}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td style="padding:8px 10px; border:1px solid #dbe3ec; background:#fff;">${c}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // 3. Blockquotes
    html = html.replace(/^\>\s+(.*$)/gim, '<blockquote style="border-left:3px solid #f4c400; padding-left:10px; margin:6px 0; color:#475569; font-style:italic;">$1</blockquote>');

    // 4. Headings
    html = html.replace(/^### (.*$)/gim, '<h4 style="color:#063b73; margin:8px 0 4px; font-size:14.5px;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="color:#063b73; margin:10px 0 6px; font-size:16px;">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 style="color:#063b73; margin:12px 0 8px; font-size:18px;">$1</h2>');

    // 5. Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#063b73;">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 6. Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#063b73; text-decoration:underline; font-weight:600;">$1</a>');

    // 7. Unordered Lists
    html = html.replace(/^\s*[-*•]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul style="margin:6px 0 6px 18px; padding:0;">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul style="margin:6px 0 6px 18px; padding:0;">/g, '');

    // 8. Paragraphs
    html = html.split(/\n\n+/).map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<pre') || p.startsWith('<div') || p.startsWith('<blockquote')) return p;
      return `<p style="margin-bottom:8px;">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return html;
  }
});
