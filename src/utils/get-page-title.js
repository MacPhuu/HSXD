import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Liên đoàn lao động'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
