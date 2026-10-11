const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/', indexRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Sayfa Bulunamadı - FitRapor' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[FitRapor Local Active] http://localhost:${PORT}`);
  });
}

module.exports = app;