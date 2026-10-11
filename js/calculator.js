document.getElementById('calcBtn')?.addEventListener('click', () => {
  const weight = parseFloat(document.getElementById('weight').value);
  const reps = parseInt(document.getElementById('reps').value);

  if (!weight || !reps || reps < 1) {
    alert('Lütfen geçerli ağırlık ve tekrar sayısı giriniz.');
    return;
  }

  const epley = Math.round(weight * (1 + reps / 30));
  const brzycki = Math.round(weight * (36 / (37 - reps)));

  document.getElementById('epleyVal').innerText = `${epley} kg`;
  document.getElementById('brzyckiVal').innerText = `${brzycki} kg`;
  document.getElementById('results').classList.remove('hidden');
});