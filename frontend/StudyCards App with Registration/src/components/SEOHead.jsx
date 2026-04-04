import { Helmet } from 'react-helmet-async'

/**
 * SEOHead - компонент для управления мета-тегами страницы
 * Обеспечивает правильную семантику для поисковых систем
 */
export default function SEOHead({
  title = 'StudyCards - Обучение через интерактивные карточки',
  description = 'Создавайте и решайте интерактивные тесты из PDF файлов для эффективного обучения',
  canonical = 'https://studycards.app',
  imageUrl = 'https://studycards.app/og-image.png',
  keywords = 'обучение, карточки, PDF, тесты, интерактивное обучение',
  ogType = 'website',
  robots = 'index, follow'
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="language" content="Russian" />
      
      {/* Canonical URL - для исключения дублей контента */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph для социальных сетей */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
