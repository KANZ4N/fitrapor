// Biyomekanik ve Fizyoloji Hesaplama Motoru
document.addEventListener('DOMContentLoaded', () => {
  
  // 1RM Hesaplama
  document.getElementById('calcRmBtn')?.addEventListener('click', () => {
    const w = parseFloat(document.getElementById('rmWeight').value);
    const r = parseInt(document.getElementById('rmReps').value);
    if (w && r) {
      const epley = Math.round(w * (1 + r / 30));
      document.getElementById('rmVal').innerText = `${epley} kg`;
      document.getElementById('rmResult').classList.remove('hidden');
    }
  });

  // TDEE Kalori Hesaplama
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

  // Yağ Oranı Hesaplama
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