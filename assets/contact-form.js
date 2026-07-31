/* Trexon — contact form submission.
   Posts to Formspree over fetch so the visitor stays on the page.
   The listener is delegated from `document` because support.js (the <x-dc>
   runtime) re-renders the form element, which would drop a direct binding. */
(function () {
  function panel(form, name) { return form.querySelector('[data-form-' + name + ']'); }

  // the panels default to display:none in responsive.css; data-show reveals
  // them. The runtime drops a bare `hidden` attribute, so don't rely on it.
  function toggle(el, on) {
    if (!el) return;
    if (on) el.setAttribute('data-show', '');
    else el.removeAttribute('data-show');
  }

  function show(form, state, message) {
    var ok = panel(form, 'success'), err = panel(form, 'error');
    toggle(ok, state === 'ok');
    toggle(err, state === 'error');
    if (state === 'error' && err && message) err.textContent = message;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.hasAttribute || !form.hasAttribute('data-formspree')) return;
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
    show(form, 'idle');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok) {
            form.reset();
            show(form, 'ok');
          } else {
            var msg = (data.errors || []).map(function (x) { return x.message; }).join(', ');
            show(form, 'error', msg || 'Your message could not be sent. Please email us instead.');
          }
        });
      })
      .catch(function () {
        show(form, 'error', 'Network error. Please check your connection and try again.');
      })
      .then(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
      });
  });
})();
