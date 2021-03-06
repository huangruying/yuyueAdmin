import defaultSettings from '@/settings'

const title = defaultSettings.title || '喻悦商旅'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
