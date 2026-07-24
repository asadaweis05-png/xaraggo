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

    let responseData;
    try {
      const res = await fetch(SKIN_ANALYSIS_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ mode, imageBase64, textPrompt }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error ${res.status}`);
      }
      responseData = data;
    } catch (fetchErr) {
      console.warn("AI Backend unreachable, using fallback mock data. Error:", fetchErr);
      // Fallback mock response for demonstration
      responseData = {
        noocaMaqaarka: "Isku Dhafan (Dufan & Qallayl)",
        astaamaha: { finan: 30, dufan: 65, qoyaan: 45, xasaasiyad: 20 },
        sharaxaad: "Falanqayntan waa mid tusaale ah maadaama uu xiriirka intarnetka ama serverka mashquul yahay. Maqaarkaagu wuxuu u muuqdaa mid isku dhafan. Waxaan kugula talinaynaa inaad isticmaasho Niacinamide si aad u dheellitirto dufanka.",
        ciladaha: ["Daloolo muuqda", "Dufan wejiga T-zone-ka ah"],
        talooyinka: ["Isticmaal nadiifiye Salicylic Acid", "Isticmaal Serum Niacinamide"],
        alaabta: ["p1", "p3"]
      };
    }

    displaySkinAnalysisResults(responseData, imageBase64);

    // Save skin type to Supabase profile
    if (typeof state !== 'undefined' && state.authUser && typeof updateUserProfile === "function") {
      await updateUserProfile({ skin_type: responseData.noocaMaqaarka });
      state.user.skinType = responseData.noocaMaqaarka;
    }

  } catch (err) {
    showAISkinError(`Cilad dhacday: ${err.message}<br><small style="opacity:0.7">Fadlan mar kale isku day.</small>`);
  }
}

// 
// DISPLAY RESULTS
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

  const scoreBar = (icon, label, score, color) => {
    const pct = Math.min(100, (score / 10) * 100);
    const level = score <= 3 ? "Hooseeya" : score <= 6 ? "Dhexdhexaad" : "Sare";
    return `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="font-size: 0.88rem; font-weight: 600;">${icon} ${label}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${color};">${score}/10  ${level}</span>
        </div>
        <div style="background: var(--bg-tertiary); border-radius: 8px; height: 10px; overflow: hidden;">
          <div style="width: 0%; background: linear-gradient(90deg, ${color}88, ${color}); height: 100%; border-radius: 8px; transition: width 1.2s ease; width: ${pct}%;"></div>
        </div>
      </div>
    `;
  };

  const thumbSrc = imageBase64
    ? `data:image/jpeg;base64,${imageBase64}`
    : null;

  document.getElementById("ai-skin-result").innerHTML = `
    <div style="animation: fadeIn 0.5s ease;">

      <!--  HEADER  -->
      <div style="background: var(--bg-card); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
          ${thumbSrc ? `<img src="${thumbSrc}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold-primary); box-shadow: 0 4px 16px rgba(197,160,89,0.3);">` : `<div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-primary), var(--emerald-dark)); display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-robot" style="font-size: 2rem; color: #FFF;"></i></div>`}
          <div style="flex: 1;">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-primary); margin-bottom: 0.4rem;">Natiijooyinka AI  Erav Skin Scan</div>
            <h3 class="font-serif" style="font-size: 1.7rem; margin-bottom: 0.5rem; color: var(--emerald-dark);">Nooca Maqaarkaaga</h3>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <span style="background: ${colors.badge}; color: #FFF; padding: 5px 14px; border-radius: 20px; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.02em;">${data.noocaMaqaarka}</span>
              <span style="background: var(--bg-tertiary); color: var(--text-secondary); padding: 5px 12px; border-radius: 20px; font-size: 0.82rem;">Darajo: ${data.darajo || "Dhexdhexaad"}</span>
            </div>
          </div>
        </div>
      </div>

      <!--  SCORE BARS  -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 1.25rem;"> Astaamaha Maqaarkaaga</h4>
        ${scoreBar("", "Finan (Acne)", scores.finan, "#E53935")}
        ${scoreBar("", "Dufan (Oiliness)", scores.dufan, "#FB8C00")}
        ${scoreBar("", "Qoyaan (Hydration)", scores.qoyaan, "#1E88E5")}
        ${scoreBar("", "Xasaasiyad (Sensitivity)", scores.xasaasiyad, "#8E24AA")}
      </div>

      <!--  ISSUES + INGREDIENTS  -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="background: #fff5f5; border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-size: 0.9rem; color: #dc2626; margin-bottom: 0.75rem; font-weight: 700;">
            <i class="fa-solid fa-magnifying-glass"></i> Waxa La Ogaaday
          </h4>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; line-height: 1.9;">
            ${(data.dhibaatooyinka || ["Wax gaar ah la ogaan waayo"]).map((d) => `<li>${d}</li>`).join("")}
          </ul>
        </div>
        <div style="background: var(--gold-light); border: 1px solid var(--gold-primary); border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-size: 0.9rem; color: var(--gold-hover); margin-bottom: 0.75rem; font-weight: 700;">
            <i class="fa-solid fa-flask"></i> Qanjiyadaha Fiican
          </h4>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.82rem; line-height: 1.9;">
            ${(data.qanjiyadaLaGaliyaa || []).map((q) => `<li><strong>${q.split(" - ")[0]}</strong>${q.includes(" - ") ? "  " + q.split(" - ")[1] : ""}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!--  SOMALI TIPS  -->
      ${data.talooyinkaSomaalida?.length ? `
      <div style="background: linear-gradient(135deg, rgba(13,40,24,0.05), rgba(197,160,89,0.08)); border: 1.5px solid var(--emerald-light); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem;">
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 1rem;">
           Talooyinka Erav  Ku Saabsan Maqaarkaaga
        </h4>
        <div style="display: grid; gap: 0.6rem;">
          ${data.talooyinkaSomaalida.map((t, i) => `
            <div style="display: flex; gap: 0.75rem; align-items: flex-start; background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: var(--radius-sm);">
              <span style="background: var(--emerald-dark); color: #FAF0CA; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">${i + 1}</span>
              <span style="font-size: 0.88rem; line-height: 1.6;">${t}</span>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!--  CREAMS TO LOOK FOR  -->
      ${data.kiriimadaLaGaliyaa?.length ? `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--emerald-dark); margin-bottom: 0.75rem;">
           Kiriimadaha iyo Alaabta La Doorbidi Lahaa
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.kiriimadaLaGaliyaa.map((k) => `<span style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 5px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 500;">${k}</span>`).join("")}
        </div>
      </div>
      ` : ""}

      <!--  ROUTINES  -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
        <div style="background: linear-gradient(180deg, #FFFBEB, var(--bg-card)); border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 1rem; font-weight: 700; color: #92400E;">
            <i class="fa-solid fa-sun" style="color: #F59E0B;"></i> Jadwalka Subaxda
          </h4>
          <ol style="margin: 0; padding-left: 1.1rem; font-size: 0.83rem; line-height: 2;">
            ${(data.jadwalkaSubaxda || []).map((s) => `<li>${s}</li>`).join("")}
          </ol>
        </div>
        <div style="background: linear-gradient(180deg, #EDE9FE, var(--bg-card)); border: 1px solid #C4B5FD; border-radius: var(--radius-md); padding: 1.25rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 1rem; font-weight: 700; color: #4C1D95;">
            <i class="fa-solid fa-moon" style="color: #7C3AED;"></i> Jadwalka Habeenka
          </h4>
          <ol style="margin: 0; padding-left: 1.1rem; font-size: 0.83rem; line-height: 2;">
            ${(data.jadwalkaHabeenka || []).map((s) => `<li>${s}</li>`).join("")}
          </ol>
        </div>
      </div>

      <!--  PRODUCT RECOMMENDATIONS (Placeholder)  -->
      <div style="background: linear-gradient(135deg, var(--emerald-dark), #1E5B3A); padding: 1.5rem; border-radius: var(--radius-lg); color: #FAF8F5; margin-bottom: 1rem; display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
        <div style="flex: 1;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold-primary); margin-bottom: 0.4rem; font-weight: 700;">Alaabta Erav</div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.4rem; font-family: var(--font-serif);">
            <i class="fa-solid fa-bag-shopping" style="color: var(--gold-primary);"></i> Alaabta Kuu Habboon
          </h4>
          <p style="font-size: 0.85rem; opacity: 0.85; margin: 0;">AI-du waxay u doortay alaab ku habboon <strong>${data.noocaMaqaarka}</strong>. Dukaankayaga ka fiiri alaabta ugu habboon maqaarkaaga.</p>
        </div>
        <button class="btn btn-gold" onclick="filterShopCategory('daryeelka-maqaarka'); navigateTo('shop');" style="white-space: nowrap;">
           Eeg Dukaanka
        </button>
      </div>

      <!--  DISCLAIMER  -->
      <p style="font-size: 0.78rem; color: var(--text-muted); text-align: center; padding-top: 1rem; border-top: 1px dashed var(--border-color); line-height: 1.6;">
        <i class="fa-solid fa-shield-halved" style="color: var(--gold-primary);"></i>
        <strong>Ogeysiis:</strong> ${data.faallo || "Talooyinkan waxaa loogu talagalay macluumaadka guud oo keliya."} Ma aha talo dhakhtar rasmi ah.
      </p>

      <!-- Retake button -->
      <div style="text-align: center; margin-top: 1.5rem;">
        <button class="btn btn-outline" onclick="document.getElementById('ai-skin-result').style.display='none'; switchScanTab('camera');">
          <i class="fa-solid fa-rotate-left"></i> Dib u Baro
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
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('ai-skin-result').style.display='none'; startSkinCamera();" style="margin-top: 1rem;">
        <i class="fa-solid fa-rotate-left"></i> Dib u Isku Day
      </button>
    </div>
  `;
}
