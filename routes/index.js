const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Klasör bulunamazsa veya boşsa sitenin çökmesini engelleyen varsayılan içerik
const defaultArticles = [
  {
    id: 1,
    slug: 'hipertrofi-ve-mekanik-gerilim',
    title: 'Kas Hipertrofisinde Mekanik Gerilim: Biyomekanik Sınırlar ve Aktif Kas Ucu',
    excerpt: 'Son meta-analizler ışığında tam eklem hareket açıklığı (fROM) ile kısmi rom karşılaştırması.',
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
    excerpt: '2025/2026 derleme çalışmaları: Kas protein sentezi (MPS) tetiklenmesinde öğün zamanlamasının etkisi.',
    category: 'Beslenme Fizyolojisi',
    evidenceLevel: 'Level 1 - Systematic Review',
    readTime: '8 dk',
    date: '04 Ekim 2026',
    author: 'Okan Kar'
  }
];

// Güvenli Makale Okuma Fonksiyonu
function getAllArticles() {
  if (!fs.existsSync(articlesDirectory)) {
    return defaultArticles;
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const mdFiles = fileNames.filter(file => file.endsWith('.md'));

  if (mdFiles.length === 0) {
    return defaultArticles;
  }

  return mdFiles.map(fileName => {
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return data;
  });
}

// 1. Ana Sayfa Rotalaması
router.get('/', (req, res) => {
  try {
    const articles = getAllArticles();
    res.render('index', { title: 'FitRapor - Kanıta Dayalı Akademik Fitness', articles });
  } catch (error) {
    console.error('Ana Sayfa Yükleme Hatası:', error);
    res.render('index', { title: 'FitRapor - Kanıta Dayalı Akademik Fitness', articles: defaultArticles });
  }
});

// 2. Makale Detay Rotalaması
router.get('/makale/:slug', (req, res) => {
  const { slug } = req.params;
  const mdPath = path.join(articlesDirectory, `${slug}.md`);

  if (fs.existsSync(mdPath)) {
    const fileContents = fs.readFileSync(mdPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return res.render('article', {
      title: `${data.title} - FitRapor`,
      article: { ...data, body: htmlContent }
    });
  }

  const article = defaultArticles.find(a => a.slug === slug);
  if (article) {
    return res.render('article', {
      title: `${article.title} - FitRapor`,
      article: { ...article, body: article.excerpt }
    });
  }

  return res.status(404).render('404', { title: 'Makale Bulunamadı - FitRapor' });
});

// 3. Hesaplayıcı Sayfası
router.get('/hesaplayici', (req, res) => {
  res.render('calculator', { 
    title: 'Biyomekanik 1RM & Hacim Optimizeri - FitRapor' 
  });
});

// 4. Bülten Abonelik API
router.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi giriniz.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.log(`[Bülten Kaydı - Key Yok]: ${email}`);
    return res.json({ success: true, message: 'FitRapor Pazar Bültenine kaydınız tamamlandı.' });
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'FitRapor <bulten@fitrapor.com>',
      to: email,
      subject: 'FitRapor Akademik Bültenine Hoş Geldiniz',
      html: '<p>Her Pazar 09:43\'te kanıta dayalı analizler e-posta kutunuzda olacak.</p>'
    });

    return res.json({ success: true, message: 'FitRapor Pazar Bültenine kaydınız tamamlandı.' });
  } catch (error) {
    console.error('Resend Hatası:', error);
    return res.status(500).json({ success: false, message: 'E-posta servisi yanıt veremedi.' });
  }
});

module.exports = router;