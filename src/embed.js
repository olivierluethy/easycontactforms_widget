// EasyContactForm vanilla-JS embed. Drop this into any HTML page alongside a
// <div data-easycontact="<your-token>"></div> and the form auto-mounts on load.
// No build step required — served directly to customer sites from a CDN.

(function () {
  'use strict';

  // Production backend for the hosted EasyContactForm service.
  var API_BASE = 'https://api.easycontactforms.com';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var STYLE_ID = 'ecf-embed-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      '.ecf-wrap{max-width:480px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2933;font-size:15px;line-height:1.5;box-sizing:border-box}' +
      '.ecf-wrap *{box-sizing:border-box}' +
      '.ecf-wrap label{display:block;margin-bottom:6px;font-weight:500;font-size:13px;color:#4b5563}' +
      '.ecf-wrap input,.ecf-wrap textarea{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:6px;font:inherit;background:#fff;color:#1f2933}' +
      '.ecf-wrap textarea{min-height:120px;resize:vertical}' +
      '.ecf-wrap .ecf-field{margin-bottom:14px}' +
      '.ecf-wrap button{padding:10px 18px;background:#2563eb;color:#fff;border:none;border-radius:6px;font:inherit;font-weight:500;cursor:pointer}' +
      '.ecf-wrap button:disabled{opacity:.7;cursor:not-allowed}' +
      '.ecf-err{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:10px 12px;border-radius:6px;margin-bottom:14px;font-size:14px}' +
      '.ecf-ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:14px 16px;border-radius:6px;font-size:15px}' +
      '.ecf-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}';
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === 'style') node.setAttribute('style', attrs[k]);
        else if (k in node) node[k] = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function mount(target, projectToken) {
    target.innerHTML = '';
    target.classList.add('ecf-wrap');

    var errBox  = el('div', { className: 'ecf-err', style: 'display:none' });

    var nameInput    = el('input',    { type: 'text', maxLength: 150, autocomplete: 'name' });
    var emailInput   = el('input',    { type: 'email', maxLength: 190, autocomplete: 'email' });
    var messageInput = el('textarea', { maxLength: 5000 });
    var honeypot     = el('input',    { type: 'text', tabIndex: -1, autocomplete: 'off' });

    var submitBtn = el('button', { type: 'submit' }, ['Send message']);

    var form = el('form', { noValidate: true }, [
      errBox,
      el('div', { className: 'ecf-field' }, [
        el('label', { htmlFor: 'ecf-name-' + projectToken }, ['Full name']),
        Object.assign(nameInput, { id: 'ecf-name-' + projectToken }),
      ]),
      el('div', { className: 'ecf-field' }, [
        el('label', { htmlFor: 'ecf-email-' + projectToken }, ['Email']),
        Object.assign(emailInput, { id: 'ecf-email-' + projectToken }),
      ]),
      el('div', { className: 'ecf-field' }, [
        el('label', { htmlFor: 'ecf-msg-' + projectToken }, ['Message']),
        Object.assign(messageInput, { id: 'ecf-msg-' + projectToken }),
      ]),
      el('div', { className: 'ecf-hp', 'aria-hidden': 'true' }, [
        el('label', null, ['Website', honeypot]),
      ]),
      submitBtn,
    ]);
    target.appendChild(form);

    function showError(msg) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
    }
    function clearError() {
      errBox.textContent = '';
      errBox.style.display = 'none';
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      clearError();

      var name = (nameInput.value || '').trim();
      var mail = (emailInput.value || '').trim();
      var msg  = (messageInput.value || '').trim();

      if (!name) return showError('Please enter your full name.');
      if (!EMAIL_RE.test(mail)) return showError('Please enter a valid email address.');
      if (!msg) return showError('Please enter a message.');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(API_BASE.replace(/\/$/, '') + '/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_token: projectToken,
          full_name: name,
          email: mail,
          message: msg,
          website: honeypot.value,
        }),
      })
        .then(function (r) { return r.json().catch(function () { return null; }); })
        .then(function (json) {
          if (!json || json.success !== true) {
            throw new Error((json && json.error) || 'Submission failed. Please try again.');
          }
          target.innerHTML = '';
          target.appendChild(el('div', { className: 'ecf-ok' }, ['✓ Thanks! Your message has been sent.']));
          target.dispatchEvent(new CustomEvent('easycontact:success', {
            bubbles: true,
            detail: { projectToken: projectToken, data: json.data },
          }));
        })
        .catch(function (e) {
          var msg = (e && e.message) || 'Submission failed. Please try again.';
          showError(msg);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
          target.dispatchEvent(new CustomEvent('easycontact:error', {
            bubbles: true,
            detail: { projectToken: projectToken, error: e, message: msg },
          }));
        });
    });
  }

  function mountAll() {
    injectStyles();
    var nodes = document.querySelectorAll('[data-easycontact]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.dataset.ecfMounted === '1') continue;
      var token = node.getAttribute('data-easycontact');
      if (!token) continue;
      node.dataset.ecfMounted = '1';
      mount(node, token);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }

  window.EasyContactForm = { mount: mountAll };
})();
