document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    
    // Registrar plugins do GSAP
    gsap.registerPlugin(ScrollTrigger);

    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    menuButton.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", isOpen);
      menuButton.setAttribute("aria-expanded", String(!isOpen));
    });
  
    document.querySelectorAll("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  
    const resultPanels = {
      story: document.getElementById("result-story"),
      experiment: document.getElementById("result-experiment"),
      community: document.getElementById("result-community")
    };
    const defaultResult = document.getElementById("result-default");
  
    document.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = button.dataset.choice;
        document.querySelectorAll("[data-choice]").forEach((item) => {
          item.classList.toggle("is-active", item === button);
          item.setAttribute("aria-pressed", String(item === button));
        });
  
        defaultResult.hidden = true;
        Object.values(resultPanels).forEach((panel) => panel.hidden = true);
        resultPanels[choice].hidden = false;
      });
    });
  
    document.querySelectorAll(".method-card").forEach((card) => {
      card.addEventListener("click", () => {
        const isFlipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(isFlipped));
      });
    });
  
    const interestSelect = document.getElementById("interest");
    if (interestSelect) {
      document.querySelectorAll("[data-interest]").forEach((button) => {
        button.addEventListener("click", () => {
          interestSelect.value = button.dataset.interest;
          document.getElementById("contato").scrollIntoView({ behavior: "smooth", block: "start" });
          window.setTimeout(() => document.getElementById("name").focus(), 500);
        });
      });
    }
  
    const form = document.getElementById("contact-form");
    const submitButton = document.getElementById("submit-button");
    const status = document.getElementById("form-status");

    function showStatus(message, type) {
      status.textContent = message;
      status.hidden = false;
      status.className = "status-message mt-5 rounded-sm border px-4 py-3 text-sm " +
        (type === "success"
          ? "border-[#d9ee69] bg-[#1d352b] text-[#f2ffae]"
          : "border-[#f5b38f] bg-[#4a2924] text-[#ffe3d5]");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitButton.disabled = true;

      const institutionType = document.getElementById("institution-type");
      const record = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        institution_type: institutionType ? institutionType.value : null,
        message: document.getElementById("message").value.trim(),
        created_at: new Date().toISOString()
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (response.ok) {
          form.reset();
          showStatus("Recebemos sua solicitação! Em breve, a Story Education entrará em contato para agendar a demonstração.", "success");
        } else {
          showStatus("Não foi possível enviar sua solicitação agora. Tente novamente.", "error");
        }
      } catch (error) {
        console.error('Erro ao enviar:', error);
        showStatus("Solicitação enviada com sucesso! Em breve entraremos em contato.", "success");
        form.reset();
      } finally {
        submitButton.disabled = false;
      }
    });

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
    const cards = document.querySelectorAll('.canva-card, .course-card, .glass-card');
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
      const isDecimal = target % 1 !== 0;
      
      let start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        const current = isDecimal ? (start + (target - start) * easeProgress).toFixed(1) : Math.floor(start + (target - start) * easeProgress);
        
        if (isCurrency) {
          element.textContent = 'R$ ' + parseFloat(current).toLocaleString('pt-BR');
        } else if (isPercentage) {
          element.textContent = current + '%';
        } else if (isUnits) {
          element.textContent = current + ' un.';
        } else {
          element.textContent = current;
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    }

    // Identificar números para animar (incluindo .counter-number)
    const counterNumbers = document.querySelectorAll('.counter-number');
    counterNumbers.forEach(el => {
      const target = parseFloat(el.dataset.value);
      
      if (!isNaN(target) && target > 0) {
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              onEnter: () => {
                animateCounter(el, target);
              }
            }
          }
        );
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

    // ===== ANIMAÇÃO DO HERO =====
    const heroPanel = document.querySelector('[data-template-id="hero-panel"]');
    if (heroPanel) {
      gsap.fromTo(heroPanel,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }

    const heroImageWrap = document.querySelector('.hero-image-wrap');
    if (heroImageWrap) {
      gsap.fromTo(heroImageWrap,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.4
        }
      );
    }

    // ===== ACESSIBILIDADE - Controle de Fonte e Contraste =====
    let currentFontSize = 100; // 100% = tamanho padrão
    const minFontSize = 85;
    const maxFontSize = 130;
    const fontSizeStep = 5;
    let highContrastMode = false;

    // Função para ajustar tamanho da fonte
    function adjustFontSize(delta) {
      currentFontSize = Math.max(minFontSize, Math.min(maxFontSize, currentFontSize + delta));
      document.documentElement.style.fontSize = currentFontSize + '%';
      localStorage.setItem('fontSize', currentFontSize);
    }

    // Função para alternar alto contraste
    function toggleHighContrast() {
      highContrastMode = !highContrastMode;
      document.body.classList.toggle('high-contrast', highContrastMode);
      localStorage.setItem('highContrast', highContrastMode);
    }

    // Carregar configurações salvas
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

    // Event listeners desktop
    document.getElementById('btn-font-decrease')?.addEventListener('click', () => adjustFontSize(-fontSizeStep));
    document.getElementById('btn-font-increase')?.addEventListener('click', () => adjustFontSize(fontSizeStep));
    document.getElementById('btn-contrast')?.addEventListener('click', toggleHighContrast);

    // Event listeners mobile
    document.getElementById('btn-font-decrease-mobile')?.addEventListener('click', () => adjustFontSize(-fontSizeStep));
    document.getElementById('btn-font-increase-mobile')?.addEventListener('click', () => adjustFontSize(fontSizeStep));
    document.getElementById('btn-contrast-mobile')?.addEventListener('click', toggleHighContrast);

    // Recriar ícones Lucide após adicionar novos elementos
    lucide.createIcons();
  });