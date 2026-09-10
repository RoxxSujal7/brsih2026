/**
 * auth.js — Login, Register, Logout logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Login Form ────────────────────────────────
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    // Redirect if already logged in
    if (AppState.isLoggedIn()) {
      window.location.href = 'dashboard.html';
      return;
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      const errorBanner = document.getElementById('login-error');
      const email = loginForm.querySelector('#email').value.trim();
      const password = loginForm.querySelector('#password').value;

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Signing in…';
      if (errorBanner) { errorBanner.classList.remove('show'); }

      try {
        const res = await api.auth.login({ email, password });
        AppState.setAuthSession(res.token, res.user);
        AppState.showToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`, 'success');

        // Redirect to saved destination or dashboard
        const redirect = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');
        setTimeout(() => {
          window.location.href = redirect || 'dashboard.html';
        }, 800);
      } catch (err) {
        if (errorBanner) {
          errorBanner.textContent = err.message || 'Login failed. Check your credentials.';
          errorBanner.classList.add('show');
        }
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
      }
    });

    // Password toggle
    initPasswordToggle('password', 'toggle-password');
  }

  // ── Register Form ─────────────────────────────
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    if (AppState.isLoggedIn()) {
      window.location.href = 'dashboard.html';
      return;
    }

    // Role selection
    document.querySelectorAll('.role-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = registerForm.querySelector('[type="submit"]');
      const errorBanner = document.getElementById('register-error');
      const name = registerForm.querySelector('#name').value.trim();
      const email = registerForm.querySelector('#email').value.trim();
      const password = registerForm.querySelector('#password').value;
      const confirmPassword = registerForm.querySelector('#confirm-password').value;
      const language = registerForm.querySelector('#language')?.value || 'en';
      const institution = registerForm.querySelector('#institution')?.value?.trim() || '';
      const roleEl = registerForm.querySelector('input[name="role"]:checked');
      const role = roleEl ? roleEl.value : 'visitor';

      if (errorBanner) errorBanner.classList.remove('show');

      // Client validation
      if (password !== confirmPassword) {
        if (errorBanner) { errorBanner.textContent = 'Passwords do not match.'; errorBanner.classList.add('show'); }
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Creating account…';

      try {
        const res = await api.auth.register({ name, email, password, language, institution, role });
        AppState.setAuthSession(res.token, res.user);
        AppState.showToast('Account created! Welcome to the archive 🎉', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
      } catch (err) {
        if (errorBanner) { errorBanner.textContent = err.message; errorBanner.classList.add('show'); }
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
      }
    });

    initPasswordToggle('password', 'toggle-password');
    initPasswordToggle('confirm-password', 'toggle-confirm-password');
  }

  // ── Google Sign-In Initialization ───────────────
  initGoogleAuth();
});

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

function initGoogleAuth() {
  const loginGoogleBtn = document.getElementById('google-login-btn');
  const registerGoogleBtn = document.getElementById('google-register-btn');
  const targetBtn = loginGoogleBtn || registerGoogleBtn;
  if (!targetBtn) return;

  // Create modal element if not already present
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
          <p style="font-size:0.85rem;color:var(--text-muted);">Choose an account to proceed to Ambedkar Digital Heritage Archive</p>
        </div>

        <div class="google-account-list">
          <button type="button" class="google-account-item" data-email="sujal.pawar@gmail.com" data-name="Dr. Sujal Pawar">
            <div class="google-avatar" style="background:#1a73e8;">SP</div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:0.95rem;color:var(--text);">Dr. Sujal Pawar</div>
              <div style="font-size:0.8rem;color:var(--text-muted);">sujal.pawar@gmail.com</div>
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
            <label for="google-custom-email" style="font-size:0.8rem;font-weight:600;color:var(--text-muted);">Or sign in with another Google Email:</label>
            <div style="display:flex;gap:8px;">
              <input id="google-custom-email" type="email" placeholder="yourname@gmail.com" class="input" style="flex:1;font-size:0.85rem;" required />
              <button type="submit" class="btn btn-primary btn-sm" style="border-radius:var(--radius-full);white-space:nowrap;">Continue →</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Modal close handling
    const closeBtn = document.getElementById('close-google-modal');
    closeBtn?.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Account select handling
    modalOverlay.querySelectorAll('.google-account-item').forEach((item) => {
      item.addEventListener('click', () => {
        const email = item.getAttribute('data-email');
        const name = item.getAttribute('data-name');
        executeGoogleAuth({ email, name });
      });
    });

    // Custom email form handling
    const customForm = document.getElementById('google-custom-form');
    customForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('google-custom-email');
      const email = input.value.trim();
      if (!email) return;
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      executeGoogleAuth({ email, name });
    });
  }

  // Bind click on Google buttons
  [loginGoogleBtn, registerGoogleBtn].filter(Boolean).forEach((btn) => {
    btn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  });

  async function executeGoogleAuth(profile) {
    modalOverlay.classList.remove('active');
    const banner = document.getElementById('login-error') || document.getElementById('register-error');
    if (banner) banner.classList.remove('show');

    if (window.AppState && AppState.showToast) {
      AppState.showToast('Connecting with Google…', 'info');
    }

    try {
      const res = await api.auth.googleLogin({
        email: profile.email,
        name: profile.name,
        googleId: 'g_' + Math.random().toString(36).substring(2, 12),
        picture: profile.picture || '',
      });

      AppState.setAuthSession(res.token, res.user);
      AppState.showToast(`Welcome, ${res.user.name.split(' ')[0]}! Signed in with Google 🎉`, 'success');

      const redirect = sessionStorage.getItem('redirect_after_login');
      sessionStorage.removeItem('redirect_after_login');
      setTimeout(() => {
        window.location.href = redirect || 'dashboard.html';
      }, 700);
    } catch (err) {
      if (banner) {
        banner.textContent = err.message || 'Google sign-in failed.';
        banner.classList.add('show');
      }
      if (window.AppState && AppState.showToast) {
        AppState.showToast(err.message || 'Google sign-in failed', 'error');
      }
    }
  }
}

