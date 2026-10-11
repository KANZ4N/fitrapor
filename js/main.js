document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openDrawerBtn');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawerPanel = document.getElementById('drawerPanel');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (openBtn && closeBtn && drawerPanel && drawerOverlay) {
    openBtn.addEventListener('click', () => {
      drawerPanel.classList.remove('translate-x-full');
      drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    });

    const closeDrawer = () => {
      drawerPanel.classList.add('translate-x-full');
      drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    };

    closeBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // 1RM Hesaplayıcı
  document.getElementById('calcRmBtn')?.addEventListener('click', () => {
    const w = parseFloat(document.getElementById('rmWeight').value);
    const r = parseInt(document.getElementById('rmReps').value);
    if (w && r) {
      const epley = Math.round(w * (1 + r / 30));
      document.getElementById('rmVal').innerText = `${epley} kg`;
      document.getElementById('rmResult').classList.remove('hidden');
    }
  });

  // TDEE Kalori Hesaplayıcı
  document.getElementById('calcTdeeBtn')?.addEventListener('click', () => {
    const w = parseFloat(document.getElementById('tdeeWeight').value);
    const h = parseFloat(document.getElementById('tdeeHeight').value);
    const a = parseInt(document.getElementById('tdeeAge').value);
    if (w && h && a) {
      const bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
      const tdee = Math.round(bmr * 1.55);
      document.getElementById('tdeeVal').innerText = `${tdee} kcal`;
      document.getElementById('tdeeResult').classList.remove('hidden');
    }
  });

  // US Navy Yağ Oranı
  document.getElementById('calcNavyBtn')?.addEventListener('click', () => {
    const waist = parseFloat(document.getElementById('navyWaist').value);
    const neck = parseFloat(document.getElementById('navyNeck').value);
    if (waist && neck && waist > neck) {
      const est = Math.round((waist - neck) * 0.45);
      document.getElementById('navyVal').innerText = `%${est}`;
      document.getElementById('navyResult').classList.remove('hidden');
    }
  });
});

// Tab Değiştirme Fonksiyonu
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-brand-500', 'bg-slate-800');
    btn.classList.add('text-slate-400');
  });

  document.getElementById(`tab-${tabName}`)?.classList.remove('hidden');
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('text-brand-500', 'bg-slate-800');
    event.currentTarget.classList.remove('text-slate-400');
  }
}