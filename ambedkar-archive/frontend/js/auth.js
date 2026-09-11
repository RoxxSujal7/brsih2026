/**
 * auth.js — Comprehensive Authentication Manager
 * Features:
 * 1. Google Sign-In (Real Google Identity Services SDK + Fallback picker)
 * 2. Mobile Number Login with 6-Digit SMS OTP
 * 3. Gmail / Email Login with 6-Digit OTP
 * 4. Classic Password Login (Accepts Email or Mobile Number)
 * 5. Registration with Optional Phone Verification
 */

// Global callback for Google Identity Services
window.handleGoogleCredentialResponse = async function (response) {
  if (!response || !response.credential) {
    console.error('No Google credential returned in response', response);
    return;
  }
  await submitGoogleCredential(response.credential);
};

document.addEventListener('DOMContentLoaded', () => {
  // ── Redirect if already authenticated ─────────
  if (window.AppState && AppState.isLoggedIn()) {
    if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
      window.location.href = 'dashboard.html';
      return;
    }
  }

  // ── Initialize Components ─────────────────────
  initAuthTabs();
  initPasswordLogin();
  initPhoneOtpLogin();
  initEmailOtpLogin();
  initRegistration();
  initGoogleAuth();
});

/* ═══════════════════════════════════════════════════
   1. SEGMENTED AUTH TABS SWITCHER
   ═══════════════════════════════════════════════════ */
function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab-btn');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      const panels = document.querySelectorAll('.auth-panel');
      panels.forEach((p) => {
        p.style.display = 'none';
        p.classList.remove('active');
      });

      const activePanel = document.getElementById(`auth-panel-${targetTab}`);
      if (activePanel) {
        activePanel.style.display = 'block';
        activePanel.classList.add('active');
      }

      // Clear any previous error banner
      const errBanner = document.getElementById('login-error');
      if (errBanner) errBanner.classList.remove('show');
    });
  });
}

/* ═══════════════════════════════════════════════════
   2. PASSWORD LOGIN (EMAIL OR MOBILE)
   ═══════════════════════════════════════════════════ */
function initPasswordLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  initPasswordToggle('password', 'toggle-password');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const errBanner = document.getElementById('login-error');
    const errText = document.getElementById('login-error-text') || errBanner;
    const identifier = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;

    if (!identifier || !password) {
      if (errBanner) {
        errText.textContent = 'Please enter your email or phone number and password.';
        errBanner.classList.add('show');
      }
      return;
    }

    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="spinner spinner-sm"></span> Signing in…';
    if (errBanner) errBanner.classList.remove('show');

    try {
      const res = await api.auth.login({ email: identifier, password });
      onAuthSuccess(res, 'Signed in successfully! 👋');
    } catch (err) {
      if (errBanner) {
        errText.textContent = err.message || 'Invalid email/phone or password.';
        errBanner.classList.add('show');
      }
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  });
}

/* ═══════════════════════════════════════════════════
   3. MOBILE NUMBER + OTP LOGIN
   ═══════════════════════════════════════════════════ */
