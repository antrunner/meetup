'use strict';

window.addEventListener('DOMContentLoaded', () => {

  const toast = document.getElementById('app-toast');

  async function showToast(msg, dur = 2800) {
    toast.message = msg;
    toast.duration = dur;
    await toast.present();
  }

  // ── System back button (⬅ in top bar) ─────
  document.getElementById('back-btn').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else showToast('Nothing to go back to in this demo');
  });

  // ── Save cart ──────────────────────────────
  document.getElementById('save-btn').addEventListener('click', () => {
    showToast('Cart saved — continue shopping anytime');
  });

  // ── Promo ───────────────────────────────────
  document.getElementById('promo-apply-btn').addEventListener('click', applyPromo);
  document.getElementById('promo-field').addEventListener('keydown', e => {
    if (e.key === 'Enter') applyPromo();
  });

  function applyPromo() {
    const field = document.getElementById('promo-field');
    const val = (field.value || '').trim().toUpperCase();
    if (val === 'ACME20') {
      document.getElementById('promo-input-list').classList.add('hidden');
      document.getElementById('promo-applied-list').classList.remove('hidden');
      document.getElementById('discount-row').classList.remove('hidden');
      document.getElementById('total-amount').textContent = '$150.29';
      showToast('Promo applied — you saved $12.62!');
    } else if (val) {
      showToast('Code not recognised. Try ACME20');
    }
  }

  document.getElementById('promo-remove-btn').addEventListener('click', () => {
    document.getElementById('promo-field').value = '';
    document.getElementById('promo-input-list').classList.remove('hidden');
    document.getElementById('promo-applied-list').classList.add('hidden');
    document.getElementById('discount-row').classList.add('hidden');
    document.getElementById('total-amount').textContent = '$162.91';
    showToast('Promo removed');
  });

  // ── Address ─────────────────────────────────
  document.getElementById('address-btn').addEventListener('click', () => {
    showToast('Address picker coming soon');
  });

  // ── Payment ─────────────────────────────────
  document.getElementById('pay-group').addEventListener('ionChange', e => {
    const labels = { visa: 'Visa ••4284', paypal: 'PayPal', gpay: 'Google Pay' };
    showToast((labels[e.detail.value] || e.detail.value) + ' selected');
  });

  // ── FAB — Place Order ────────────────────────
  document.getElementById('fab-order').addEventListener('click', () => {
    const total = document.getElementById('total-amount').textContent;
    showToast(`Order placed! ${total} charged. Thank you!`, 3500);
  });

  // ── Bottom navigation ────────────────────────
  ['shop', 'bag', 'orders', 'account'].forEach(name => {
    document.getElementById('tab-' + name).addEventListener('click', function () {
      document.querySelectorAll('ion-tab-button').forEach(b => b.classList.remove('tab-active'));
      this.classList.add('tab-active');
      if (name !== 'bag') showToast(name.charAt(0).toUpperCase() + name.slice(1) + ' — coming soon');
    });
  });

});
