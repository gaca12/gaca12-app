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
  // Cerrar menú al seleccionar (comportamiento pedido)
  if (window.innerWidth < 1024) closeDrawer();
  // Actualizar hash para permitir volver/compartir
  history.replaceState(null, '', `#${id}`);
}

// Click en links del menú
links.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

// Iniciar según hash o 'inicio'
const initial = location.hash?.replace('#','') || 'inicio';
showSection(initial);

// Permitir navegación con teclas (accesibilidad)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});
