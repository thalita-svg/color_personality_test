document.addEventListener("DOMContentLoaded", function () {
  // DATA
  const QUESTIONS = [
    "Abis bangun tidur, warna apa yang bikin kamu langsung waras dalam 0.2 detik?",
    "Kamar impian kamu warnanya apa?",
    "Kalau lagi stres, warna apa yang bisa nge-reset otak kamu kayak tombol F5?",
    "Temen-temen kamu tuh nge-describe kamu pakai warna apa?",
    "Lagi ada presentasi penting? Pilih warna apa biar audiens auto respect dan takut nge-judge kamu?",
    "Biar outfit kamu kelihatan hidup dan bukan NPC? Pilih warna apa?",
    "Liburan impianmu tuh warnanya kayak gimana sih kalau di bayangan kamu?",
    "Kalau kamu bikin logo brand sendiri, warna apa biar orang-orang lihat? dan bilang 'Oke, ini aesthetic'",
    "Warna apa yang bikin ide kamu nge-spawn terus kayak cheat code infinite creativity?",
    "Lagi butuh 'healing'? Warna apa yang paling cozy buat hati kamu?",
    "Snack favorit versi imajinasi kamu warnanya apa?",
    "Warna apa yang bikin kamu auto happy? kayak notif saldo masuk",
  ];
  const PALET = [
    { id: "kartu biru.png", name: "Blue", hex: "#5B8BF7" },
    { id: "kartu kuning.png", name: "Yellow", hex: "#F8D54B" },
    { id: "kartu oren.png", name: "Orange", hex: "#FF9D5C" },
    { id: "kartu merah.png", name: "Red", hex: "#E65454" },
    { id: "kartu hijau.png", name: "Green", hex: "#6FCC8B" },
    { id: "kartu ungu.png", name: "Purple", hex: "#B88DF8" },
    { id: "kartu pink.png", name: "Pink", hex: "#F7B7C1" },
    { id: "kartu beige.png", name: "Beige", hex: "#F3E5C8" },
  ];

  // STATE
  let currentStep = 0;
  const totalSteps = QUESTIONS.length;
  const answers = Array(totalSteps).fill(null);
  const scores = {};
  PALET.forEach((p) => (scores[p.id] = 0));

  // DOM
  const landing = document.getElementById("landing");
  const testCard = document.getElementById("testCard");
  const resultCard = document.getElementById("resultCard");
  const colorCard = document.getElementById("colorCard");
  const detailCard = document.getElementById("detailCard");
  const aboutCard = document.getElementById("aboutCard");
  const startBtn = document.getElementById("startBtn");
  const qTxt = document.getElementById("questionTxt");
  const grid = document.getElementById("optionsGrid");
  const progBar = document.getElementById("progBar");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const navColor = document.getElementById("nav-color");
  const navMenu = document.getElementById("nav-menu");
  const navAbout = document.getElementById("nav-about");

  // CURSOR TRAIL STATE
  let cursorTrailActive = false;
  let trailColor = "#ffffff";
  let trailType = "dot";

  // BACKGROUND AURA STATE
  let auraInterval = null;

  // FUNCTIONS
  function updateProgress() {
    const pct = Math.round((currentStep / totalSteps) * 100);
    progBar.style.width = pct + "%";
  }

  function renderQuestion() {
    qTxt.textContent = QUESTIONS[currentStep];
    grid.innerHTML = "";
    const shuffled = PALET.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach((p) => {
      const btn = document.createElement("div");
      btn.className = "color-card";
      btn.style.background = p.hex;
      btn.textContent = p.name;
      btn.addEventListener("click", () => {
        answers[currentStep] = p.id;
        Array.from(grid.children).forEach((c) => (c.style.outline = "none"));
        btn.style.outline = "4px solid #BFA98A";
      });
      grid.appendChild(btn);
      if (answers[currentStep] === p.id) btn.style.outline = "4px solid #BFA98A";
    });
    prevBtn.disabled = currentStep === 0;
    prevBtn.innerHTML = '<i class="fas fa-angle-double-left"></i>';
    nextBtn.innerHTML =
      currentStep === totalSteps - 1 ? "Finish" : '<i class="fas fa-angle-double-right"></i>';
    updateProgress();
  }

  function computeResult() {
    Object.keys(scores).forEach((k) => (scores[k] = 0));
    answers.forEach((a) => {
      if (a) scores[a] += 1;
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primaryId = sorted[0][0];
    showResult(primaryId);
  }

  function showResult(primary) {
    setDynamicBackground(primary);
    setCursorTrail(primary);

    const resultCardEl = document.getElementById("resultCard");
    const resultContent = document.createElement("div");
    resultContent.className = "result-content";

    const imagePath = `assets/${primary}`;
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Hasil Tes: ${primary}`;
    img.style.width = "100%";
    img.style.maxWidth = "500px";
    img.style.borderRadius = "20px";
    img.style.boxShadow = "0 8px 24px rgba(60,40,30,0.08)";
    img.style.margin = "0 auto";
    img.style.display = "block";

    img.onerror = function () {
      this.style.display = "none";
      const fallback = document.createElement("div");
      fallback.style.padding = "24px";
      fallback.style.backgroundColor = "#f3e5c8";
      fallback.style.borderRadius = "16px";
      fallback.style.textAlign = "center";
      fallback.style.fontFamily = '"Fredoka", sans-serif';
      fallback.innerHTML = `
        <div style="font-size: 24px; color: #4e3a2f; margin-bottom: 12px;"> 🎨 </div>
        <div style="font-size: 18px; color: #5C3B28; font-weight: 600;">
          Desain untuk <strong>${primary.replace(".png", "")}</strong> belum tersedia.
        </div>
        <div style="font-size: 14px; color: #777; margin-top: 8px;">
          Sedang dalam proses pembuatan!
        </div>
      `;
      resultContent.appendChild(fallback);
    };

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.style.gap = "8px";
    buttonGroup.style.justifyContent = "center";
    buttonGroup.style.marginTop = "16px";

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Unduh Hasil";
    downloadBtn.className = "btn";
    downloadBtn.style.fontFamily = "Fredoka, sans-serif";
    downloadBtn.style.fontSize = "16px";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.padding = "6px 12px";
    downloadBtn.style.borderRadius = "12px";
    downloadBtn.style.background = "#fff7ef";
    downloadBtn.style.color = "#5C3B28";
    downloadBtn.style.border = "1px solid #5C3B28";
    downloadBtn.style.transition = "background 0.2s ease, transform 0.1s";
    downloadBtn.addEventListener("click", () => {
      const imgElement = resultContent.querySelector("img");
      if (imgElement && imgElement.src) {
        const link = document.createElement("a");
        link.download = `hasil-tes-${primary}`;
        link.href = imgElement.src;
        link.click();
      } else {
        alert("Gambar belum siap untuk diunduh.");
      }
    });

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Ulangi Tes";
    retryBtn.className = "btn";
    retryBtn.style.fontFamily = "Fredoka, sans-serif";
    retryBtn.style.fontSize = "16px";
    retryBtn.style.fontWeight = "600";
    retryBtn.style.padding = "6px 12px";
    retryBtn.style.borderRadius = "12px";
    retryBtn.style.background = "#fff7ef";
    retryBtn.style.color = "#5C3B28";
    retryBtn.style.border = "1px solid #5C3B28";
    retryBtn.style.transition = "background 0.2s ease, transform 0.1s";
    retryBtn.addEventListener("click", () => {
      answers.fill(null);
      Object.keys(scores).forEach((k) => (scores[k] = 0));
      currentStep = 0;
      resultCardEl.style.display = "none";
      testCard.style.display = "block";
      renderQuestion();
      setActiveNav("menu");
      disableCursorTrail();
      clearAuraParticles();
    });

    const menuBtn = document.createElement("button");
    menuBtn.textContent = "Kembali ke Menu";
    menuBtn.className = "btn";
    menuBtn.style.fontFamily = "Fredoka, sans-serif";
    menuBtn.style.fontSize = "16px";
    menuBtn.style.fontWeight = "600";
    menuBtn.style.padding = "6px 12px";
    menuBtn.style.borderRadius = "12px";
    menuBtn.style.background = "#fff7ef";
    menuBtn.style.color = "#5C3B28";
    menuBtn.style.border = "1px solid #5C3B28";
    menuBtn.style.transition = "background 0.2s ease, transform 0.1s";
    menuBtn.addEventListener("click", () => {
      landing.style.display = "block";
      testCard.style.display = "none";
      resultCardEl.style.display = "none";
      aboutCard.style.display = "none";
      colorCard.style.display = "none";
      detailCard.style.display = "none";
      setActiveNav("menu");
      disableCursorTrail();
      clearAuraParticles();
    });

    buttonGroup.appendChild(downloadBtn);
    buttonGroup.appendChild(retryBtn);
    buttonGroup.appendChild(menuBtn);

    resultCardEl.innerHTML = "";
    resultCardEl.appendChild(resultContent);
    resultContent.appendChild(img);
    resultContent.appendChild(buttonGroup);

    landing.style.display = "none";
    testCard.style.display = "none";
    resultCardEl.style.display = "block";
    aboutCard.style.display = "none";
    colorCard.style.display = "none";
    detailCard.style.display = "none";
    setActiveNav("");
  }

  function renderColorGrid() {
    const container = document.getElementById("colorGrid");
    container.innerHTML = "";
    PALET.forEach((p) => {
      const item = document.createElement("div");
      item.className = "color-item";
      const colorNamesID = {
        Blue: "Biru",
        Yellow: "Kuning",
        Orange: "Oranye",
        Red: "Merah",
        Green: "Hijau",
        Purple: "Ungu",
        Pink: "Pink",
        Beige: "Beige",
      };
      item.innerHTML = `
        <div class="color-circle" style="background:${p.hex}"></div>
        <div class="color-label">Kepribadian ${colorNamesID[p.name]}</div>
      `;
      item.addEventListener("click", () => {
        showDetail(p.id);
      });
      container.appendChild(item);
    });
  }

  function showDetail(id) {
    const detailCardEl = document.getElementById("detailCard");
    const detailContent = document.createElement("div");
    detailContent.className = "card-content";

    const imagePath = `assets/${id}`;
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Kartu Kepribadian ${id}`;
    img.style.width = "100%";
    img.style.maxWidth = "500px";
    img.style.borderRadius = "20px";
    img.style.boxShadow = "0 8px 24px rgba(60,40,30,0.08)";
    img.style.margin = "0 auto";
    img.style.display = "block";

    img.onerror = function () {
      this.style.display = "none";
      const fallback = document.createElement("div");
      fallback.style.padding = "24px";
      fallback.style.backgroundColor = "#f3e5c8";
      fallback.style.borderRadius = "16px";
      fallback.style.textAlign = "center";
      fallback.style.fontFamily = '"Fredoka", sans-serif';
      fallback.innerHTML = `
        <div style="font-size: 24px; color: #4e3a2f; margin-bottom: 12px;"> 🎨 </div>
        <div style="font-size: 18px; color: #5C3B28; font-weight: 600;">
          Desain untuk <strong>${id.replace(".png", "")}</strong> belum tersedia.
        </div>
        <div style="font-size: 14px; color: #777; margin-top: 8px;">
          Sedang dalam proses pembuatan!
        </div>
      `;
      detailContent.appendChild(fallback);
    };

    const backButton = document.createElement("button");
    backButton.textContent = "Kembali ke Daftar Warna";
    backButton.className = "btn";
    backButton.style.marginTop = "16px";
    backButton.addEventListener("click", () => {
      detailCardEl.style.display = "none";
      colorCard.style.display = "block";
      setActiveNav("color");
      disableCursorTrail();
      clearAuraParticles();
    });

    detailCardEl.innerHTML = "";
    detailCardEl.appendChild(detailContent);
    detailContent.appendChild(img);
    detailContent.appendChild(backButton);

    landing.style.display = "none";
    testCard.style.display = "none";
    resultCard.style.display = "none";
    aboutCard.style.display = "none";
    colorCard.style.display = "none";
    detailCardEl.style.display = "block";
    setActiveNav("color");
  }

  function setDynamicBackground(colorId) {
    const body = document.body;
    const overlay = document.getElementById("backgroundOverlay");
    overlay.innerHTML = "";

    let bgGradient = "";
    let glowColor = "";
    let auraType = "";

    switch (true) {
      case colorId.includes("biru"):
        bgGradient = "linear-gradient(135deg, #6CA8FF, #CDE8FF, #E6F2FF)";
        glowColor = "#6CA8FF";
        auraType = "blue";
        break;
      case colorId.includes("kuning"):
        bgGradient = "linear-gradient(135deg, #F8D54B, #FFF7CC, #FFF9E6)";
        glowColor = "#F8D54B";
        auraType = "yellow";
        break;
      case colorId.includes("oren"):
        bgGradient = "linear-gradient(135deg, #FF9D5C, #FFE6D5, #FFF0E6)";
        glowColor = "#FF9D5C";
        auraType = "orange";
        break;
      case colorId.includes("merah"):
        bgGradient = "linear-gradient(135deg, #E65454, #FFC0C0, #FFE6E6)";
        glowColor = "#E65454";
        auraType = "red";
        break;
      case colorId.includes("hijau"):
        bgGradient = "linear-gradient(135deg, #6FCC8B, #D4E8C8, #E6F2E6)";
        glowColor = "#6FCC8B";
        auraType = "green";
        break;
      case colorId.includes("ungu"):
        bgGradient = "linear-gradient(135deg, #B88DF8, #E8D0F8, #F0E6FF)";
        glowColor = "#B88DF8";
        auraType = "purple";
        break;
      case colorId.includes("pink"):
        bgGradient = "linear-gradient(135deg, #F7B7C1, #FFE6F0, #FFF0F5)";
        glowColor = "#F7B7C1";
        auraType = "pink";
        break;
      case colorId.includes("beige"):
        bgGradient = "linear-gradient(135deg, #F3E5C8, #FAEDDC, #FDF6EE)";
        glowColor = "#F3E5C8";
        auraType = "beige";
        break;
      default:
        bgGradient = "linear-gradient(135deg, #faeddc, #f3e5c8)";
        glowColor = "#faeddc";
        auraType = "default";
    }

    body.style.background = bgGradient;
    createAuraParticles(auraType);

    const glow = document.createElement("div");
    glow.style.position = "fixed";
    glow.style.top = "0";
    glow.style.left = "0";
    glow.style.width = "100%";
    glow.style.height = "100%";
    glow.style.background = `radial-gradient(circle, ${glowColor} 10%, transparent 80%)`;
    glow.style.opacity = "0.1";
    glow.style.zIndex = "-1";
    overlay.appendChild(glow);
  }

  function createAuraParticles(type) {
    clearAuraParticles();

    switch (type) {
      case "blue":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle bubble";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.width = `${Math.random() * 10 + 5}px`;
          particle.style.height = particle.style.width;
          particle.style.animationDelay = `${Math.random() * 2}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 8000);
        }, 500);
        break;
      case "yellow":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle sparkle";
          particle.textContent = " ☀️ ";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 1}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 2000);
        }, 300);
        break;
      case "orange":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle ember";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = "100%";
          particle.style.width = `${Math.random() * 4 + 2}px`;
          particle.style.height = particle.style.width;
          particle.style.animationDelay = `${Math.random() * 1}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 6000);
        }, 400);
        break;
      case "red":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle pulse-line";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 0.5}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 1000);
        }, 200);
        break;
      case "green":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle leaf";
          particle.textContent = " 🍀 ";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 2}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 10000);
        }, 800);
        break;
      case "purple":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle glitter";
          particle.textContent = " 🎵 ";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 1}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 2000);
        }, 600);
        break;
      case "pink":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle petal";
          particle.textContent = " 🌸 ";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 2}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 12000);
        }, 700);
        break;
      case "beige":
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle dust";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 3}s`;
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 15000);
        }, 1000);
        break;
      default:
        auraInterval = setInterval(() => {
          const particle = document.createElement("div");
          particle.className = "aura-particle";
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.width = "4px";
          particle.style.height = "4px";
          particle.style.background = "#ffffff";
          particle.style.borderRadius = "50%";
          document.getElementById("backgroundOverlay").appendChild(particle);
          setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 3000);
        }, 1000);
    }
  }

  function clearAuraParticles() {
    if (auraInterval) {
      clearInterval(auraInterval);
      auraInterval = null;
    }
    const overlay = document.getElementById("backgroundOverlay");
    const particles = overlay.querySelectorAll(".aura-particle");
    particles.forEach((p) => {
      if (p.parentNode) p.parentNode.removeChild(p);
    });
  }

  function setCursorTrail(colorId) {
    cursorTrailActive = true;
    switch (true) {
      case colorId.includes("biru"):
        trailColor = "#6CA8FF";
        trailType = "dot";
        break;
      case colorId.includes("kuning"):
        trailColor = "#F8D54B";
        trailType = "sparkle";
        break;
      case colorId.includes("hijau"):
        trailColor = "#6FCC8B";
        trailType = "leaf";
        break;
      case colorId.includes("ungu"):
        trailColor = "#B88DF8";
        trailType = "star";
        break;
      case colorId.includes("merah"):
        trailColor = "#E65454";
        trailType = "dot";
        break;
      case colorId.includes("pink"):
        trailColor = "#F7B7C1";
        trailType = "star";
        break;
      case colorId.includes("oren"):
        trailColor = "#FF9D5C";
        trailType = "dot";
        break;
      case colorId.includes("beige"):
        trailColor = "#F3E5C8";
        trailType = "dot";
        break;
      default:
        trailColor = "#ffffff";
        trailType = "dot";
    }
    document.addEventListener("mousemove", createTrail);
  }

  function createTrail(e) {
    if (!cursorTrailActive) return;
    const trailContainer = document.getElementById("cursorTrail");
    const x = e.clientX;
    const y = e.clientY;
    let trailElement;
    switch (trailType) {
      case "dot":
        trailElement = document.createElement("div");
        trailElement.className = "trail-dot";
        trailElement.style.background = trailColor;
        trailElement.style.width = "6px";
        trailElement.style.height = "6px";
        break;
      case "sparkle":
        trailElement = document.createElement("div");
        trailElement.className = "trail-sparkle";
        trailElement.style.color = trailColor;
        trailElement.textContent = " ✨ ";
        trailElement.style.fontSize = "12px";
        break;
      case "leaf":
        trailElement = document.createElement("div");
        trailElement.className = "trail-leaf";
        trailElement.style.color = trailColor;
        trailElement.textContent = " 🍃 ";
        trailElement.style.fontSize = "16px";
        break;
      case "star":
        trailElement = document.createElement("div");
        trailElement.className = "trail-star";
        trailElement.style.color = trailColor;
        trailElement.textContent = " ⭐ ";
        trailElement.style.fontSize = "10px";
        break;
      default:
        trailElement = document.createElement("div");
        trailElement.className = "trail-dot";
        trailElement.style.background = trailColor;
        trailElement.style.width = "6px";
        trailElement.style.height = "6px";
    }
    trailElement.style.position = "absolute";
    trailElement.style.left = `${x}px`;
    trailElement.style.top = `${y}px`;
    trailContainer.appendChild(trailElement);
    setTimeout(() => {
      trailContainer.removeChild(trailElement);
    }, 1500);
  }

  function disableCursorTrail() {
    cursorTrailActive = false;
    const trailContainer = document.getElementById("cursorTrail");
    trailContainer.innerHTML = "";
    document.removeEventListener("mousemove", createTrail);
  }

  function setActiveNav(activeId) {
    [navColor, navMenu, navAbout].forEach((el) => el.classList.remove("active"));
    if (activeId === "color") navColor.classList.add("active");
    else if (activeId === "menu") navMenu.classList.add("active");
    else if (activeId === "about") navAbout.classList.add("active");
  }

  // NAVIGATION HANDLERS
  navMenu.addEventListener("click", (e) => {
    e.preventDefault();
    resultCard.style.display = "none";
    aboutCard.style.display = "none";
    colorCard.style.display = "none";
    detailCard.style.display = "none";
    testCard.style.display = "none";
    landing.style.display = "block";
    setActiveNav("menu");
    disableCursorTrail();
    clearAuraParticles();
  });

  navAbout.addEventListener("click", (e) => {
    e.preventDefault();
    landing.style.display = "none";
    testCard.style.display = "none";
    resultCard.style.display = "none";
    colorCard.style.display = "none";
    detailCard.style.display = "none";
    aboutCard.style.display = "block";
    setActiveNav("about");
    disableCursorTrail();
    clearAuraParticles();
  });

  navColor.addEventListener("click", (e) => {
    e.preventDefault();
    landing.style.display = "none";
    testCard.style.display = "none";
    resultCard.style.display = "none";
    aboutCard.style.display = "none";
    detailCard.style.display = "none";
    colorCard.style.display = "block";
    renderColorGrid();
    setActiveNav("color");
    disableCursorTrail();
    clearAuraParticles();
  });

  // EVENT LISTENERS
  startBtn.addEventListener("click", () => {
    landing.style.display = "none";
    testCard.style.display = "block";
    currentStep = 0;
    renderQuestion();
    setActiveNav("menu");
    disableCursorTrail();
    clearAuraParticles();
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderQuestion();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!answers[currentStep]) {
      alert("Pilih satu warna untuk melanjutkan.");
      return;
    }
    if (currentStep < totalSteps - 1) {
      currentStep++;
      renderQuestion();
    } else {
      computeResult();
    }
  });
});