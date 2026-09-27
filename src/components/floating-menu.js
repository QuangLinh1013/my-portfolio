function updateNavIndicator(wrapper) {
  const activeToggle = wrapper.querySelector('.nav-toggle.active');
  const indicator = wrapper.querySelector('.nav-indicator-pill');
  const topLine = wrapper.querySelector('.nav-top-line');
  const navPill = wrapper.querySelector('.nav-pill');

  if (!activeToggle || !indicator || !navPill) return;

  const activeRect = activeToggle.getBoundingClientRect();
  const pillRect = navPill.getBoundingClientRect();
  const offsetX = activeRect.left - pillRect.left;
  const activeText = activeToggle.querySelector('.text-nav-toggle');

  indicator.style.width = `${activeRect.width}px`;
  indicator.style.transform = `translateX(${offsetX}px)`;

  if (topLine && activeText) {
    const textRect = activeText.getBoundingClientRect();
    const textOffset = textRect.left - pillRect.left;
    topLine.style.width = `${textRect.width}px`;
    topLine.style.transform = `translateX(${textOffset}px) rotate(0deg)`;
  }
}

const messengerUrl = new URL('https://m.me/quang.linh.118619');
messengerUrl.searchParams.set('text', 'Hello Linh, I saw your portfolio and would like to connect.');

function renderMessengerButton() {
  const existingButton = document.querySelector('.messenger-float');
  if (existingButton) return existingButton;

  const button = document.createElement('a');
  button.href = messengerUrl.toString();
  button.target = '_blank';
  button.rel = 'noreferrer';
  button.className = 'messenger-float';
  button.setAttribute('aria-label', 'Message me on Messenger');
  button.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 3C8.82 3 3.25 8.23 3.25 15.3c0 3.7 1.52 6.9 4 9.1v4.6l4.48-2.46c1.3.36 2.74.56 4.27.56 7.18 0 12.75-5.23 12.75-12.3S23.18 3 16 3Zm1.26 16.48-3.24-3.45-6.32 3.45 6.94-7.36 3.32 3.45 6.24-3.45-6.94 7.36Z" />
    </svg>
    <span>Messenger</span>
  `;
  document.body.appendChild(button);

  return button;
}

export function renderFloatingMenu() {
  renderMessengerButton();

  const loader = document.createElement('div');
  loader.className = 'mobile-page-loader';
  loader.setAttribute('aria-label', 'Almost there');
  loader.innerHTML = `
    <div class="mobile-page-loader-content">
      <span>Almost there</span>
      <span class="loader-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    </div>
  `;
  document.body.prepend(loader);

  const hideLoader = () => {
    loader.classList.add('is-loaded');
    window.setTimeout(() => loader.remove(), 500);
  };

  if (document.readyState === 'complete') {
    requestAnimationFrame(hideLoader);
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }

  const existingTopBar = document.querySelector('.top-bar');
  if (existingTopBar) {
    const navWrapper = existingTopBar.querySelector('.nav-pill-wrapper');
    if (navWrapper) updateNavIndicator(navWrapper);
    return existingTopBar;
  }

  const root = document.createElement('div');
  root.className = 'top-bar';

  const logo = document.createElement('div');
  logo.className = 'logo-text';

  const textLogo = document.createElement('div');
  textLogo.className = 'text-logo';
  textLogo.textContent = 'Ngo Quang Linh';

  const textUnderLogo = document.createElement('div');
  textUnderLogo.className = 'text-underlogo';
  textUnderLogo.textContent = 'Software Engineer';

  logo.appendChild(textLogo);
  logo.appendChild(textUnderLogo);
  root.appendChild(logo);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-pill-wrapper';

  const menuToggle = document.createElement('button');
  menuToggle.className = 'nav-menu-toggle';
  menuToggle.type = 'button';
  menuToggle.setAttribute('aria-label', 'Open social links');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';
  root.appendChild(menuToggle);

  const glow = document.createElement('div');
  glow.className = 'nav-indicator-glow';
  wrapper.appendChild(glow);

  const topLine = document.createElement('div');
  topLine.className = 'nav-top-line';

  const navPill = document.createElement('div');
  navPill.className = 'nav-pill';
  navPill.appendChild(topLine);

  const indicator = document.createElement('div');
  indicator.className = 'nav-indicator-pill';
  navPill.appendChild(indicator);

  const isInfoPage = window.location.pathname.includes('info');
  const items = [
    { label: 'Work', href: '/', active: !isInfoPage },
    { label: 'Info', href: '/info/', active: isInfoPage },
  ];

  items.forEach(({ label, href, active }) => {
    const link = document.createElement('a');
    link.href = href;
    link.className = `nav-toggle w-inline-block${active ? ' active' : ''}`;

    const text = document.createElement('div');
    text.className = 'text-nav-toggle';
    text.textContent = label;

    link.appendChild(text);
    navPill.appendChild(link);
  });

  wrapper.appendChild(navPill);
  root.appendChild(wrapper);

  const navRightWrapper = document.createElement('div');
  navRightWrapper.className = 'nav-right-wrapper';

  const socialsWrapper = document.createElement('div');
  socialsWrapper.className = 'chip-socials-wrapper';

  [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/quanglinh106' },
    { label: 'Resume', href: 'https://google.com' },
  ].forEach(({ label, href }) => {
    const socialLink = document.createElement('a');
    socialLink.href = href;
    socialLink.target = '_blank';
    socialLink.rel = 'noreferrer';
    socialLink.className = 'chip-socials w-inline-block';
    socialLink.dataset.label = label;
    socialLink.setAttribute('aria-label', label);
    socialLink.textContent = label;
    socialsWrapper.appendChild(socialLink);
  });

  navRightWrapper.appendChild(socialsWrapper);
  root.appendChild(navRightWrapper);
  document.body.prepend(root);

  menuToggle.addEventListener('click', () => {
    const isOpen = root.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close social links' : 'Open social links');
  });

  wrapper.querySelectorAll('.nav-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (event) => {
      event.preventDefault(); // Ngăn chuyển trang ngay lập tức
      const targetUrl = toggle.getAttribute('href');
      
      // Nếu click vào tab hiện tại thì không làm gì
      if (toggle.classList.contains('active')) return;

      // Đổi active ngay lập tức
      wrapper.querySelectorAll('.nav-toggle').forEach((item) => {
        item.classList.toggle('active', item === toggle);
      });
      updateNavIndicator(wrapper);

      // Chuyển trang ngay, để trình duyệt tự xoay loading, giao diện giữ nguyên
      window.location.href = targetUrl;
    });
  });

  // Tắt hiệu ứng trượt của indicator khi mới load trang để tránh bị "giật"
  indicator.style.transition = 'none';
  if (topLine) topLine.style.transition = 'none';
  updateNavIndicator(wrapper);
  
  // Bật lại hiệu ứng trượt sau khi đã render xong
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      indicator.style.transition = '';
      if (topLine) topLine.style.transition = '';
    });
  });
  window.addEventListener('resize', () => updateNavIndicator(wrapper));

  return wrapper;
}

if (typeof window !== 'undefined') {
  window.renderFloatingMenu = renderFloatingMenu;
}

export default renderFloatingMenu;