function initPhoneOtpLogin() {
  const form = document.getElementById('phone-otp-form');
  if (!form) return;

  const phoneInput = document.getElementById('phone-number');
  const sendBtn = document.getElementById('send-phone-otp-btn');
  const otpBox = document.getElementById('phone-otp-box');
  const otpInput = document.getElementById('phone-otp-code');
  const verifyBtn = document.getElementById('verify-phone-otp-btn');
  const statusWrap = document.getElementById('phone-otp-status');
  const statusMsg = document.getElementById('phone-otp-status-msg');
  const timerText = document.getElementById('phone-otp-timer');
  const chipContainer = document.getElementById('phone-demo-chip');
  const errBanner = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text') || errBanner;

  // Auto-format numbers only
  phoneInput?.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  });

  // Send OTP
  sendBtn?.addEventListener('click', async () => {
    const rawNum = phoneInput.value.trim();
    if (rawNum.length < 10) {
      if (errBanner) {
        errText.textContent = 'Please enter a valid 10-digit mobile number.';
        errBanner.classList.add('show');
      }
      phoneInput.focus();
      return;
    }
    if (errBanner) errBanner.classList.remove('show');

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    try {
      const fullTarget = '+91' + rawNum;
      const res = await api.auth.sendOtp({ target: fullTarget, type: 'phone' });

      // Reveal OTP inputs
      otpBox.style.display = 'block';
      verifyBtn.disabled = false;
      statusWrap.style.display = 'flex';
      statusMsg.textContent = `OTP code dispatched to ${fullTarget}.`;

      // Show dev demo quick-fill chip if code received
      if (res.demoCode && chipContainer) {
        chipContainer.style.display = 'block';
        chipContainer.innerHTML = `
          <button type="button" class="otp-chip-badge" id="phone-quick-fill-btn">
            ⚡ Quick-fill received OTP: <strong>${res.demoCode}</strong>
          </button>
        `;
        document.getElementById('phone-quick-fill-btn')?.addEventListener('click', () => {
          otpInput.value = res.demoCode;
          verifyBtn.focus();
        });
      }

      if (window.AppState && AppState.showToast) {
        AppState.showToast(`OTP dispatched! Check console or mobile.`, 'info');
      }

      startCountdown(sendBtn, timerText, 60);
      otpInput.focus();
    } catch (err) {
      if (errBanner) {
        errText.textContent = err.message || 'Failed to dispatch OTP.';
        errBanner.classList.add('show');
      }
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send OTP';
    }
  });

  // Verify OTP
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawNum = phoneInput.value.trim();
    const otp = otpInput.value.trim();

    if (!otp || otp.length < 4) {
      if (errBanner) {
        errText.textContent = 'Please enter the 6-digit verification code.';
        errBanner.classList.add('show');
      }
      otpInput.focus();
      return;
    }

    verifyBtn.disabled = true;
    const origHtml = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<span class="spinner spinner-sm"></span> Verifying OTP…';
    if (errBanner) errBanner.classList.remove('show');

    try {
      const res = await api.auth.verifyOtp({
        target: '+91' + rawNum,
        otp,
        type: 'phone',
      });
      onAuthSuccess(res, 'Phone verified! Welcome 🎉');
    } catch (err) {
      if (errBanner) {
        errText.textContent = err.message || 'Invalid or expired OTP code.';
        errBanner.classList.add('show');
      }
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = origHtml;
    }
  });
}

/* ═══════════════════════════════════════════════════
   4. GMAIL / EMAIL + OTP LOGIN
   ═══════════════════════════════════════════════════ */
function initEmailOtpLogin() {
  const form = document.getElementById('email-otp-form');
  if (!form) return;

  const emailInput = document.getElementById('email-otp-target');
  const sendBtn = document.getElementById('send-email-otp-btn');
  const otpBox = document.getElementById('email-otp-box');
  const otpInput = document.getElementById('email-otp-code');
  const verifyBtn = document.getElementById('verify-email-otp-btn');
  const statusWrap = document.getElementById('email-otp-status');
  const statusMsg = document.getElementById('email-otp-status-msg');
  const timerText = document.getElementById('email-otp-timer');
  const chipContainer = document.getElementById('email-demo-chip');
  const errBanner = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text') || errBanner;

  // Send Email OTP
  sendBtn?.addEventListener('click', async () => {
    const email = emailInput.value.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      if (errBanner) {
        errText.textContent = 'Please enter a valid Gmail / Email address.';
        errBanner.classList.add('show');
      }
      emailInput.focus();
      return;
    }
    if (errBanner) errBanner.classList.remove('show');

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    try {
      const res = await api.auth.sendOtp({ target: email, type: 'email' });

      // Reveal OTP inputs
      otpBox.style.display = 'block';
      verifyBtn.disabled = false;
      statusWrap.style.display = 'flex';
      statusMsg.textContent = `OTP code dispatched to ${email}.`;

      // Show dev demo quick-fill chip
      if (res.demoCode && chipContainer) {
        chipContainer.style.display = 'block';
        chipContainer.innerHTML = `
          <button type="button" class="otp-chip-badge" id="email-quick-fill-btn">
            ⚡ Quick-fill received OTP: <strong>${res.demoCode}</strong>
          </button>
        `;
        document.getElementById('email-quick-fill-btn')?.addEventListener('click', () => {
          otpInput.value = res.demoCode;
          verifyBtn.focus();
        });
      }

      if (window.AppState && AppState.showToast) {
        AppState.showToast(`Verification code dispatched to ${email}!`, 'info');
      }

      startCountdown(sendBtn, timerText, 60);
      otpInput.focus();
    } catch (err) {
      if (errBanner) {
        errText.textContent = err.message || 'Failed to dispatch email OTP.';
        errBanner.classList.add('show');
      }
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send OTP';
    }
  });

  // Verify Email OTP
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const otp = otpInput.value.trim();

    if (!otp || otp.length < 4) {
      if (errBanner) {
        errText.textContent = 'Please enter the 6-digit verification code.';
        errBanner.classList.add('show');
      }
      otpInput.focus();
      return;
    }

    verifyBtn.disabled = true;
    const origHtml = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<span class="spinner spinner-sm"></span> Verifying OTP…';
    if (errBanner) errBanner.classList.remove('show');

    try {
      const res = await api.auth.verifyOtp({
        target: email,
        otp,
        type: 'email',
      });
      onAuthSuccess(res, 'Email verified! Welcome 🎉');
    } catch (err) {
      if (errBanner) {
        errText.textContent = err.message || 'Invalid or expired OTP code.';
        errBanner.classList.add('show');
      }
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = origHtml;
    }
  });
}

