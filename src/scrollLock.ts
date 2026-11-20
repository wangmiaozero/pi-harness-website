export function setScrollLock(name: 'menu' | 'lightbox', locked: boolean) {
  const body = document.body
  if (locked) body.dataset[name] = '1'
  else delete body.dataset[name]
  body.style.overflow = body.dataset.menu || body.dataset.lightbox ? 'hidden' : ''
}
