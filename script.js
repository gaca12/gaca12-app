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
  // Cerrar menú en pantallas pequeñas
  if (window.innerWidth < 1024) closeDrawer();
  // Actualizar hash en la URL
  history.replaceState(null, '', `#${id}`);
}

links.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

// Iniciar según hash o "inicio"
const initial = location.hash?.replace('#','') || 'inicio';
showSection(initial);

// Accesibilidad: cerrar con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});


// =======================
// Botón Instalar en Android
// =======================
let deferredPrompt;
const installBtn = document.getElementById('install-btn'); // Debe existir en el HTML

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('✅ App instalada');
      } else {
        console.log('❌ Instalación cancelada');
      }
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