/* ═══════════════════════════════════════════════════
   5. REGISTRATION FLOW
   ═══════════════════════════════════════════════════ */
function initRegistration() {
  const form = document.getElementById('register-form');
  if (!form) return;

  initPasswordToggle('password', 'toggle-password');
  initPasswordToggle('confirm-password', 'toggle-confirm-password');

  // Role selection
  document.querySelectorAll('.role-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.role-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const errBanner = document.getElementById('register-error');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const rawPhone = form.querySelector('#register-phone')?.value.trim() || '';
    const phone = rawPhone ? (rawPhone.startsWith('+') ? rawPhone : '+91' + rawPhone) : '';
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirm-password').value;
    const language = form.querySelector('#language')?.value || 'en';
    const institution = form.querySelector('#institution')?.value?.trim() || '';
    const roleEl = form.querySelector('input[name="role"]:checked');
    const role = roleEl ? roleEl.value : 'visitor';

    if (errBanner) errBanner.classList.remove('show');

    if (password !== confirmPassword) {
      if (errBanner) {
        errBanner.textContent = 'Passwords do not match.';
        errBanner.classList.add('show');
      }
      return;
    }

    btn.disabled = true;
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="spinner spinner-sm"></span> Creating account…';

    try {
      const res = await api.auth.register({ name, email, phone, password, language, institution, role });
      onAuthSuccess(res, 'Account created! Welcome to the archive 🎉');
    } catch (err) {
      if (errBanner) {
        errBanner.textContent = err.message || 'Registration failed.';
        errBanner.classList.add('show');
      }
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  });
}

/* ═══════════════════════════════════════════════════
   6. REAL GOOGLE SIGN-IN & FALLBACK MODAL
   ═══════════════════════════════════════════════════ */
