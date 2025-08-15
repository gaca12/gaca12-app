// Drawer y año
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
  sections.forEach(s => {
    const active = (s.id === id);
    s.classList.toggle('active', active);
    s.style.display = active ? '' : 'none'; // Evitar blanco en PWA
  });
  links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  if (window.innerWidth < 1024) closeDrawer();
  if (location.hash !== `#${id}`) location.hash = id;
}

// Click en links
links.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

// Detectar hash inicial
const initial = location.hash?.replace('#','') || 'inicio';
showSection(initial);

// Cambios de hash (PWA incluida)
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#','') || 'inicio';
  showSection(id);
});

// Esc para cerrar menú
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});

// Botón instalar PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Instalar app';
  installBtn.className = 'btn install-btn';
  document.querySelector('.nav').appendChild(installBtn);
  installBtn.addEventListener('click', async () => {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.remove();
  });
});

