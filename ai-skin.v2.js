/* ==========================================================================
   ERAV AI Skin Analysis Module (Frontend)
   Calls Supabase Edge Function (never exposes API key)
   ========================================================================== */

//  Supabase Edge Function URL 
const SKIN_ANALYSIS_FUNCTION_URL =
  "https://zhsyovdebvhrannbgqpg.supabase.co/functions/v1/skin-analysis";

//  Camera State 
let cameraStream = null;
let capturedImageBase64 = null;

// 
// SCAN TAB SWITCH
// 
function switchScanTab(tab) {
  document.querySelectorAll(".scan-tab-content").forEach((el) => (el.style.display = "none"));
  document.querySelectorAll(".scan-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    btn.style.borderBottomColor = "transparent";
    btn.style.color = "var(--text-muted)";
  });

  const target = document.getElementById(`scan-tab-${tab}`);
  const btn = document.querySelector(`[data-scan-tab="${tab}"]`);
  if (target) target.style.display = "block";
  if (btn) {
    btn.classList.add("active");
    btn.style.borderBottomColor = "var(--gold-primary)";
    btn.style.color = "var(--text-primary)";
  }

  // Reset upload when switching away
  if (tab !== "camera") resetImageUpload();
}

// 
// IMAGE UPLOAD FUNCTIONS
// 
function handleSkinImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    // Set preview
    const previewContainer = document.getElementById("image-preview-container");
    const previewImage = document.getElementById("skin-image-preview");
    const btnUpload = document.getElementById("btn-start-upload");
    const btnCapture = document.getElementById("btn-capture");
    const btnStop = document.getElementById("btn-stop-camera");
    const scanLine = document.querySelector(".scan-line-anim");

    if (previewImage) previewImage.src = e.target.result;
    
    // Extract base64
    capturedImageBase64 = e.target.result.split(",")[1];

    // Show UI
    if (previewContainer) previewContainer.style.display = "block";
    if (btnUpload) btnUpload.style.display = "none";
    if (btnCapture) btnCapture.style.display = "inline-flex";
    if (btnStop) btnStop.style.display = "inline-flex";
    if (scanLine) scanLine.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function resetImageUpload() {
  capturedImageBase64 = null;
  const uploadInput = document.getElementById("skin-image-upload");
  if (uploadInput) uploadInput.value = "";

  const previewContainer = document.getElementById("image-preview-container");
  const previewImage = document.getElementById("skin-image-preview");
  const btnUpload = document.getElementById("btn-start-upload");
  const btnCapture = document.getElementById("btn-capture");
  const btnStop = document.getElementById("btn-stop-camera");
  const scanLine = document.querySelector(".scan-line-anim");

  if (previewContainer) previewContainer.style.display = "none";
  if (previewImage) previewImage.src = "";
  if (btnUpload) btnUpload.style.display = "inline-flex";
  if (btnCapture) btnCapture.style.display = "none";
  if (btnStop) btnStop.style.display = "none";
  if (scanLine) scanLine.style.display = "none";
}

// 
// CAPTURE & SEND TO BACKEND
// 
async function captureAndAnalyze() {
  if (!capturedImageBase64) {
    showAISkinError(" Fadlan soo dhig sawir marka hore.");
    return;
  }

  // Require Email & Password login/signup before analyzing image
  if (typeof state !== 'undefined' && !state.authUser) {
    showAuthRequiredPrompt("Fadlan geli emailkaaga iyo furaha sirta ah (Gal Koontada ama Isdiiwaangeli) si AI-du ay u falanqeyso sawirkaaga uuna ugu kaydsamo koontadaada!");
    return;
  }

  // Optionally stop animation
  const scanLine = document.querySelector(".scan-line-anim");
  if (scanLine) scanLine.style.display = "none";

  await runGeminiAnalysis("image", capturedImageBase64, null);
}