function initGoogleAuth() {
  const loginGoogleBtn = document.getElementById('google-login-btn');
  const registerGoogleBtn = document.getElementById('google-register-btn');
  const targetBtn = loginGoogleBtn || registerGoogleBtn;
  if (!targetBtn) return;

  // Initialize Google Identity Services if client library loaded
  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: '1088481439247-demoarchive.apps.googleusercontent.com',
        callback: window.handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const gsiContainer = document.getElementById('google-gsi-container');
      if (gsiContainer) {
        google.accounts.id.renderButton(gsiContainer, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'pill',
        });
      }
    } catch (e) {
      console.warn('Google Identity Services SDK note:', e);
    }
  }

  // Build Interactive Fallback Modal
  let modalOverlay = document.getElementById('google-auth-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'google-auth-modal';
    modalOverlay.className = 'google-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="google-modal-box" role="dialog" aria-labelledby="google-modal-title" aria-modal="true">
        <div class="google-modal-header">
          <button type="button" class="google-modal-close" id="close-google-modal" aria-label="Close">&times;</button>
          <svg class="google-icon" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" style="margin-bottom:8px;">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <h2 id="google-modal-title" style="font-family:var(--font-display);font-size:1.35rem;margin-bottom:4px;color:var(--text);">Sign in with Google</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);">Choose a verified account or enter your Gmail to continue</p>
        </div>

        <div class="google-account-list">
          <button type="button" class="google-account-item" data-email="dr.sujal.pawar@gmail.com" data-name="Dr. Sujal Pawar">
            <div class="google-avatar" style="background:#1a73e8;">SP</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:0.95rem;color:var(--text);">Dr. Sujal Pawar</div>
              <div style="font-size:0.8rem;color:var(--text-muted);">dr.sujal.pawar@gmail.com</div>
            </div>
            <span style="color:var(--gold-light);font-size:1.1rem;">→</span>
          </button>

          <button type="button" class="google-account-item" data-email="scholar.ambedkar@gmail.com" data-name="Babasaheb Archival Scholar">
            <div class="google-avatar" style="background:#ea4335;">BS</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:0.95rem;color:var(--text);">Babasaheb Archival Scholar</div>
              <div style="font-size:0.8rem;color:var(--text-muted);">scholar.ambedkar@gmail.com</div>
            </div>
            <span style="color:var(--gold-light);font-size:1.1rem;">→</span>
          </button>

          <button type="button" class="google-account-item" data-email="heritage.visitor@gmail.com" data-name="Heritage Archive Visitor">
            <div class="google-avatar" style="background:#34a853;">HV</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:0.95rem;color:var(--text);">Heritage Archive Visitor</div>
              <div style="font-size:0.8rem;color:var(--text-muted);">heritage.visitor@gmail.com</div>
            </div>
            <span style="color:var(--gold-light);font-size:1.1rem;">→</span>
          </button>
        </div>

        <div class="google-modal-custom">
          <form id="google-custom-form" style="display:flex;gap:8px;flex-direction:column;">
            <label for="google-custom-email" style="font-size:0.8rem;font-weight:600;color:var(--text-muted);">Or enter your Google / Gmail account:</label>
            <div style="display:flex;gap:8px;">
              <input id="google-custom-email" type="email" placeholder="you@gmail.com" class="input" style="flex:1;font-size:0.85rem;" required />
              <button type="submit" class="btn btn-primary btn-sm" style="border-radius:var(--radius-full);white-space:nowrap;">Continue →</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Modal close handling
    document.getElementById('close-google-modal')?.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Account select clicks
    modalOverlay.querySelectorAll('.google-account-item').forEach((item) => {
      item.addEventListener('click', () => {
        const email = item.getAttribute('data-email');
        const name = item.getAttribute('data-name');
        modalOverlay.classList.remove('active');
        submitGoogleProfile({ email, name });
      });
    });

    // Custom Gmail submission
    document.getElementById('google-custom-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('google-custom-email');
      const email = input.value.trim().toLowerCase();
      if (!email) return;
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      modalOverlay.classList.remove('active');
      submitGoogleProfile({ email, name });
    });
  }

  // Trigger Google prompt or modal
  [loginGoogleBtn, registerGoogleBtn].filter(Boolean).forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id && typeof google.accounts.id.prompt === 'function') {
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            modalOverlay.classList.add('active');
          }
        });
      } else {
        modalOverlay.classList.add('active');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   HELPER UTILITIES
   ═══════════════════════════════════════════════════ */
async function submitGoogleCredential(credential) {
  const banner = document.getElementById('login-error') || document.getElementById('register-error');
  if (banner) banner.classList.remove('show');

  if (window.AppState && AppState.showToast) {
    AppState.showToast('Connecting with Google…', 'info');
  }

  try {
    const res = await api.auth.googleLogin({ credential });
    onAuthSuccess(res, `Welcome, ${res.user.name.split(' ')[0]}! Signed in with Google 🎉`);
  } catch (err) {
    if (banner) {
      banner.textContent = err.message || 'Google sign-in failed.';
      banner.classList.add('show');
    }
  }
}

async function submitGoogleProfile({ email, name }) {
  const banner = document.getElementById('login-error') || document.getElementById('register-error');
  if (banner) banner.classList.remove('show');

  if (window.AppState && AppState.showToast) {
    AppState.showToast('Authenticating with Google account…', 'info');
  }

  try {
    const res = await api.auth.googleLogin({
      email,
      name,
      googleId: 'g_' + Math.random().toString(36).substring(2, 12),
      picture: '',
    });
    onAuthSuccess(res, `Welcome, ${res.user.name.split(' ')[0]}! Signed in with Google 🎉`);
  } catch (err) {
    if (banner) {
      banner.textContent = err.message || 'Google authentication failed.';
      banner.classList.add('show');
    }
  }
}

function onAuthSuccess(res, toastMsg) {
  if (window.AppState) {
    AppState.setAuthSession(res.token, res.user);
    if (AppState.showToast) {
      AppState.showToast(toastMsg, 'success');
    }
  } else {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
  }

  const redirect = sessionStorage.getItem('redirect_after_login');
  sessionStorage.removeItem('redirect_after_login');
  setTimeout(() => {
    window.location.href = redirect || 'dashboard.html';
  }, 750);
}

function startCountdown(buttonEl, textEl, seconds) {
  let remaining = seconds;
  buttonEl.disabled = true;
  textEl.textContent = `(Resend in ${remaining}s)`;

  const interval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(interval);
      buttonEl.disabled = false;
      buttonEl.textContent = 'Resend OTP';
      textEl.textContent = '';
    } else {
      textEl.textContent = `(Resend in ${remaining}s)`;
    }
  }, 1000);
}

function initPasswordToggle(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = show ? '🙈' : '👁';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
}
