const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Tüm makaleleri okuyan yardımcı fonksiyon
function getAllArticles() {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames.map(fileName => {
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return data;
  });
}

// Ana Sayfa Rota Güncellemesi
router.get('/', (req, res) => {
  const articles = getAllArticles();
  res.render('index', { title: 'FitRapor - Kanıta Dayalı Akademik Fitness', articles });
});

// Makale Detay Rota Güncellemesi
router.get('/makale/:slug', (req, res) => {
  const fullPath = path.join(articlesDirectory, `${req.params.slug}.md`);
  if (!fs.existsSync(fullPath)) return res.status(404).render('404');

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = marked(content);

  res.render('article', {
    title: `${data.title} - FitRapor`,
    article: { ...data, body: htmlContent }
  });
});
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

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi giriniz.' });
  }

  try {
    // Abone e-postasını kayıt altına alma veya karşılama maili atma
    await resend.emails.send({
      from: 'FitRapor <bulten@fitrapor.com>',
      to: email,
      subject: 'FitRapor Akademik Bültenine Hoş Geldiniz',
      html: '<p>Her Pazar 09:43\'te kanıta dayalı analizler e-posta kutunuzda olacak.</p>'
    });

    return res.json({ success: true, message: 'FitRapor Pazar Bültenine kaydınız tamamlandı.' });
  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ success: false, message: 'E-posta servisi yanıt vermedi.' });
  }
});

module.exports = router;