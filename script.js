// Drawer (menú) y navegación entre secciones
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const burger = document.getElementById('hamburger');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

function openDrawer(){
  drawer.classList.add('open');
  overlay.classList.add('show');
  burger.setAttribute('aria-expanded', 'true');
}
function closeDrawer(){
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  const isOpen = drawer.classList.contains('open');
  isOpen ? closeDrawer() : openDrawer();
});
overlay.addEventListener('click', closeDrawer);

// Navegación de secciones
const links = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('.section'));

function showSection(id){
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  if (window.innerWidth < 1024) closeDrawer();
  history.replaceState(null, '', `#${id}`);
}

links.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

const initial = location.hash?.replace('#','') || 'inicio';
showSection(initial);

// Detectar cambio de hash (PWA y navegación manual)
window.addEventListener('hashchange', () => {
  const sectionId = location.hash?.replace('#','') || 'inicio';
  showSection(sectionId);
});

// Accesibilidad
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});

// Botón de instalación PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = '📥 Instalar App';
  installBtn.classList.add('btn', 'install-btn');
  document.querySelector('.drawer-footer').appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    console.log(`Instalación: ${outcome}`);
  });
});
