const express = require('express');
const router = express.Router();

const articles = [
  {
    id: 1,
    slug: 'hipertrofi-ve-mekanik-gerilim',
    title: 'Kas Hipertrofisinde Mekanik Gerilim: Biyomekanik Sınırlar ve Aktif Kas Ucu',
    excerpt: 'Son meta-analizler ışığında tam eklem hareket açıklığı (fROM) ile kısmi rom karşılaştırması. Kas fiber oryantasyonunun büyümedeki etkisi.',
    category: 'Biyomekanik',
    evidenceLevel: 'Level 1 - Meta-Analiz',
    readTime: '6 dk',
    date: '10 Ekim 2026',
    author: 'Okan Kar'
  },
  {
    id: 2,
    slug: 'protein-sentezi-ve-zamanlama',
    title: 'Direnç Antrenmanı Sonrası Anabolik Pencere Miti vs. Günlük Toplam Makro',
    excerpt: '2025/2026 derleme çalışmaları: Kas protein sentezi (MPS) tetiklenmesinde öğün zamanlamasının günlük 1.6-2.2g/kg protein alımına kıyasla etkisi.',
    category: 'Beslenme Fizyolojisi',
    evidenceLevel: 'Level 1 - Systematic Review',
    readTime: '8 dk',
    date: '04 Ekim 2026',
    author: 'Okan Kar'
  }
];

router.get('/', (req, res) => {
  res.render('index', { 
    title: 'FitRapor - Kanıta Dayalı Akademik Fitness',
    articles: articles 
  });
});

router.get('/makale/:slug', (req, res) => {
  const article = articles.find(a => a.slug === req.params.slug);
  if (!article) return res.status(404).render('404', { title: 'Makale Bulunamadı' });
  
  res.render('article', { 
    title: `${article.title} - FitRapor`,
    article 
  });
});

router.get('/hesaplayici', (req, res) => {
  res.render('calculator', { 
    title: 'Biyomekanik 1RM & Hacim Optimizeri - FitRapor' 
  });
});

router.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi giriniz.' });
  }
  
  console.log(`[Yeni Abone]: ${email}`);
  return res.json({ 
    success: true, 
    message: 'FitRapor Pazar Bültenine kaydınız başarıyla tamamlandı.' 
  });
});

module.exports = router;