async function runAISkinAnalysisText() {
  const prompt = document.getElementById("ai-skin-prompt").value.trim();
  if (!prompt) {
    showAISkinError(" Fadlan sharax dhibaatada maqaarkaaga.");
    return;
  }

  // Require Email & Password login/signup before analyzing text
  if (typeof state !== 'undefined' && !state.authUser) {
    showAuthRequiredPrompt("Fadlan geli emailkaaga iyo furaha sirta ah (Gal Koontada ama Isdiiwaangeli) si aad u hesho falanqaynta AI-da!");
    return;
  }

  await runGeminiAnalysis("text", null, prompt);
}

// 
// MAIN ANALYSIS FUNCTION  calls Supabase Edge Function
// 
async function runGeminiAnalysis(mode, imageBase64, textPrompt) {
  const resultDiv = document.getElementById("ai-skin-result");
  resultDiv.style.display = "block";
  resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });

  // Loading state
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 3rem 1rem; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg);">
      <div class="ai-scan-spinner">
        <i class="fa-solid fa-robot" style="font-size: 2.5rem; color: var(--gold-primary); animation: pulse 1.5s infinite;"></i>
      </div>
      <h3 class="font-serif" style="font-size: 1.4rem; margin: 1rem 0 0.5rem;"> AI-du waxay baarayaan maqaarkaaga...</h3>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">Gemini Vision waxay falanqaynaysaa ${mode === 'image' ? 'sawirkaaga' : 'faahfaahintaada'}.<br>Fadlan daqiiqad yar sug.</p>
      <div style="display: flex; justify-content: center; gap: 6px; margin-top: 1.5rem;">
        ${[...Array(4)].map((_, i) => `<div style="width: 8px; height: 8px; background: var(--gold-primary); border-radius: 50%; animation: bounce 1.2s ${i * 0.2}s infinite;"></div>`).join("")}
      </div>
    </div>
  `;

  try {
    // Get Supabase auth token if logged in
    let authToken = SUPABASE_ANON_KEY;
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.access_token) authToken = data.session.access_token;
    }

    const res = await fetch(SKIN_ANALYSIS_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ mode, imageBase64, textPrompt }),
    });

    const responseData = await res.json();

    if (!res.ok || responseData.error) {
      throw new Error(responseData.error || `Cilad ka dhacday Server-ka AI (HTTP ${res.status})`);
    }

    displaySkinAnalysisResults(responseData, imageBase64);

    // Save skin type to Supabase profile
    if (typeof state !== 'undefined' && state.authUser && typeof updateUserProfile === "function") {
      await updateUserProfile({ skin_type: responseData.noocaMaqaarka });
      state.user.skinType = responseData.noocaMaqaarka;
    }

  } catch (err) {
    showAISkinError(`Cilad ayaa ka dhacday Xiriirka AI-da: ${err.message}<br><small style="opacity:0.8; margin-top: 0.5rem; display: block;">Server-ka AI (Supabase Edge Function) laguma xiri karin. Fadlan xaqiiji intarnetkaaga ama server-ka AI mar kale isku day.</small>`);
  }
}

// 
// DISPLAY RESULTS (UI/UX OPTIMIZED)
// 
function displaySkinAnalysisResults(data, imageBase64) {
  const scores = data.astaamaha || { finan: 0, dufan: 0, qoyaan: 5, xasaasiyad: 0 };

  const skinTypeColors = {
    "Maqaar Dufanka leh": { bg: "#FFF3E0", text: "#E65100", badge: "#FF6D00" },
    "Qallayl": { bg: "#E3F2FD", text: "#1565C0", badge: "#1976D2" },
    "Isku Dhafan": { bg: "#F3E5F5", text: "#6A1B9A", badge: "#8E24AA" },
    "Caadi": { bg: "#E8F5E9", text: "#1B5E20", badge: "#2E7D32" },
    "Xasaasiyad": { bg: "#FCE4EC", text: "#880E4F", badge: "#C2185B" },
    "Ma cadda": { bg: "#F5F5F5", text: "#616161", badge: "#757575" },
  };
  const colors = skinTypeColors[data.noocaMaqaarka] || skinTypeColors["Ma cadda"];

  const scoreBar = (iconClass, label, score, color) => {
    const pct = Math.min(100, (score / 10) * 100);
    const level = score <= 3 ? "Hooseeya" : score <= 6 ? "Dhexdhexaad" : "Sare";
    return `
      <div style="margin-bottom: 1.1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <i class="${iconClass}" style="color: ${color}; width: 18px; text-align: center;"></i> ${label}
          </span>
          <span style="font-size: 0.82rem; font-weight: 700; color: ${color}; background: ${color}12; padding: 2px 10px; border-radius: 12px;">${score}/10 &bull; ${level}</span>
        </div>
        <div style="background: var(--bg-tertiary); border-radius: 10px; height: 12px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);">
          <div style="width: ${pct}%; background: linear-gradient(90deg, ${color}AA, ${color}); height: 100%; border-radius: 10px; transition: width 1.2s ease;"></div>
        </div>
      </div>
    `;
  };

  const thumbSrc = imageBase64
    ? `data:image/jpeg;base64,${imageBase64}`
    : null;

  // Calculate overall skin health score (0-100)
  const healthScore = Math.round(
    Math.max(0, Math.min(100,
      ((10 - scores.finan) * 2.5) +   
      ((10 - scores.dufan) * 2) +       
      (scores.qoyaan * 3) +             
      ((10 - scores.xasaasiyad) * 2.5)  
    ))
  );
  const healthColor = healthScore >= 75 ? '#2E7D32' : healthScore >= 50 ? '#FB8C00' : '#E53935';
  const healthLabel = healthScore >= 75 ? 'Wanaagsan' : healthScore >= 50 ? 'Dhexdhexaad' : 'U Baahan Daryeel';

  document.getElementById("ai-skin-result").innerHTML = `
    <div style="animation: fadeIn 0.5s ease;">

      <!-- MAIN RESULTS HEADER CARD -->
      <div style="background: linear-gradient(135deg, var(--bg-card) 0%, rgba(197,160,89,0.06) 100%); border: 2px solid var(--gold-primary); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
          ${thumbSrc ? `<img src="${thumbSrc}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold-primary); box-shadow: 0 6px 20px rgba(197,160,89,0.35);">` : `<div style="width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-primary), var(--emerald-dark)); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(13,40,24,0.3);"><i class="fa-solid fa-robot" style="font-size: 2.2rem; color: #FFF;"></i></div>`}
          <div style="flex: 1; min-width: 240px;">
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold-primary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Natiijooyinka AI - Erav Skin Scan
            </div>
            <h3 class="font-serif" style="font-size: 1.85rem; margin-bottom: 0.5rem; color: var(--emerald-dark);">Nooca Maqaarkaaga</h3>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              <span style="background: ${colors.badge}; color: #FFF; padding: 6px 16px; border-radius: 20px; font-size: 0.92rem; font-weight: 700; letter-spacing: 0.02em; box-shadow: 0 2px 8px ${colors.badge}40;">${data.noocaMaqaarka}</span>
              <span style="background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 5px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Darajo: ${data.darajo || "Dhexdhexaad"}</span>
            </div>
          </div>
          <!-- Overall Health Score Circle -->
          <div style="text-align: center; flex-shrink: 0; background: var(--bg-card); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="width: 84px; height: 84px; border-radius: 50%; border: 4px solid ${healthColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${healthColor}0D; margin: 0 auto;">
              <span style="font-size: 1.7rem; font-weight: 800; color: ${healthColor}; line-height: 1;">${healthScore}</span>
              <span style="font-size: 0.62rem; font-weight: 700; color: ${healthColor}; text-transform: uppercase; letter-spacing: 0.05em;">/100</span>
            </div>
            <span style="font-size: 0.75rem; font-weight: 800; color: ${healthColor}; margin-top: 6px; display: block;">${healthLabel}</span>
          </div>
        </div>
        ${data.sharaxaad ? `
          <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
            <i class="fa-solid fa-quote-left" style="color: var(--gold-primary); margin-right: 0.5rem; opacity: 0.7;"></i> ${data.sharaxaad}
          </div>
        ` : ''}
      </div>

      <!-- SCORE BARS CARD -->
      <div style="background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 1.35rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-chart-simple" style="color: var(--gold-primary);"></i> Astaamaha & Cabbirrada Maqaarkaaga
        </h4>
        ${scoreBar("fa-solid fa-circle-dot", "Finan (Acne)", scores.finan, "#E53935")}
        ${scoreBar("fa-solid fa-droplet", "Dufan (Oiliness)", scores.dufan, "#FB8C00")}
        ${scoreBar("fa-solid fa-water", "Qoyaan (Hydration)", scores.qoyaan, "#1E88E5")}
        ${scoreBar("fa-solid fa-heart-pulse", "Xasaasiyad (Sensitivity)", scores.xasaasiyad, "#8E24AA")}
      </div>

      <!-- WIDE CARD 1: ISSUES DETECTED (BAD SIDE / WAXA LA OGAADAY) -->
      <div style="background: linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%); border: 1.5px solid #FCA5A5; border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 4px 16px rgba(220,38,38,0.06);">
        <h4 style="font-size: 1.1rem; color: #DC2626; margin-bottom: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.6rem;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.25rem;"></i> Waxa La Ogaaday (Ciladaha & Qaybaha U Baahan Daryeelka)
        </h4>
        <div style="display: grid; gap: 0.75rem;">
          ${(data.dhibaatooyinka || ["Wax gaar ah la ogaan waayo"]).map((d) => `
            <div style="display: flex; align-items: flex-start; gap: 0.85rem; background: #FFFFFF; border: 1px solid #FEE2E2; padding: 0.9rem 1.15rem; border-radius: var(--radius-md); box-shadow: 0 2px 6px rgba(220,38,38,0.04);">
              <i class="fa-solid fa-circle-exclamation" style="color: #EF4444; font-size: 1.05rem; margin-top: 2px; flex-shrink: 0;"></i>
              <span style="font-size: 0.92rem; color: #7F1D1D; font-weight: 600; line-height: 1.5;">${d}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- WIDE CARD 2: BENEFICIAL INGREDIENTS (GOOD SIDE / QANJIYADAHA FIICAN) -->
      <div style="background: linear-gradient(135deg, #F0FDF4 0%, #FFFBEB 100%); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: 0 4px 16px rgba(13,40,24,0.06);">
        <h4 style="font-size: 1.1rem; color: var(--emerald-dark); margin-bottom: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.6rem;">
          <i class="fa-solid fa-vial-circle-check" style="font-size: 1.25rem; color: var(--gold-primary);"></i> Qanjiyadaha & Maaddooyinka Fiican ee Maqaarkaaga
        </h4>
        <div style="display: grid; gap: 0.85rem;">
          ${(data.qanjiyadaLaGaliyaa || []).map((q) => {
            const name = q.split(" - ")[0];
            const desc = q.includes(" - ") ? q.split(" - ")[1] : "";
            return `
              <div style="background: #FFFFFF; border: 1px solid rgba(197,160,89,0.35); padding: 1rem 1.25rem; border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(13,40,24,0.04);">
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; flex-wrap: wrap;">
                  <span style="background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark)); color: #121212; padding: 4px 12px; border-radius: 14px; font-size: 0.85rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 6px rgba(197,160,89,0.25);">
                    <i class="fa-solid fa-check" style="font-size: 0.75rem;"></i> ${name}
                  </span>
                </div>
                ${desc ? `<p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.6; font-weight: 500;">${desc}</p>` : ''}
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- SOMALI TIPS CARD -->
      ${data.talooyinkaSomaalida?.length ? `
      <div style="background: linear-gradient(135deg, rgba(13,40,24,0.05) 0%, rgba(197,160,89,0.1) 100%); border: 1.5px solid var(--emerald-light); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.6rem;">
          <i class="fa-solid fa-lightbulb" style="color: var(--gold-primary);"></i> Talooyinka Erav Ku Saabsan Maqaarkaaga
        </h4>
        <div style="display: grid; gap: 0.75rem;">
          ${data.talooyinkaSomaalida.map((t, i) => `
            <div style="display: flex; gap: 0.85rem; align-items: flex-start; background: #FFFFFF; padding: 0.9rem 1.15rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
              <span style="background: var(--emerald-dark); color: #FAF0CA; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 1px;">${i + 1}</span>
              <span style="font-size: 0.92rem; line-height: 1.6; color: var(--text-primary); font-weight: 500;">${t}</span>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!-- CREAMS TO LOOK FOR -->
      ${data.kiriimadaLaGaliyaa?.length ? `
      <div style="background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-pump-soap" style="color: var(--gold-primary);"></i> Kiriimadaha & Alaabta La Doorbidi Lahaa
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
          ${data.kiriimadaLaGaliyaa.map((k) => `<span style="background: var(--gold-light); border: 1px solid var(--gold-primary); color: var(--emerald-dark); padding: 7px 16px; border-radius: 20px; font-size: 0.88rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem;"><i class="fa-solid fa-check" style="font-size: 0.75rem; color: var(--gold-primary);"></i> ${k}</span>`).join("")}
        </div>
      </div>
      ` : ""}

      <!-- ROUTINES (SUBAXDA & HABEENKA) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
        <div style="background: linear-gradient(180deg, #FFFBEB 0%, var(--bg-card) 100%); border: 1.5px solid #FDE68A; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 1.05rem; margin-bottom: 1.15rem; font-weight: 700; color: #92400E; display: flex; align-items: center; gap: 0.6rem;">
            <i class="fa-solid fa-sun" style="color: #F59E0B; font-size: 1.2rem;"></i> Jadwalka Subaxda
          </h4>
          <ol style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; line-height: 2.1; color: var(--text-primary); font-weight: 500;">
            ${(data.jadwalkaSubaxda || []).map((s) => `<li>${s}</li>`).join("")}
          </ol>
        </div>
        <div style="background: linear-gradient(180deg, #EDE9FE 0%, var(--bg-card) 100%); border: 1.5px solid #C4B5FD; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 1.05rem; margin-bottom: 1.15rem; font-weight: 700; color: #4C1D95; display: flex; align-items: center; gap: 0.6rem;">
            <i class="fa-solid fa-moon" style="color: #7C3AED; font-size: 1.2rem;"></i> Jadwalka Habeenka
          </h4>
          <ol style="margin: 0; padding-left: 1.2rem; font-size: 0.9rem; line-height: 2.1; color: var(--text-primary); font-weight: 500;">
            ${(data.jadwalkaHabeenka || []).map((s) => `<li>${s}</li>`).join("")}
          </ol>
        </div>
      </div>

      <!-- PRODUCT RECOMMENDATIONS BANNER -->
      <div style="background: linear-gradient(135deg, var(--emerald-dark) 0%, #1E5B3A 100%); padding: 1.75rem; border-radius: var(--radius-lg); color: #FAF8F5; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; box-shadow: var(--shadow-md);">
        <div style="flex: 1; min-width: 250px;">
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-primary); margin-bottom: 0.4rem; font-weight: 800;">Alaabta Erav</div>
          <h4 style="font-size: 1.25rem; margin-bottom: 0.4rem; font-family: var(--font-serif);">
            <i class="fa-solid fa-bag-shopping" style="color: var(--gold-primary);"></i> Alaabta Kuu Habboon
          </h4>
          <p style="font-size: 0.9rem; opacity: 0.9; margin: 0; line-height: 1.6;">AI-du waxay u doortay alaab ku habboon <strong>${data.noocaMaqaarka}</strong>. Dukaankayaga ka fiiri alaabta ugu habboon maqaarkaaga.</p>
        </div>
        <button class="btn btn-gold" onclick="filterShopCategory('daryeelka-maqaarka'); navigateTo('shop');" style="white-space: nowrap; font-size: 0.95rem; padding: 0.85rem 1.5rem;">
          <i class="fa-solid fa-store"></i> Eeg Dukaanka
        </button>
      </div>

      <!-- DISCLAIMER -->
      <p style="font-size: 0.82rem; color: var(--text-muted); text-align: center; padding-top: 1rem; border-top: 1px dashed var(--border-color); line-height: 1.6;">
        <i class="fa-solid fa-shield-halved" style="color: var(--gold-primary);"></i>
        <strong>Ogeysiis:</strong> ${data.faallo || "Talooyinkan waxaa loogu talagalay macluumaadka guud oo keliya."} Ma aha talo dhakhtar rasmi ah.
      </p>

      <!-- Retake button -->
      <div style="text-align: center; margin-top: 1.75rem;">
        <button class="btn btn-outline" onclick="document.getElementById('ai-skin-result').style.display='none'; switchScanTab('camera');" style="padding: 0.85rem 1.75rem;">
          <i class="fa-solid fa-rotate-left"></i> Dib u Baro Sawirka
        </button>
      </div>
    </div>
  `;
}

// 
// ERROR DISPLAY
// 
function showAISkinError(message) {
  const resultDiv = document.getElementById("ai-skin-result");
  if (!resultDiv) return;
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 2rem; background: var(--bg-card); border: 1.5px solid #fca5a5; border-radius: var(--radius-lg);">
      <i class="fa-solid fa-circle-exclamation" style="font-size: 2.5rem; color: #dc2626; margin-bottom: 1rem;"></i>
      <p style="font-weight: 600; margin-bottom: 0.5rem;">${message}</p>
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('ai-skin-result').style.display='none'; resetImageUpload();" style="margin-top: 1rem;">
        <i class="fa-solid fa-rotate-left"></i> Dib u Isku Day
      </button>
    </div>
  `;
}

// 
// AUTHENTICATION REQUIRED PROMPT (Email & Password Required for Image Scan)
// 
function showAuthRequiredPrompt(message) {
  const resultDiv = document.getElementById("ai-skin-result");
  if (!resultDiv) return;
  resultDiv.style.display = "block";
  resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 2.5rem 1.5rem; background: var(--bg-card); border: 2px solid var(--gold-primary); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); animation: fadeIn 0.4s ease;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-primary), var(--emerald-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 6px 20px rgba(197,160,89,0.35);">
        <i class="fa-solid fa-lock" style="font-size: 2.2rem; color: #FFF;"></i>
      </div>
      <h3 class="font-serif" style="font-size: 1.6rem; color: var(--emerald-dark); margin-bottom: 0.6rem;">Galitaanka Koontada Waa Muhiim</h3>
      <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 520px; margin: 0 auto 1.75rem; line-height: 1.6;">
        ${message || 'Fadlan geli emailkaaga iyo furaha sirta ah (Gal koontada ama Isdiiwaangeli) si AI-du ay u falanqeyso sawirkaaga uuna ugu kaydsamo koontadaada.'}
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-gold" onclick="navigateTo('auth'); switchAuthTab('login');" style="padding: 0.85rem 1.75rem; font-size: 0.95rem;">
          <i class="fa-solid fa-right-to-bracket"></i> Gal Koontada (Login)
        </button>
        <button class="btn btn-primary" onclick="navigateTo('auth'); switchAuthTab('signup');" style="padding: 0.85rem 1.75rem; font-size: 0.95rem;">
          <i class="fa-solid fa-user-plus"></i> Isdiiwaangeli (Sign Up)
        </button>
      </div>
    </div>
  `;
}



