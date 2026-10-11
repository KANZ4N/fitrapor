const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const articlesDirectory = path.join(process.cwd(), 'content/articles');

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

function getArticles() {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return defaultArticles;
    }

    const matter = require('gray-matter');
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
  } catch (err) {
    console.error('Makale okuma hatası:', err);
    return defaultArticles;
  }
}

router.get('/', (req, res) => {
  const articles = getArticles();
  res.render('index', { 
    title: 'FitRapor - Kanıta Dayalı Akademik Fitness',
    articles: articles 
  });
});

router.get('/makale/:slug', (req, res) => {
  const { slug } = req.params;
  const articles = getArticles();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return res.status(404).render('404', { title: 'Makale Bulunamadı - FitRapor' });
  }

  let bodyContent = article.excerpt;
  const mdPath = path.join(articlesDirectory, `${slug}.md`);

  if (fs.existsSync(mdPath)) {
    try {
      const matter = require('gray-matter');
      const marked = require('marked');
      const fileContents = fs.readFileSync(mdPath, 'utf8');
      const { content } = matter(fileContents);
      bodyContent = typeof marked.parse === 'function' ? marked.parse(content) : marked(content);
    } catch (err) {
      console.error('MD Parsing hatası:', err);
    }
  }

  res.render('article', { 
    title: `${article.title} - FitRapor`,
    article: { ...article, body: bodyContent }
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

  console.log(`[Yeni Bülten Abonesi]: ${email}`);
  return res.json({ 
    success: true, 
    message: 'FitRapor Pazar Bültenine kaydınız başarıyla tamamlandı.' 
  });
});

module.exports = router;