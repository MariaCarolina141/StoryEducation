document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    
    // Registrar plugins do GSAP
    gsap.registerPlugin(ScrollTrigger);

    // ===== BARRA DE PROGRESSO DE LEITURA =====
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgressBar.style.width = scrollPercent + '%';
      });
    }

    // ===== ANIMAÇÕES DE SCROLL (FADE E SLIDE) =====
    // Animar seções principais
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Animar cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // ===== CONTADOR DE NÚMEROS =====
    function animateCounter(element, target, duration = 2000) {
      const isPercentage = element.textContent.includes('%');
      const isCurrency = element.textContent.includes('R$');
      const isUnits = element.textContent.includes('un.');
      const isItems = element.textContent.includes('itens');
      
      let start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        const current = Math.floor(start + (target - start) * easeProgress);
        
        if (isCurrency) {
          element.textContent = 'R$ ' + current.toLocaleString('pt-BR');
        } else if (isPercentage) {
          element.textContent = current + '%';
        } else if (isUnits) {
          element.textContent = current + ' un.';
        } else if (isItems) {
          element.textContent = current + ' itens';
        } else {
          element.textContent = current;
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    }

    // Identificar números para animar no dashboard
    const numberElements = document.querySelectorAll('h2, strong');
    numberElements.forEach(el => {
      const text = el.textContent;
      const numberMatch = text.match(/[\d.,]+/);
      
      if (numberMatch) {
        const number = parseFloat(numberMatch[0].replace(/\./g, '').replace(',', '.'));
        
        if (!isNaN(number) && number > 0) {
          gsap.fromTo(el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                onEnter: () => {
                  animateCounter(el, number);
                }
              }
            }
          );
        }
      }
    });

    // ===== EFEITO 3D NOS CARDS (VANILLA TILT) =====
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
      VanillaTilt.init(card, {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02
      });

      // Efeito de brilho seguindo o mouse
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });

    // ===== ANIMAÇÃO DO HEADER =====
    const header = document.querySelector('header');
    if (header) {
      gsap.fromTo(header,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );
    }

    // ===== GRÁFICOS CHART.JS =====
    const financeCtx = document.getElementById('financeChart');
    if (financeCtx) {
      new Chart(financeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            { label: 'Receitas', data: [7500, 9200, 8600, 11100, 10500, 13200], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', tension: 0.35, fill: true, pointRadius: 5, pointBackgroundColor: '#4f46e5', borderWidth: 2 },
            { label: 'Despesas', data: [4200, 4600, 4900, 5300, 5200, 5400], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', tension: 0.35, fill: true, pointRadius: 5, pointBackgroundColor: '#f97316', borderWidth: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#334155', font: { size: 12, weight: '600' } } },
            filler: { propagate: true }
          },
          scales: {
            x: { ticks: { color: '#475569' }, grid: { color: 'rgba(148,163,184,0.15)' } },
            y: { ticks: { color: '#475569' }, grid: { color: 'rgba(148,163,184,0.15)' }, beginAtZero: true }
          }
        }
      });
    }
    const stockCtx = document.getElementById('stockChart');
    if (stockCtx) {
      new Chart(stockCtx, {
        type: 'bar',
        data: {
          labels: ['Fraldas', 'Embalagens', 'Higiene', 'Matéria-prima', 'Bebidas'],
          datasets: [{
            label: 'Unidades restantes',
            data: [35, 18, 46, 62, 88],
            backgroundColor: ['#fb923c', '#f59e0b', '#38bdf8', '#818cf8', '#a78bfa'],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#475569' }, grid: { display: false } },
            y: { ticks: { color: '#475569' }, grid: { color: 'rgba(148,163,184,0.15)' }, beginAtZero: true }
          }
        }
      });
    }
    document.getElementById('refresh-dashboard').addEventListener('click', () => { alert('✓ Dados atualizados com sucesso!'); });

    // ===== ACESSIBILIDADE - Controle de Fonte e Contraste =====
    let currentFontSize = 100;
    const minFontSize = 85;
    const maxFontSize = 130;
    const fontSizeStep = 5;
    let highContrastMode = false;

    function adjustFontSize(delta) {
      currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize + delta));
      document.documentElement.style.fontSize = currentFontSize + '%';
      localStorage.setItem('fontSize', currentFontSize);
    }

    function toggleHighContrast() {
      highContrastMode = !highContrastMode;
      document.body.classList.toggle('high-contrast', highContrastMode);
      localStorage.setItem('highContrast', highContrastMode);
    }

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      currentFontSize = parseInt(savedFontSize);
      document.documentElement.style.fontSize = currentFontSize + '%';
    }

    const savedHighContrast = localStorage.getItem('highContrast');
    if (savedHighContrast === 'true') {
      highContrastMode = true;
      document.body.classList.add('high-contrast');
    }

    document.getElementById('btn-font-decrease')?.addEventListener('click', () => adjustFontSize(-fontSizeStep));
    document.getElementById('btn-font-increase')?.addEventListener('click', () => adjustFontSize(fontSizeStep));
    document.getElementById('btn-contrast')?.addEventListener('click', toggleHighContrast);

    lucide.createIcons();
  });
