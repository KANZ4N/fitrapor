// Sağdan Kayan Panel (Drawer) ve Tab Yönetimi
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openDrawerBtn');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const drawerPanel = document.getElementById('drawerPanel');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (openBtn && closeBtn && drawerPanel && drawerOverlay) {
    function openDrawer() {
      drawerPanel.classList.remove('translate-x-full');
      drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }

    function closeDrawer() {
      drawerPanel.classList.add('translate-x-full');
      drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
  }
});

// Tab Değiştirme Fonksiyonu
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-brand-500', 'bg-slate-800');
    btn.classList.add('text-slate-400');
  });

  const activeTab = document.getElementById(`tab-${tabName}`);
  if (activeTab) {
    activeTab.classList.remove('hidden');
  }

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('text-brand-500', 'bg-slate-800');
    window.event.currentTarget.classList.remove('text-slate-400');
  }
}