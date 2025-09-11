document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true, offset: 50 });

    // --- Security: Disable Right-Click and Dev Shortcuts ---
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', event => {
        if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key.toUpperCase())) || (event.ctrlKey && event.key.toUpperCase() === 'U')) {
            event.preventDefault();
        }
    });

    // --- Global Variables & Constants ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwszFP4iiQOCb72ppUrozveyEMb3z7NhSP-7wugKsZnqPZhYD3ZPUDFEY966V9CH9LuCQ/exec';
    
    const ALL_HEADERS = [ "Project", "Date", "Ean Date", "Domain", "Name", "Country", "State", "District", "City", "Zip Code", "Email", "Second Email", "Password", "Mobile Number", "Adsterra Email", "Adsterra Password", "Ammount", "Status", "REG. ID", "Half Payment" ];
    
    let vantaEffect = null;
    let welcomeVantaEffect = null;
    let modalVantaEffects = {};
    const header = document.querySelector('header');
    
    let testimonials = [];

    // --- Scrolled Header Effect ---
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelectorAll('header nav a, .header-btn');
    mobileMenuBtn.addEventListener('click', () => {
        header.classList.toggle('nav-active');
        mobileMenuBtn.querySelector('i').className = header.classList.contains('nav-active') ? 'fas fa-times' : 'fas fa-bars';
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (header.classList.contains('nav-active') && !link.closest('.dropdown')) {
               header.classList.remove('nav-active');
               mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    });

    // --- Language Switcher ---
    const langButtons = document.querySelectorAll('.lang-btn');
    function setLanguage(lang) {
        document.querySelectorAll('.lang-en, .lang-hi').forEach(el => {
            if(el.closest('.hidden')) return;
            el.style.display = el.classList.contains(`lang-${lang}`) ? (el.tagName === 'SPAN' ? 'inline' : 'block') : 'none';
        });
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        localStorage.setItem('language', lang);
        const infoModal = document.getElementById('info-modal');
        if(infoModal.classList.contains('visible')) {
            const currentPage = infoModal.dataset.currentPage;
            if(currentPage) loadPageContent(currentPage, 'info-modal-content');
        }
    }
    langButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
    setLanguage(localStorage.getItem('language') || 'en');

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-item .faq-question').forEach(q => q.addEventListener('click', () => {
        const item = q.parentElement;
        const currentlyActive = document.querySelector('.faq-item.active');
        if (currentlyActive && currentlyActive !== item) currentlyActive.classList.remove('active');
        item.classList.toggle('active');
    }));

    // --- NEW: Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
    });
    const hoverables = document.querySelectorAll('a, button, .flip-card, .faq-question, .slider-nav button, .dot');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // --- UPDATED: Universal Vanta.js Background Logic ---
    function startWelcomeVanta(isDark) {
        if (welcomeVantaEffect) welcomeVantaEffect.destroy();
        // FIX: Changed BIRDS to NET for the "block link" effect on the welcome screen
        if (typeof VANTA !== 'undefined' && VANTA.NET) {
            welcomeVantaEffect = VANTA.NET({
                el: "#welcome-canvas",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: isDark ? 0x1b98e0 : 0x007bff,
                backgroundColor: isDark ? 0x0a0a14 : 0xf8f9fa,
                points: 12.00,
                maxDistance: 22.00,
                spacing: 18.00
            });
        }
    }

    function startVantaBackground(isDark) {
        if (vantaEffect) vantaEffect.destroy();
        if (typeof VANTA !== 'undefined' && VANTA.NET) {
            vantaEffect = VANTA.NET({
                el: "#dynamic-background",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: isDark ? 0x1b98e0 : 0x007bff,
                backgroundColor: isDark ? 0x0a0a14 : 0xf8f9fa,
                points: 12.00,
                maxDistance: 22.00,
                spacing: 18.00
            });
        }
    }

    function startVantaModalBackground(modalId, isDark) {
        if (modalVantaEffects[modalId]) modalVantaEffects[modalId].destroy();
        const canvasEl = document.querySelector(`#${modalId} .modal-background-canvas`);
        if (!canvasEl) return;
        if (typeof VANTA !== 'undefined' && VANTA.FOG) {
             modalVantaEffects[modalId] = VANTA.FOG({
                el: canvasEl,
                mouseControls: true, touchControls: true, gyroControls: false,
                minHeight: 200.00, minWidth: 200.00,
                highlightColor: isDark ? 0x1b98e0 : 0x28a745,
                midtoneColor: isDark ? 0x9b59b6 : 0x007bff,
                lowlightColor: isDark ? 0x3a476a : 0xe9ecef,
                baseColor: isDark ? 0x121220 : 0xffffff,
                blurFactor: 0.60,
                speed: 1.10,
                zoom: 0.90
            });
        }
    }

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        themeSwitcher.querySelector('i').className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        const isDark = theme === 'dark';
        
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen && welcomeScreen.style.visibility !== 'hidden') {
            startWelcomeVanta(isDark);
        } else if (vantaEffect) {
            startVantaBackground(isDark);
        }

        document.querySelectorAll('.modal-overlay.visible').forEach(modal => {
            startVantaModalBackground(modal.id, isDark);
        });
    };
    themeSwitcher.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
    
    // --- NEW: Typewriter Effect for Hero Headline ---
    function typewriterEffect() {
        const el = document.getElementById('typewriter-text');
        if (!el) return;
        const texts = [
            "Build Websites That Grow.",
            "Create Brands That Inspire.",
            "Engineer Solutions That Scale."
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                el.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before new text
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- Chart & Animation On Scroll ---
    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('animate');
                const circle = card.querySelector('.donut-chart .foreground');
                if (circle) { const p = circle.dataset.percent, c = 2 * Math.PI * 45; circle.style.strokeDashoffset = c - (p / 100) * c; }
                card.querySelectorAll('.kpi-container, .chart-percent').forEach(el => animateCount(el, el.classList.contains('chart-percent')));
                if (card.querySelector('#growth-chart-container')) initGrowthChart();
                if (card.querySelector('#projects-bar-chart')) initBarChart();
                if (card.querySelector('#tech-radar-chart')) initRadarChart();
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });
    function animateCount(el, isPercent = false) { const target = +el.dataset.target; let current = 0; const inc = target / 100; const interval = setInterval(() => { current += inc; if (current >= target) { current = target; clearInterval(interval); } el.textContent = Math.ceil(current) + (isPercent ? '%' : ''); }, 20); }
    document.querySelectorAll('.stat-card').forEach(card => {
        const c = card.querySelector('.donut-chart .foreground');
        if (c) { const circ = 2 * Math.PI * 45; c.style.strokeDasharray = `${circ} ${circ}`; c.style.strokeDashoffset = circ; }
        chartObserver.observe(card);
    });
    
    // --- Chart Logic ---
    function initGrowthChart() {
        const container = document.getElementById('growth-chart-container');
        if (!container || container.childElementCount > 0 || typeof THREE === 'undefined') return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.set(0, 1, 4);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 10, 5);
        scene.add(pointLight);
        const shapeGroup = new THREE.Group();
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--color-primary')), metalness: 0.7, roughness: 0.2 });
        const mainShape = new THREE.Mesh(geometry, material);
        shapeGroup.add(mainShape);
        scene.add(shapeGroup);
        let mouse = new THREE.Vector2();
        function onMouseMove(event) { const rect = renderer.domElement.getBoundingClientRect(); mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; }
        function onWindowResize() { if (!container.offsetWidth || !container.offsetHeight) return; camera.aspect = container.offsetWidth / container.offsetHeight; camera.updateProjectionMatrix(); renderer.setSize(container.offsetWidth, container.offsetHeight); }
        function animate() { requestAnimationFrame(animate); shapeGroup.rotation.y += 0.005 + (mouse.x * 0.01); shapeGroup.rotation.x += 0.002 + (mouse.y * 0.01); renderer.render(scene, camera); }
        container.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);
        const themeObserver = new MutationObserver(() => { material.color.set(getComputedStyle(document.documentElement).getPropertyValue('--color-primary')); });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        animate();
    }
    function initBarChart() {
        const svg = document.getElementById('projects-bar-chart');
        if (!svg || svg.childElementCount > 0) return;
        const data = [{label: 'Q1', value: 25}, {label: 'Q2', value: 40}, {label: 'Q3', value: 30}, {label: 'Q4', value: 55}];
        const barWidth = 50, spacing = 20, chartHeight = 180, maxValue = 60;
        data.forEach((d, i) => {
            const barHeight = (d.value / maxValue) * chartHeight, x = i * (barWidth + spacing) + 30;
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', x); rect.setAttribute('y', chartHeight); rect.setAttribute('width', barWidth); rect.setAttribute('height', 0); rect.setAttribute('fill', `url(#barGradient${i % 2})`);
            svg.appendChild(rect);
            setTimeout(() => { rect.setAttribute('y', chartHeight - barHeight); rect.setAttribute('height', barHeight); }, 100);
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('class', 'bar-label'); text.setAttribute('x', x + barWidth / 2); text.setAttribute('y', chartHeight + 15); text.setAttribute('text-anchor', 'middle'); text.textContent = d.label;
            svg.appendChild(text);
        });
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `<linearGradient id="barGradient0" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}" /><stop offset="100%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}" /></linearGradient><linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--color-secondary')}" /><stop offset="100%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}" /></linearGradient>`;
        svg.prepend(defs);
    }
    function initRadarChart() {
        const svg = document.getElementById('tech-radar-chart');
        if (!svg || svg.childElementCount > 0) return;
        const data = [ { axis: "UI/UX", value: 0.9 }, { axis: "Frontend", value: 0.95 }, { axis: "Backend", value: 0.7 }, { axis: "AI/ML", value: 0.85 }, { axis: "SEO", value: 0.9 }, { axis: "DevOps", value: 0.6 } ];
        const size = 200, center = size / 2, radius = size * 0.4, numLevels = 4, angleSlice = (Math.PI * 2) / data.length;
        for (let i = 1; i <= numLevels; i++) { const levelRadius = (radius / numLevels) * i; const level = document.createElementNS("http://www.w3.org/2000/svg", "circle"); level.setAttribute('class', 'level'); level.setAttribute('cx', center); level.setAttribute('cy', center); level.setAttribute('r', levelRadius); level.setAttribute('fill', 'none'); svg.appendChild(level); }
        data.forEach((d, i) => { const angle = angleSlice * i - Math.PI / 2; const x2 = center + radius * Math.cos(angle); const y2 = center + radius * Math.sin(angle); const axis = document.createElementNS("http://www.w3.org/2000/svg", "line"); axis.setAttribute('class', 'axis'); axis.setAttribute('x1', center); axis.setAttribute('y1', center); axis.setAttribute('x2', x2); axis.setAttribute('y2', y2); svg.appendChild(axis); const label = document.createElementNS("http://www.w3.org/2000/svg", "text"); label.setAttribute('class', 'axis-label'); label.setAttribute('x', center + radius * 1.15 * Math.cos(angle)); label.setAttribute('y', center + radius * 1.15 * Math.sin(angle)); label.setAttribute('text-anchor', 'middle'); label.setAttribute('dy', '0.35em'); label.textContent = d.axis; svg.appendChild(label); });
        const startPoints = data.map(() => `${center},${center}`).join(' ');
        const endPoints = data.map((d, i) => { const angle = angleSlice * i - Math.PI / 2; const r = radius * d.value; return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`; }).join(' ');
        const shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttribute('class', 'shape'); shape.setAttribute('points', startPoints); svg.appendChild(shape);
        setTimeout(() => { shape.setAttribute('points', endPoints); }, 100);
    }

    // --- Contact Form Submission Logic ---
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageArea = form.querySelector('#contact-form-message-area');
        const btn = form.querySelector('button[type="submit"]');
        const btnOriginalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="lang-en">Sending...</span><span class="lang-hi">भेजा जा रहा है...</span>`;
        setLanguage(localStorage.getItem('language') || 'en');
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            project_details: formData.get('project_details'),
        };
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'submitContactForm', data }),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
            const result = await response.json();
            if (result.success) {
                form.reset();
                messageArea.innerHTML = `<div class="message success">${result.message}</div>`;
            } else { throw new Error(result.message || 'An unknown error occurred.'); }
        } catch (error) {
            messageArea.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
        } finally {
            btn.disabled = false;
            btn.innerHTML = btnOriginalText;
            setTimeout(() => { messageArea.innerHTML = ''; }, 5000);
        }
    });

    // --- Modal Handling ---
    const allModals = document.querySelectorAll('.modal-overlay');
    function showModal(modal) { 
        modal.classList.add('visible'); 
        document.body.style.overflow = 'hidden'; 
        startVantaModalBackground(modal.id, document.documentElement.dataset.theme === 'dark');
    }
    function hideModal(modal) { 
        modal.classList.remove('visible'); 
        document.body.style.overflow = ''; 
        if (modalVantaEffects[modal.id]) { 
            modalVantaEffects[modal.id].destroy(); 
            delete modalVantaEffects[modal.id];
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => hideModal(document.getElementById(btn.dataset.modalId))));
    allModals.forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(overlay); }));
    
    // --- Portal Logic ---
    const clientModalContent = document.getElementById('client-modal-content');
    const adminModalContent = document.getElementById('admin-modal-content');
    const editForm = document.getElementById('edit-form');
    const modalTitle = document.getElementById('modal-title');
    function showMessage(text, type = 'error', container) { const msgEl = document.createElement('div'); msgEl.innerHTML = `<div class="message ${type}">${text}</div>`; container.prepend(msgEl); setTimeout(() => msgEl.remove(), 4000); }
    document.getElementById('open-client-modal-btn').addEventListener('click', () => { const modal = document.getElementById('client-modal'); clientModalContent.innerHTML = `<div id="user-login-section"><form id="user-login-form" class="form-container"><h2 class="section-title" style="margin-bottom: 30px;"><span class="lang-en">Client Data Portal</span><span class="lang-hi">क्लाइंट डेटा पोर्टल</span></h2><div class="form-group"><label for="user-reg-id"><span class="lang-en">Enter Your Registration ID</span><span class="lang-hi">अपना रजिस्ट्रेशन आईडी डालें</span></label><input type="text" id="user-reg-id" required></div><button type="submit" class="btn" id="user-submit-btn"><span class="lang-en">Fetch My Data</span><span class="lang-hi">मेरा डेटा लाएं</span></button></form></div><div id="user-data-container" class="hidden" style="width:100%"></div>`; clientModalContent.querySelector('#user-login-form').addEventListener('submit', handleUserLogin); setLanguage(localStorage.getItem('language') || 'en'); showModal(modal); });
    document.getElementById('open-admin-modal-btn').addEventListener('click', () => { const modal = document.getElementById('admin-modal'); adminModalContent.innerHTML = `<div id="admin-login-section"><form id="admin-login-form" class="form-container"><h2 class="section-title" style="margin-bottom: 30px;"><span class="lang-en">Admin Panel</span><span class="lang-hi">एडमिन पैनल</span></h2><div class="form-group"><label for="admin-password"><span class="lang-en">Password</span><span class="lang-hi">पासवर्ड</span></label><input type="password" id="admin-password" required></div><button type="submit" class="btn"><span class="lang-en">Login</span><span class="lang-hi">लॉग इन करें</span></button></form></div><div id="admin-dashboard" class="hidden"></div>`; adminModalContent.querySelector('#admin-login-form').addEventListener('submit', handleAdminLogin); setLanguage(localStorage.getItem('language') || 'en'); showModal(modal); });
    async function handleUserLogin(e) { e.preventDefault(); const form = e.target; const regId = clientModalContent.querySelector('#user-reg-id').value.trim(); if (!regId) return; const btn = e.target.querySelector('button'); btn.disabled = true; btn.innerHTML = '<span class="lang-en">Fetching...</span><span class="lang-hi">लाया जा रहा है...</span>'; setLanguage(localStorage.getItem('language') || 'en'); try { const res = await fetch(`${SCRIPT_URL}?action=getUserData&regId=${encodeURIComponent(regId)}`); const result = await res.json(); if (result.success) { displayUserDataAndAgreement(result.data); } else { showMessage(result.message, 'error', form); clientModalContent.querySelector('#user-data-container').classList.add('hidden'); } } catch (err) { showMessage('An error occurred.', 'error', form); } finally { btn.disabled = false; btn.innerHTML = '<span class="lang-en">Fetch My Data</span><span class="lang-hi">मेरा डेटा लाएं</span>'; setLanguage(localStorage.getItem('language') || 'en'); } }
    function displayUserDataAndAgreement(data) {
        const container = clientModalContent.querySelector('#user-data-container');
        const clientName = data['Name'] || 'Client';
        const regId = data['REG. ID'] || 'N/A';
        const initial = clientName.charAt(0).toUpperCase();
        let profileHTML = `<div class="data-profile" id="profile-to-download"><div class="profile-header"><div class="profile-avatar">${initial}</div><div class="profile-info"><h2>${clientName}</h2><p>Registration ID: ${regId}</p></div></div><div class="profile-body"><div class="fields-grid">`;
        ALL_HEADERS.forEach(header => { const value = data[header]; if (value && value.toString().trim() !== '') { profileHTML += `<div class="field-item"><label>${header}</label><div class="value">${value}</div></div>`; } });
        profileHTML += `</div></div></div>`;
        const agreementContainerHTML = `<div id="agreement-wrapper"><div class="animated-agreement" id="agreement-to-download"><h2><span class="lang-en">Client Service Agreement</span><span class="lang-hi">क्लाइंट सेवा समझौता</span></h2><div id="agreement-text-content"></div></div><div class="agreement-actions hidden"><button class="btn" id="download-form-btn"><span class="lang-en">Download Form (PNG)</span></button><button class="btn" id="download-agreement-btn"><span class="lang-en">Download Agreement (PDF)</span></button><button class="btn" id="download-all-btn"><span class="lang-en">Download All (PDF)</span></button></div></div>`;
        container.innerHTML = profileHTML + agreementContainerHTML;
        container.classList.remove('hidden');
        clientModalContent.querySelector('#user-login-section').classList.add('hidden');
        startAgreementAnimation(data);
        setLanguage(localStorage.getItem('language') || 'en');
    }
    function startAgreementAnimation(data) {
        const clientName = data['Name'] || 'Client';
        const regId = data['REG. ID'] || 'N/A';
        const agreementId = `PM-${Date.now()}`;
        const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        const fullAgreementText = `Agreement ID: ${agreementId}\nClient Registration ID: ${regId}\nClient Name: ${clientName}\nDate of Agreement: ${today}\n\n1. Scope of Services: Prompt Minds agrees to provide the Client with a Premium Earning Website Package...\n\n2. Payment Terms: Client will pay 50% advance...\n\n3. Client Responsibilities: Client must provide accurate details...\n\n4. Service Provider Responsibilities: Prompt Minds will deliver the project within 7 working days...\n\n5. Confidentiality: Both parties agree that all shared data will remain confidential.\n\n6. Termination & Refund: The advance payment is non-refundable...\n\n7. Legal & Binding Agreement: This Agreement is legally binding...\n\nAuthorized By: Prompt Minds (Service Provider)\nAccepted By: ${clientName} (Client)`;
        const textElement = document.getElementById('agreement-text-content');
        const actions = document.querySelector('#agreement-wrapper .agreement-actions');
        let i = 0; const speed = 10;
        function typeWriter() {
            if (i < fullAgreementText.length) {
                textElement.innerHTML = fullAgreementText.substring(0, i + 1).replace(/\n/g, '<br>') + '<span class="cursor">&nbsp;</span>';
                i++; setTimeout(typeWriter, speed);
            } else {
                textElement.innerHTML = fullAgreementText.replace(/\n/g, '<br>');
                actions.classList.remove('hidden');
                document.getElementById('download-form-btn').addEventListener('click', () => downloadElementAs('profile-to-download', 'png', `PromptMinds_Form_${regId}`));
                document.getElementById('download-agreement-btn').addEventListener('click', () => downloadElementAs('agreement-to-download', 'pdf', `PromptMinds_Agreement_${regId}`));
                document.getElementById('download-all-btn').addEventListener('click', () => downloadCombined(`PromptMinds_Full_Package_${regId}`));
            }
        }
        typeWriter();
    }
    async function downloadElementAs(elementId, format, filename) {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById(elementId);
        const buttons = document.querySelectorAll('.agreement-actions .btn');
        buttons.forEach(btn => btn.disabled = true);
        const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim() });
        if (format === 'png') { const link = document.createElement('a'); link.download = `${filename}.png`; link.href = canvas.toDataURL('image/png'); link.click(); }
        else if (format === 'pdf') { const imgData = canvas.toDataURL('image/jpeg', 0.95); const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }); const pdfWidth = pdf.internal.pageSize.getWidth(); const imgProps = pdf.getImageProperties(imgData); const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight); pdf.save(`${filename}.pdf`); }
        buttons.forEach(btn => btn.disabled = false);
    }
    async function downloadCombined(filename) {
        const { jsPDF } = window.jspdf;
        const profileEl = document.getElementById('profile-to-download');
        const agreementEl = document.getElementById('agreement-to-download');
        const buttons = document.querySelectorAll('.agreement-actions .btn');
        buttons.forEach(btn => btn.disabled = true);
        const options = { scale: 3, useCORS: true, backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim() };
        const profileCanvas = await html2canvas(profileEl, options);
        const agreementCanvas = await html2canvas(agreementEl, options);
        const profileImgData = profileCanvas.toDataURL('image/jpeg', 0.95);
        const agreementImgData = agreementCanvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const addImageToPdf = (imgData, position) => { const imgProps = pdf.getImageProperties(imgData); const imgHeight = (imgProps.height * pdfWidth) / imgProps.width; let heightLeft = imgHeight; let tempPosition = 0; while (heightLeft > 0) { if(position + heightLeft > pageHeight) { pdf.addImage(imgData, 'JPEG', 0, -tempPosition, pdfWidth, imgHeight); pdf.addPage(); heightLeft -= (pageHeight - position); tempPosition += (pageHeight - position); position = 0; } else { pdf.addImage(imgData, 'JPEG', 0, position - tempPosition, pdfWidth, imgHeight); position += heightLeft; heightLeft = 0; } } return position; };
        let currentPosition = addImageToPdf(profileImgData, 0);
        if (currentPosition > 0) { currentPosition += 5; if(currentPosition >= pageHeight) { pdf.addPage(); currentPosition = 0; } }
        addImageToPdf(agreementImgData, currentPosition);
        pdf.save(`${filename}.pdf`);
        buttons.forEach(btn => btn.disabled = false);
    }
    async function handleAdminLogin(e) {
        e.preventDefault();
        const form = e.target;
        const passwordInput = adminModalContent.querySelector('#admin-password');
        const submittedPassword = passwordInput.value;
        const loginBtn = e.target.querySelector('button[type="submit"]');
        if (!submittedPassword) { showMessage('Password cannot be empty.', 'error', form); return; }
        loginBtn.disabled = true; loginBtn.innerHTML = '<span class="lang-en">Verifying...</span><span class="lang-hi">जाँच हो रही है...</span>'; setLanguage(localStorage.getItem('language') || 'en');
        try {
            const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'adminLogin', password: submittedPassword }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
            const result = await response.json();
            if (result.success) { adminModalContent.querySelector('#admin-login-section').classList.add('hidden'); adminModalContent.querySelector('#admin-dashboard').classList.remove('hidden'); loadAdminDashboard(); }
            else { showMessage('Incorrect Password.', 'error', form); passwordInput.value = ''; }
        } catch (error) { showMessage('Login failed. Please check your connection.', 'error', form); }
        finally { loginBtn.disabled = false; loginBtn.innerHTML = '<span class="lang-en">Login</span><span class="lang-hi">लॉग इन करें</span>'; setLanguage(localStorage.getItem('language') || 'en'); }
    }
    async function loadAdminDashboard() {
        const dashboard = adminModalContent.querySelector('#admin-dashboard');
        dashboard.innerHTML = `<p><span class="lang-en">Loading dashboard...</span><span class="lang-hi"> डैशबोर्ड लोड हो रहा है...</span></p>`;
        setLanguage(localStorage.getItem('language') || 'en');
        try {
            const [clientsRes, leadsRes] = await Promise.all([ fetch(`${SCRIPT_URL}?action=getAllUsers`), fetch(`${SCRIPT_URL}?action=getLeads`) ]);
            const clientsResult = await clientsRes.json();
            const leadsResult = await leadsRes.json();
            if (clientsResult.success && leadsResult.success) { renderDashboardContent(clientsResult.data, leadsResult.data); }
            else { throw new Error(clientsResult.message || leadsResult.message); }
        } catch (error) { dashboard.innerHTML = `<p style="color:var(--color-danger)">Failed to load dashboard: ${error.message}</p>`; }
    }
    function renderDashboardContent(clients, leads) {
        const dashboard = adminModalContent.querySelector('#admin-dashboard');
        let leadsHTML = `<div class="leads-container"><h3><span class="lang-en">New Enquiries / Leads</span><span class="lang-hi">नई पूछताछ / लीड्स</span> (${leads.length})</h3>`;
        if (leads.length > 0) { leads.forEach(lead => { const isNew = lead.Status === 'New'; const leadDate = new Date(lead.Timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short'}); leadsHTML += `<div class="lead-card ${isNew ? 'new-lead' : ''}"><div class="lead-header"><span class="lead-name">${lead.Name}</span><select class="lead-status-select" data-timestamp="${new Date(lead.Timestamp).toISOString()}"><option value="New" ${lead.Status === 'New' ? 'selected' : ''}>New</option><option value="Contacted" ${lead.Status === 'Contacted' ? 'selected' : ''}>Contacted</option><option value="Converted" ${lead.Status === 'Converted' ? 'selected' : ''}>Converted</option><option value="Closed" ${lead.Status === 'Closed' ? 'selected' : ''}>Closed</option></select></div><div class="lead-contact"><a href="mailto:${lead.Email}">${lead.Email}</a><span class="phone-container"><a href="tel:${lead.Phone}" class="lead-phone-number">${lead.Phone}</a><button class="copy-btn" data-phone="${lead.Phone}" title="Copy Number" aria-label="Copy phone number"><i class="fas fa-copy"></i></button></span><div class="lead-date">${leadDate}</div></div><div class="lead-message"><p>${lead.Message}</p></div></div>`; }); }
        else { leadsHTML += `<p><span class="lang-en">No new leads found.</span><span class="lang-hi">कोई नई लीड नहीं मिली।</span></p>`; }
        leadsHTML += `</div><hr style="border-color: var(--border-color); margin: 40px 0;">`;
        let clientsHTML = `<div class="admin-actions"><h3><span class="lang-en">All Clients (${clients.length})</span><span class="lang-hi">सभी क्लाइंट (${clients.length})</span></h3><button class="btn" id="add-user-btn" style="width:auto; padding: 10px 20px;"><span class="lang-en">+ Add New Client</span><span class="lang-hi">+ नया क्लाइंट जोड़ें</span></button></div><div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th><span class="lang-en">Name</span><span class="lang-hi">नाम</span></th><th><span class="lang-en">REG. ID</span><span class="lang-hi">रजि. आईडी</span></th><th><span class="lang-en">Domain</span><span class="lang-hi">डोमेन</span></th><th><span class="lang-en">Actions</span><span class="lang-hi">कार्रवाइयाँ</span></th></tr></thead><tbody>`;
        clients.forEach(user => { clientsHTML += `<tr><td>${user.Name || ''}</td><td>${user['REG. ID'] || ''}</td><td>${user.Domain || ''}</td><td><button class="action-btn edit-btn" data-regid="${user['REG. ID']}"><span class="lang-en">Edit</span><span class="lang-hi">संपादित करें</span></button><button class="action-btn delete-btn" data-regid="${user['REG. ID']}" data-name="${user.Name}"><span class="lang-en">Delete</span><span class="lang-hi">हटाएं</span></button></td></tr>`; });
        clientsHTML += `</tbody></table></div>`;
        dashboard.innerHTML = `<div class="admin-dashboard">${leadsHTML}${clientsHTML}</div>`;
        setLanguage(localStorage.getItem('language') || 'en');
        dashboard.querySelectorAll('.lead-status-select').forEach(select => select.addEventListener('change', handleLeadStatusChange));
        dashboard.querySelectorAll('.copy-btn').forEach(button => button.addEventListener('click', handleCopyClick));
        dashboard.querySelector('#add-user-btn').addEventListener('click', () => openEditModal());
        dashboard.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => { const userToEdit = clients.find(u => u['REG. ID'] === e.target.closest('.edit-btn').dataset.regid); openEditModal(userToEdit); }));
        dashboard.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => { const { regid, name } = e.target.closest('.delete-btn').dataset; showConfirmModal(`Are you sure you want to delete client "${name}" (${regid})?`, () => handleDelete(regid)); }));
    }
    function handleCopyClick(e) { const button = e.currentTarget; const phoneToCopy = button.dataset.phone; const phoneLink = button.previousElementSibling; const icon = button.querySelector('i'); if (!navigator.clipboard) { alert("Clipboard API not supported."); return; } navigator.clipboard.writeText(phoneToCopy).then(() => { phoneLink.classList.add('copied'); icon.className = 'fas fa-check'; button.style.color = 'var(--color-secondary)'; setTimeout(() => { icon.className = 'fas fa-copy'; button.style.color = ''; }, 2000); }).catch(err => { console.error('Failed to copy text: ', err); alert('Could not copy.'); }); }
    async function handleLeadStatusChange(e) {
        const select = e.target; const timestamp = select.dataset.timestamp; const status = select.value; select.disabled = true;
        try {
            const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'updateLeadStatus', timestamp, status }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
            const result = await response.json(); if (!result.success) throw new Error(result.message);
            const card = select.closest('.lead-card'); if (status === 'New') card.classList.add('new-lead'); else card.classList.remove('new-lead');
        } catch (error) { alert(`Error updating status: ${error.message}`); loadAdminDashboard(); }
        finally { select.disabled = false; }
    }
    function openEditModal(user = null) { const modal = document.getElementById('edit-modal'); modalTitle.innerHTML = user ? `<span class="lang-en">Edit ${user.Name}</span><span class="lang-hi">${user.Name} संपादित करें</span>` : '<span class="lang-en">Add New Client</span><span class="lang-hi">नया क्लाइंट जोड़ें</span>'; let formContent = '<div class="fields-grid" style="max-height: 60vh; overflow-y: auto; padding-right: 15px;">'; ALL_HEADERS.forEach(header => { const value = user ? user[header] || '' : ''; const isReadOnly = (header === 'REG. ID' && user); formContent += `<div class="form-group"><label>${header}</label><input type="text" name="${header}" value="${value}" ${isReadOnly ? 'readonly' : ''}></div>`; }); formContent += `</div><button type="submit" class="btn" style="width:100%; margin-top:20px;">${user ? '<span class="lang-en">Save Changes</span><span class="lang-hi">बदलाव सहेजें</span>' : '<span class="lang-en">Add Client</span><span class="lang-hi">क्लाइंट जोड़ें</span>'}</button>`; editForm.innerHTML = formContent; setLanguage(localStorage.getItem('language') || 'en'); showModal(modal); }
    editForm.addEventListener('submit', async (e) => { e.preventDefault(); const btn = editForm.querySelector('button[type="submit"]'); btn.disabled = true; const formData = new FormData(editForm); const data = Object.fromEntries(formData.entries()); const action = (modalTitle.textContent.startsWith('Edit')) ? 'editUser' : 'addUser'; try { const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action, data }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); const result = await response.json(); if(result.success) { hideModal(document.getElementById('edit-modal')); showMessage(result.message, 'success', adminModalContent.querySelector('#admin-dashboard')); loadAdminDashboard(); } else { throw new Error(result.message); } } catch (error) { alert(error.message); } finally { btn.disabled = false; } });
    function showConfirmModal(text, onConfirm) { const modal = document.getElementById('confirm-modal'); const confirmText = document.getElementById('confirm-text'); const confirmYesBtn = document.getElementById('confirm-yes-btn'); confirmText.textContent = text; const newYesBtn = confirmYesBtn.cloneNode(true); confirmYesBtn.parentNode.replaceChild(newYesBtn, confirmYesBtn); newYesBtn.addEventListener('click', () => { onConfirm(); hideModal(modal); }); document.getElementById('confirm-no-btn').onclick = () => hideModal(modal); showModal(modal); }
    async function handleDelete(regId) { try { const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'deleteUser', regId }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); const result = await response.json(); if (result.success) { showMessage(result.message, 'success', adminModalContent.querySelector('#admin-dashboard')); loadAdminDashboard(); } else { throw new Error(result.message); } } catch (error) { showMessage(error.message, 'error', adminModalContent.querySelector('#admin-dashboard')); } }
    
    // --- Welcome Screen & Voice Assistant ---
    const getStartedBtn = document.getElementById('get-started-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    const initialThemeIsDark = document.documentElement.dataset.theme === 'dark';
    startWelcomeVanta(initialThemeIsDark);

    getStartedBtn.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.visibility = 'hidden';
        setTimeout(() => {
            document.querySelector('header').style.display = 'block'; document.querySelector('header .header-container').style.display = 'flex'; 
            document.querySelector('main').style.display = 'block'; document.querySelector('footer').style.display = 'block';
            document.getElementById('voice-assistant-btn').style.display = 'flex'; document.getElementById('chatbot-toggle').style.display = 'flex';
            
            const currentTheme = localStorage.getItem('theme') || 'dark';
            setTheme(currentTheme);
            
            startVantaBackground(currentTheme === 'dark');
            
            typewriterEffect();
            toggleSpeech(); 

            if(welcomeVantaEffect) {
                welcomeVantaEffect.destroy();
                welcomeVantaEffect = null;
            }
        }, 600); 
        setTimeout(() => welcomeScreen && welcomeScreen.remove(), 1000);
    });

    let utterance = null; let isSpeechInitialized = false;
    function initializeSpeech() {
        if (isSpeechInitialized || !('speechSynthesis' in window)) return;
        const hindiText = `ज़रा सोचिए… सुबह उठकर job पर जाना, दिनभर मेहनत करना, लेकिन महीने के आखिर में फिर भी पैसों की तंगी होना। और अब ऊपर से ये डर – कि AI हर जगह job replace कर रहा है। आज bank में, कल hospital में… और शायद परसों आपके office में। हो सकता है, आपकी job भी risk पर हो। सच कहें, आने वाले सालों में अगर आपके पास अपना Online Earning Source नहीं हुआ, तो survive करना बहुत मुश्किल होगा। लेकिन… यहीं से असली बदलाव शुरू होता है। क्योंकि अब आपके पास मौका है AI से डरने का नहीं, बल्कि AI का इस्तेमाल करके अपनी कमाई बढ़ाने का। और यही काम हम करते हैं Prompt Minds में। सिर्फ़ 7 दिनों में हम आपके लिए बनाएंगे एक Highly Animated, Ultra Premium Website, जो न सिर्फ़ सुंदर दिखेगी, बल्कि आपको रोज़ाना visitors और income दिलाएगी। और सबसे बड़ी बात? ये कोई आम website नहीं होगी। क्योंकि हमारी Team में भारत के Top Engineering Colleges के High-Quality Engineers हैं, जो आपके लिए एकदम World-Class Website design करेंगे। इसमें होगा सब कुछ – Free Premium .com Domain, Ultra Modern Branding, Full SEO Setup, Google Ads Approval, और Secret Earning Strategies। और हाँ, जब तक आपकी साइट पर 500+ Visitors नहीं आते, आपको पूरा payment करने की ज़रूरत ही नहीं। मतलब – result guaranteed. सोचिए ज़रा… जब लोग आपकी Website देखेंगे, तो कहेंगे – “ये तो किसी बड़ी international company की लगती है!” और आप मुस्कुराकर कहेंगे – “Yes, this is my earning website – powered by Prompt Minds.” लेकिन याद रखिए – ऐसा मौका हर किसी को नहीं मिलता। Slots Limited हैं, और हम हर Client को एकदम Premium dedication के साथ serve करते हैं। तो अगर आप चाहते हैं कि कल जब AI jobs replace करे, आपके पास अपना strong earning source पहले से हो, तो आज ही कदम उठाइए। Ab agar aap bhi aisi hi ek powerful website banwana chahte hain, to neeche diye gaye form ko bharein. Hamare founder, Abhinav Kumar, aapse khud call karke baat karenge aur aapke vision ko samjhenge. Dhanyavaad.`;
        utterance = new SpeechSynthesisUtterance(hindiText.replace(/\s+/g, ' ').trim());
        utterance.lang = 'hi-IN'; utterance.rate = 0.9; utterance.pitch = 1.0;
        const setVoice = () => { const voices = speechSynthesis.getVoices(); let bestVoice = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google')) || voices.find(v => v.lang === 'hi-IN'); if (bestVoice) utterance.voice = bestVoice; };
        if (speechSynthesis.getVoices().length) setVoice(); else speechSynthesis.onvoiceschanged = setVoice;
        const voiceIcon = document.querySelector('#voice-assistant-btn i');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
        utterance.onstart = () => { voiceIcon.className = 'fas fa-stop-circle'; stopVoiceBtn.style.display = 'inline-flex'; };
        utterance.onend = () => { voiceIcon.className = 'fas fa-microphone'; stopVoiceBtn.style.display = 'none'; };
        utterance.onerror = () => { voiceIcon.className = 'fas fa-microphone'; stopVoiceBtn.style.display = 'none'; };
        isSpeechInitialized = true;
    }
    function toggleSpeech() { if (!isSpeechInitialized) initializeSpeech(); if (speechSynthesis.speaking) { speechSynthesis.cancel(); } else if (utterance) { speechSynthesis.speak(utterance); } }
    document.getElementById('voice-assistant-btn').addEventListener('click', toggleSpeech);
    document.getElementById('stop-voice-btn').addEventListener('click', () => { if (speechSynthesis.speaking) speechSynthesis.cancel(); });
    window.addEventListener('beforeunload', () => { if (speechSynthesis.speaking) speechSynthesis.cancel(); });

    // --- Testimonial Slider & Review Logic ---
    let testimonialSliderControls;
    async function loadReviews() {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getReviews`);
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                testimonials = result.data.length > 0 ? result.data : [{ name: "Prompt Minds", location: "India", rating: 5, review: "Be the first to share your experience with us!" }];
            } else {
                console.error("Failed to load reviews:", result.message);
                testimonials = [{ name: "Error", location: "Could not load reviews", rating: 0, review: "Please check the connection or Apps Script setup." }];
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            testimonials = [{ name: "Error", location: "Network error", rating: 0, review: "Could not connect to the server to fetch reviews." }];
        } finally {
            testimonialSliderControls = initTestimonialSlider();
        }
    }
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        const dotsContainer = document.getElementById('testimonial-dots');
        let currentIndex = 0, cards = [], dots = [], startX = 0, currentX = 0, isDragging = false;
        function createStars(rating) { let stars = ''; for (let i = 0; i < 5; i++) { stars += `<i class="fas fa-star${i < rating ? '' : '-regular'}" style="color: #f1c40f;"></i>`; } return stars; }
        function createTestimonialCard(t) { const card = document.createElement('div'); card.className = 'testimonial-card'; card.innerHTML = `<img src="https://placehold.co/80x80/${getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').substring(1)}/${getComputedStyle(document.documentElement).getPropertyValue('--color-text').substring(1)}?text=${encodeURIComponent(t.name.charAt(0))}" alt="${t.name}"><p class="name">${t.name}</p><p class="location">${t.location}</p><div class="rating">${createStars(t.rating)}</div><p class="review-text">"${t.review}"</p>`; return card; }
        function populateSlider() {
            slider.innerHTML = ''; dotsContainer.innerHTML = '';
            if (!testimonials || testimonials.length === 0) { slider.innerHTML = `<div class="testimonial-card active" style="opacity:1; transform: none;"><p>No reviews available yet.</p></div>`; return; }
            testimonials.forEach((t, index) => { slider.appendChild(createTestimonialCard(t)); const dot = document.createElement('span'); dot.className = 'dot'; dot.dataset.index = index; dotsContainer.appendChild(dot); });
            cards = document.querySelectorAll('.testimonial-card'); dots = document.querySelectorAll('.dot');
            updateSlider();
        }
        function updateSlider() {
            if (!cards.length) return;
            cards.forEach((card, index) => { card.classList.remove('active', 'prev', 'next'); if (index === currentIndex) card.classList.add('active'); else if (index === currentIndex - 1) card.classList.add('prev'); else if (index === currentIndex + 1) card.classList.add('next'); });
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) dots[currentIndex].classList.add('active');
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === testimonials.length - 1;
        }
        function slide(direction) { if (direction === 'next' && currentIndex < testimonials.length - 1) currentIndex++; else if (direction === 'prev' && currentIndex > 0) currentIndex--; updateSlider(); }
        nextBtn.addEventListener('click', () => slide('next'));
        prevBtn.addEventListener('click', () => slide('prev'));
        dotsContainer.addEventListener('click', (e) => { if (e.target.classList.contains('dot')) { currentIndex = parseInt(e.target.dataset.index); updateSlider(); } });
        const handleDragStart = (e) => { isDragging = true; startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX; };
        const handleDragMove = (e) => { if (isDragging) currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX; };
        const handleDragEnd = (e) => { if (!isDragging) return; isDragging = false; const endX = e.type === 'touchend' ? currentX : e.clientX; const diff = endX - startX; if (Math.abs(diff) > 50) { if (diff < 0) slide('next'); else slide('prev'); }};
        slider.addEventListener('mousedown', handleDragStart); slider.addEventListener('mousemove', handleDragMove); slider.addEventListener('mouseup', handleDragEnd); slider.addEventListener('mouseleave', handleDragEnd);
        slider.addEventListener('touchstart', handleDragStart, { passive: true }); slider.addEventListener('touchmove', handleDragMove, { passive: true }); slider.addEventListener('touchend', handleDragEnd);
        populateSlider();
        return { populateSlider };
    }
    
    // --- On-Page Review Form Logic ---
    const reviewFormPage = document.getElementById('review-form-page');
    const starsPage = document.querySelectorAll('#review-stars-page .fa-star');
    const ratingInputPage = document.getElementById('review-rating-page');
    const reviewMessageArea = document.getElementById('review-message-area');
    function setPageStars(value) { ratingInputPage.value = value; starsPage.forEach((star, index) => star.classList.toggle('selected', index < value)); }
    setPageStars(0); 
    starsPage.forEach(star => { const starValue = parseInt(star.dataset.value); star.addEventListener('mouseover', () => starsPage.forEach((s, i) => s.classList.toggle('hovered', i < starValue))); star.addEventListener('mouseout', () => starsPage.forEach(s => s.classList.remove('hovered'))); star.addEventListener('click', () => setPageStars(starValue)); });
    reviewFormPage.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (parseInt(ratingInputPage.value) === 0) { reviewMessageArea.innerHTML = `<div class="message error">Please select a rating of at least 1 star.</div>`; setTimeout(() => { reviewMessageArea.innerHTML = ''; }, 4000); return; }
        const btn = reviewFormPage.querySelector('button[type="submit"]');
        const btnOriginalText = btn.innerHTML;
        btn.disabled = true; btn.innerHTML = 'Submitting...';
        const newReview = { name: document.getElementById('review-name-page').value, location: document.getElementById('review-location-page').value, rating: parseInt(ratingInputPage.value), review: document.getElementById('review-text-page').value };
        try {
            const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'addReview', data: newReview }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
            const result = await response.json();
            if(result.success) { reviewMessageArea.innerHTML = `<div class="message success">${result.message}</div>`; reviewFormPage.reset(); setPageStars(0); } else { throw new Error(result.message); }
        } catch(error) {
            reviewMessageArea.innerHTML = `<div class="message error">Could not submit review: ${error.message}</div>`;
        } finally {
            btn.disabled = false; btn.innerHTML = btnOriginalText;
            setTimeout(() => { reviewMessageArea.innerHTML = ''; }, 5000);
        }
    });

    // --- AI Chatbot Logic ---
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotForm = document.querySelector('.chatbot-input-form');
    const chatbotInput = document.getElementById('chatbot-input');
    chatbotToggle.addEventListener('click', () => { chatbotContainer.classList.toggle('visible'); });
    chatbotForm.addEventListener('submit', (e) => { e.preventDefault(); const userInput = chatbotInput.value.trim(); if (userInput) { addMessage(userInput, 'user'); chatbotInput.value = ''; getBotResponse(userInput); } });
    function addMessage(text, sender, isTyping = false) { const messageElement = document.createElement('div'); messageElement.className = `chat-message ${sender}`; if (isTyping) { messageElement.classList.add('typing'); messageElement.innerHTML = '<span></span><span></span><span></span>'; } else { messageElement.textContent = text; } chatbotMessages.appendChild(messageElement); chatbotMessages.scrollTop = chatbotMessages.scrollHeight; return messageElement; }
    function speakText(text) { if ('speechSynthesis' in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'hi-IN'; utterance.rate = 0.9; const voices = speechSynthesis.getVoices(); let bestVoice = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google')) || voices.find(v => v.lang === 'hi-IN'); if(bestVoice) utterance.voice = bestVoice; speechSynthesis.speak(utterance); } }
    function getBotResponse(userInput) {
        const typingIndicator = addMessage('', 'bot', true);
        const knowledgeBase = {
            "hello|hi|hey|namaste|salaam": "Namaste! Main PROMPT MINDS ke dwara banaya gya AI hoon, aapki AI assistant. Main aapki kaise sahayata kar sakti hoon?",
            "kaise ho|kya haal|kya hal": "Main PROMPT MINDS ke dwara banaya gya AI hoon, main aapke liye kya kar sakti hoon?",
            "aapka naam|who are you|tum kon ho": "Mera naam Mindy hai. Main Prompt Minds ki AI assistant hoon, jo aapke sawalon ka jawab dene ke liye yahan hai.",
            "prompt minds kya hai|company kya karti hai": "Prompt Minds ek web design aur AI solutions company hai. Hum businesses ke liye high-quality, professional websites banate hain jo unhe grow karne mein madad karti hain.",
            "founder kon hai|owner kon hai": "Prompt Minds ke founder Abhinav Kumar hain. Woh khud clients se direct baat karke unke project ko samajhte hain.",
            "thank you|dhanyavad|shukriya": "Aapka swagat hai! Aur koi sawaal ho toh zaroor poochein.", "ok|theek hai": "Great! Aur kuch janna chahenge aap?",
            "payment|price|cost|kitna lagega|kitne paise|charge|kharcha|rate": "Pricing ke baare mein detail se baat karne ke liye, please neeche diye gaye contact form ko bharein ya business.newviral@gmail.com par email karein. Hamare founder, Abhinav Kumar, aapse direct call par baat karke aapke project ke hisaab se best price batayenge.",
            "payment terms|paise kaise dene hai": "Hum 50% advance payment lete hain project shuru karne ke liye. Baaki 50% payment tab dena hota hai jab aapki website par 500 visitors aa jaate hain ya 2 mahine poore ho jaate hain, jo bhi pehle ho.",
            "advance kitna hai": "Project shuru karne ke liye 50% advance payment ki zaroorat hoti hai.",
            "kya karte ho|service|kya banate ho|kya kaam karte ho": "Hum high-quality, custom-designed websites banate hain. Hamari services mein custom design, .com domain, SEO setup, custom tools, logo design, aur ad platform assistance shaamil hai.",
            "website design|website banate ho": "Haan, hum world-class website design karte hain. Aapko ek unique aur professional look wali website milegi jo aapke brand ko represent karegi.",
            "seo|ranking|google me kaise aayega": "Yes, hum complete SEO setup karte hain, jismein on-page, off-page, aur technical SEO shaamil hai. Hum aapki site ko Google Search Console par bhi verify karte hain taaki aapki site Google par rank kar sake.",
            "domain|hosting": "Hum aapke package mein ek professional .com custom domain name ka registration aur setup karke dete hain. Hum Blogger platform ka istemal karte hain, jismein Google ki free aur reliable hosting shaamil hoti hai.",
            "logo|graphics|animation": "Haan, hum aapke brand ke liye ek custom logo design karte hain. Saath hi, website ko attractive banane ke liye high-quality graphics aur animations bhi banate hain.",
            "adsense|earning|kamai kaise hogi": "Hum aapki website ko Google AdSense ya dusre ad platforms ke liye apply karne mein help karte hain. Hum site ko unki policies ke hisaab se taiyar karte hain jisse approval ke chance badh jaate hain.",
            "custom tools|features": "Aapki zaroorat ke hisaab se hum website mein custom tools aur features bhi integrate karte hain.",
            "time kitna lagega|kitne din me banega|timeline": "Aapka domain 24-48 ghanto mein ready ho jaata hai. Poori website 7 working days ke andar deliver kar di jaati hai, bas aapki taraf se saari zaroori jaankari time par milni chahiye.",
            "process kya hai|kaise shuru karein": "Shuru karne ke liye, aapko contact form bharna hoga. Uske baad hamare founder aapse call par baat karke aage ka process samjhayenge.",
            "kya kya dena hoga|content": "Aapko website ka content, jaise ki text aur aapke brand ki details, time par provide karna hoga. Content ke copyright ki zimmedari aapki hogi.",
            "ownership|malik kon hoga": "Poori payment ke baad, website aur domain ke 100% maalik aap honge. Saare rights aapko transfer kar diye jaate hain.",
            "cancel|refund": "Agar aap project shuru hone ke baad cancel karte hain, to advance payment non-refundable hota hai. Lekin agar hum time par project deliver nahi kar paate, to aapko advance ka poora refund milega.",
            "contact|baat kaise karein|number": "Aap humse contact form bhar kar ya business.newviral@gmail.com par email karke jud sakte hain. Form bharne par hamare founder aapse direct call karenge."
        };
        let userInputClean = userInput.toLowerCase().trim(); let botResponse = "Iske baare mein mujhe theek se jaankari nahi hai. Behtar hoga aap contact form fill kar dein, hamare founder aapse direct call par baat karke saari details de denge. Dhanyavaad!"; let bestMatchScore = 0;
        for (const key in knowledgeBase) { const keywords = key.split('|'); let currentScore = 0; keywords.forEach(keyword => { if (userInputClean.includes(keyword)) currentScore++; }); if (currentScore > bestMatchScore) { bestMatchScore = currentScore; botResponse = knowledgeBase[key]; } }
        setTimeout(() => { typingIndicator.remove(); addMessage(botResponse, 'bot'); speakText(botResponse); }, 1000 + Math.random() * 500);
    }

    // --- Load Page Content (for Modals) ---
    const pageContents = {
        'about': {
            en: `<h1>About Us: Prompt Minds</h1><p><strong>Welcome to the Digital Frontier!</strong></p><p>Prompt Minds is not just a web development company; we are your digital partners. In today's fast-paced online environment, where every business wants to carve out a unique identity, we transform your vision into a real, powerful, and result-driven website. Our name, 'Prompt Minds', reflects our work ethic - we think fast, embrace the latest technology, and create solutions that propel your business forward.</p><h2>Our Mission: Your Digital Success</h2><p>Our mission is crystal clear: to provide every business, big or small, with an online presence that not only looks professional but also generates real business for them. We believe a website is more than just an online address; it's the voice of your brand, your 24/7 sales representative, and a symbol of trust for your customers. We use a perfect blend of design, technology, and business strategy to fulfill this mission.</p><h2>Why We Are Different: The Prompt Minds Advantage</h2><p>To stand out from the crowd, you need to do something special. At Prompt Minds, we operate on a few core principles that set us apart:</p><ul><li><strong>Engineering Excellence:</strong> Our team consists of high-quality engineers from India's top engineering colleges. This means your website will not only be beautiful but also technically robust, secure, and super-fast. We see code as an art form - clean, efficient, and future-proof.</li><li><strong>Client-Centric Approach:</strong> We don't believe in a "one size fits all" solution. Before starting any project, we deeply understand your business, your goals, and your target audience. Our founder, Abhinav Kumar, personally communicates with you to ensure your vision is 100% clear.</li><li><strong>AI-Powered Innovation:</strong> We don't just build websites; we create future-ready digital assets. We use Artificial Intelligence (AI) to integrate smart features into your website, such as AI chatbots, personalized user experiences, and data analysis tools. This keeps you one step ahead of your competitors.</li><li><strong>Result-Guaranteed Model:</strong> We have complete confidence in our work. That's why we offer a unique payment model. You start the project with a 50% advance, and you only pay the rest after we bring at least 500 visitors to your website. This is our commitment to delivering not just a website, but results.</li></ul><h2>Our Team: The Wizards of Technology</h2><p>A great company is built by its people. Our team is a group of passionate developers, creative designers, and sharp-minded strategists. We are all united by one thing - a passion for solving complex problems with simple, elegant solutions. We stay updated with the latest trends in technology so that your website is always modern and competitive.</p><h2>Our Vision: Democratizing Digital Growth</h2><p>Our long-term vision is to make high-quality digital solutions accessible to every business in India and beyond. We want to empower entrepreneurs and small businesses to compete with big corporations on a level playing field. With a powerful online presence, any business can reach a global audience. We are here to make that happen. Join us on this journey, and let's build your digital future together.</p>`,
            hi: `<h1>हमारे बारे में: प्रॉम्प्ट माइंड्स</h1><p><strong>डिजिटल दुनिया में आपका स्वागत है!</strong></p><p>प्रॉम्प्ट माइंड्स सिर्फ एक वेब डेवलपमेंट कंपनी नहीं है; हम आपके डिजिटल पार्टनर हैं। आज के तेजी से बदलते ऑनलाइन माहौल में, जहाँ हर व्यवसाय अपनी एक अलग पहचान बनाना चाहता है, हम आपके विजन को एक वास्तविक, शक्तिशाली और परिणाम-उन्मुख वेबसाइट में बदलते हैं। हमारा नाम, 'प्रॉम्प्ट माइंड्स', हमारी कार्यशैली को दर्शाता है - हम तेजी से सोचते हैं, नवीनतम तकनीक को अपनाते हैं, और ऐसे समाधान बनाते हैं जो आपके व्यवसाय को आगे बढ़ाते हैं।</p><h2>हमारा मिशन: आपकी डिजिटल सफलता</h2><p>हमारा मिशन बिल्कुल स्पष्ट है: हर व्यवसाय को, चाहे वह बड़ा हो या छोटा, एक ऐसी ऑनलाइन उपस्थिति प्रदान करना जो न केवल पेशेवर दिखे, बल्कि उनके लिए वास्तविक व्यवसाय भी उत्पन्न करे। हमारा मानना है कि एक वेबसाइट सिर्फ एक ऑनलाइन पते से कहीं बढ़कर है; यह आपके ब्रांड की आवाज़ है, आपका 24/7 बिक्री प्रतिनिधि है, और आपके ग्राहकों के लिए विश्वास का प्रतीक है। हम इस मिशन को पूरा करने के लिए डिजाइन, प्रौद्योगिकी और व्यावसायिक रणनीति का एक आदर्श मिश्रण उपयोग करते हैं।</p><h2>हम अलग क्यों हैं: प्रॉम्प्ट माइंड्स का फायदा</h2><p>भीड़ से अलग दिखने के लिए, आपको कुछ खास करना होगा। प्रॉम्प्ट माइंड्स में, हम कुछ मूल सिद्धांतों पर काम करते हैं जो हमें दूसरों से अलग बनाते हैं:</p><ul><li><strong>इंजीनियरिंग उत्कृष्टता:</strong> हमारी टीम में भारत के शीर्ष इंजीनियरिंग कॉलेजों के उच्च-गुणवत्ता वाले इंजीनियर शामिल हैं। इसका मतलब है कि आपकी वेबसाइट न केवल सुंदर होगी, बल्कि तकनीकी रूप से मजबूत, सुरक्षित और सुपर-फास्ट भी होगी। हम कोड को एक कला के रूप में देखते हैं - स्वच्छ, कुशल और भविष्य के लिए तैयार।</li><li><strong>ग्राहक-केंद्रित दृष्टिकोण:</strong> हम "एक ही समाधान सबके लिए" में विश्वास नहीं करते। किसी भी प्रोजेक्ट को शुरू करने से पहले, हम आपके व्यवसाय, आपके लक्ष्यों और आपके लक्षित दर्शकों को गहराई से समझते हैं। हमारे संस्थापक, अभिनव कुमार, यह सुनिश्चित करने के लिए व्यक्तिगत रूप से आपसे संवाद करते हैं कि आपका विजन 100% स्पष्ट हो।</li><li><strong>AI-संचालित नवाचार:</strong> हम सिर्फ वेबसाइट नहीं बनाते; हम भविष्य के लिए तैयार डिजिटल संपत्ति बनाते हैं। हम आपकी वेबसाइट में स्मार्ट सुविधाएँ एकीकृत करने के लिए आर्टिफिशियल इंटेलिजेंस (AI) का उपयोग करते हैं, जैसे कि AI चैटबॉट, व्यक्तिगत उपयोगकर्ता अनुभव, और डेटा विश्लेषण उपकरण। यह आपको अपने प्रतिस्पर्धियों से एक कदम आगे रखता है।</li><li><strong>परिणाम-गारंटी मॉडल:</strong> हमें अपने काम पर पूरा भरोसा है। इसीलिए हम एक अनूठा भुगतान मॉडल प्रदान करते हैं। आप 50% अग्रिम भुगतान के साथ प्रोजेक्ट शुरू करते हैं, और बाकी का भुगतान आप तभी करते हैं जब हम आपकी वेबसाइट पर कम से कम 500 विज़िटर ले आते हैं। यह सिर्फ एक वेबसाइट ही नहीं, बल्कि परिणाम देने की हमारी प्रतिबद्धता है।</li></ul><h2>हमारी टीम: प्रौद्योगिकी के जादूगर</h2><p>एक महान कंपनी उसके लोगों से बनती है। हमारी टीम उत्साही डेवलपर्स, रचनात्मक डिजाइनरों और तेज दिमाग वाले रणनीतिकारों का एक समूह है। हम सभी एक चीज से एकजुट हैं - सरल, सुंदर समाधानों के साथ जटिल समस्याओं को हल करने का जुनून। हम प्रौद्योगिकी के नवीनतम रुझानों से अपडेट रहते हैं ताकि आपकी वेबसाइट हमेशा आधुनिक और प्रतिस्पर्धी बनी रहे।</p><h2>हमारा विजन: डिजिटल विकास का लोकतंत्रीकरण</h2><p>हमारा दीर्घकालिक विजन भारत और उसके बाहर हर व्यवसाय के लिए उच्च-गुणवत्ता वाले डिजिटल समाधानों को सुलभ बनाना है। हम उद्यमियों और छोटे व्यवसायों को बड़ी कंपनियों के साथ एक समान स्तर पर प्रतिस्पर्धा करने के लिए सशक्त बनाना चाहते हैं। एक शक्तिशाली ऑनलाइन उपस्थिति के साथ, कोई भी व्यवसाय वैश्विक दर्शकों तक पहुंच सकता है। हम इसे संभव बनाने के लिए यहां हैं। इस यात्रा में हमारे साथ शामिल हों, और चलिए मिलकर आपके डिजिटल भविष्य का निर्माण करें।</p>`
        },
        'privacy': {
            en: `<h1>Privacy Policy for Prompt Minds</h1><p><em>Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p><p>Prompt Minds ("we," "us," or "our") operates the promptminds.in website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p><p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used have the same meanings as in our Terms and Service.</p><h2>1. Information Collection and Use</h2><p>We collect several different types of information for various purposes to provide and improve our Service to you.</p><h3>Types of Data Collected:</h3><ul><li><strong>Personal Data:</strong> While using our Service, especially through our contact form, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Name, Email address, Phone number, and Project Details.</li><li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</li><li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</li></ul><h2>2. Use of Data</h2><p>Prompt Minds uses the collected data for various purposes:</p><ul><li>To provide, maintain, and improve our Service.</li><li>To respond to your inquiries and provide customer support.</li><li>To communicate with you about your project or our services.</li><li>To provide analysis or valuable information so that we can improve the Service.</li><li>To monitor the usage of the Service.</li><li>To detect, prevent and address technical issues.</li></ul><h2>3. Data Security</h2><p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p><h2>4. Data Disclosure</h2><p>We will not sell, rent, or trade your Personal Data to third parties. We may disclose your Personal Data in the good faith belief that such action is necessary to:</p><ul><li>To comply with a legal obligation.</li><li>To protect and defend the rights or property of Prompt Minds.</li><li>To prevent or investigate possible wrongdoing in connection with the Service.</li><li>To protect the personal safety of users of the Service or the public.</li></ul><h2>5. Links to Other Sites</h2><p>Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p><h2>6. Children's Privacy</h2><p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p><h2>7. Changes to This Privacy Policy</h2><p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p><h2>8. Contact Us</h2><p>If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:business.newviral@gmail.com">business.newviral@gmail.com</a></p>`,
            hi: `<h1>प्रॉम्प्ट माइंड्स के लिए गोपनीयता नीति</h1><p><em>अंतिम अपडेट: ${new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p><p>प्रॉम्प्ट माइंड्स ("हम," "हमें," या "हमारा") promptminds.in वेबसाइट ("सेवा") का संचालन करता है। यह पृष्ठ आपको हमारी सेवा का उपयोग करते समय व्यक्तिगत डेटा के संग्रह, उपयोग और प्रकटीकरण के बारे में हमारी नीतियों और उस डेटा से जुड़े आपके विकल्पों के बारे में सूचित करता है।</p><p>हम आपकी सेवा प्रदान करने और बेहतर बनाने के लिए आपके डेटा का उपयोग करते हैं। सेवा का उपयोग करके, आप इस नीति के अनुसार जानकारी के संग्रह और उपयोग के लिए सहमत हैं। जब तक इस गोपनीयता नीति में अन्यथा परिभाषित न किया गया हो, उपयोग किए गए शब्दों का वही अर्थ है जो हमारी सेवा की शर्तों में है।</p><h2>1. सूचना संग्रह और उपयोग</h2><p>हम आपको हमारी सेवा प्रदान करने और बेहतर बनाने के लिए विभिन्न उद्देश्यों के लिए कई अलग-अलग प्रकार की जानकारी एकत्र करते हैं।</p><h3>एकत्रित डेटा के प्रकार:</h3><ul><li><strong>व्यक्तिगत डेटा:</strong> हमारी सेवा का उपयोग करते समय, विशेष रूप से हमारे संपर्क फ़ॉर्म के माध्यम से, हम आपसे कुछ व्यक्तिगत रूप से पहचानी जाने वाली जानकारी प्रदान करने के लिए कह सकते हैं जिसका उपयोग आपसे संपर्क करने या पहचानने के लिए किया जा सकता है ("व्यक्तिगत डेटा")। इसमें शामिल हो सकते हैं, लेकिन यह इन्हीं तक सीमित नहीं है: नाम, ईमेल पता, फ़ोन नंबर, और प्रोजेक्ट विवरण।</li><li><strong>उपयोग डेटा:</strong> हम यह भी जानकारी एकत्र कर सकते हैं कि सेवा तक कैसे पहुँचा और उसका उपयोग किया जाता है ("उपयोग डेटा")। इस उपयोग डेटा में आपके कंप्यूटर का इंटरनेट प्रोटो콜 पता (जैसे, आईपी पता), ब्राउज़र का प्रकार, ब्राउज़र संस्करण, हमारी सेवा के वे पृष्ठ जिन्हें आप देखते हैं, आपकी यात्रा का समय और तारीख, उन पृष्ठों पर बिताया गया समय, अद्वितीय डिवाइस पहचानकर्ता, और अन्य नैदानिक डेटा जैसी जानकारी शामिल हो सकती है।</li><li><strong>ट्रैकिंग और कुकीज़ डेटा:</strong> हम अपनी सेवा पर गतिविधि को ट्रैक करने और कुछ जानकारी रखने के लिए कुकीज़ और समान ट्रैकिंग तकनीकों का उपयोग करते हैं। कुकीज़ छोटी मात्रा में डेटा वाली फाइलें होती हैं जिनमें एक अनाम अद्वितीय पहचानकर्ता शामिल हो सकता है। आप अपने ब्राउज़र को सभी कुकीज़ को अस्वीकार करने या कुकी भेजे जाने पर इंगित करने का निर्देश दे सकते हैं। हालाँकि, यदि आप कुकीज़ स्वीकार नहीं करते हैं, तो आप हमारी सेवा के कुछ हिस्सों का उपयोग करने में सक्षम नहीं हो सकते हैं।</li></ul><h2>2. डेटा का उपयोग</h2><p>प्रॉम्प्ट माइंड्स विभिन्न उद्देश्यों के लिए एकत्रित डेटा का उपयोग करता है:</p><ul><li>हमारी सेवा प्रदान करने, बनाए रखने और बेहतर बनाने के लिए।</li><li>आपकी पूछताछ का जवाब देने और ग्राहक सहायता प्रदान करने के लिए।</li><li>आपके प्रोजेक्ट या हमारी सेवाओं के बारे में आपसे संवाद करने के लिए।</li><li>विश्लेषण या मूल्यवान जानकारी प्रदान करने के लिए ताकि हम सेवा में सुधार कर सकें।</li><li>सेवा के उपयोग की निगरानी करने के लिए।</li><li>तकनीकी समस्याओं का पता लगाने, रोकने और संबोधित करने के लिए।</li></ul><h2>3. डेटा सुरक्षा</h2><p>आपके डेटा की सुरक्षा हमारे लिए महत्वपूर्ण है, लेकिन याद रखें कि इंटरनेट पर प्रसारण का कोई भी तरीका, या इलेक्ट्रॉनिक भंडारण का कोई भी तरीका 100% सुरक्षित नहीं है। जबकि हम आपके व्यक्तिगत डेटा की सुरक्षा के लिए व्यावसायिक रूप से स्वीकार्य साधनों का उपयोग करने का प्रयास करते हैं, हम इसकी पूर्ण सुरक्षा की गारंटी नहीं दे सकते।</p><h2>4. डेटा का प्रकटीकरण</h2><p>हम आपके व्यक्तिगत डेटा को तीसरे पक्षों को नहीं बेचेंगे, किराए पर नहीं देंगे, या व्यापार नहीं करेंगे। हम आपके व्यक्तिगत डेटा को सद्भावना विश्वास में प्रकट कर सकते हैं कि ऐसी कार्रवाई आवश्यक है:</p><ul><li>एक कानूनी दायित्व का पालन करने के लिए।</li><li>प्रॉम्प्ट माइंड्स के अधिकारों या संपत्ति की रक्षा और बचाव के लिए।</li><li>सेवा के संबंध में संभावित गलत कामों को रोकने या जांचने के लिए।</li><li>सेवा के उपयोगकर्ताओं या जनता की व्यक्तिगत सुरक्षा की रक्षा के लिए।</li></ul><h2>5. अन्य साइटों के लिंक</h2><p>हमारी सेवा में अन्य साइटों के लिंक हो सकते हैं जो हमारे द्वारा संचालित नहीं हैं। यदि आप किसी तीसरे पक्ष के लिंक पर क्लिक करते हैं, तो आपको उस तीसरे पक्ष की साइट पर निर्देशित किया जाएगा। हम आपको दृढ़ता से सलाह देते हैं कि आप जिस भी साइट पर जाएँ, उसकी गोपनीयता नीति की समीक्षा करें। हमारा किसी भी तीसरे पक्ष की साइटों या सेवाओं की सामग्री, गोपनीयता नीतियों या प्रथाओं पर कोई नियंत्रण नहीं है और हम कोई जिम्मेदारी नहीं लेते हैं।</p><h2>6. बच्चों की गोपनीयता</h2><p>हमारी सेवा 18 वर्ष से कम आयु के किसी भी व्यक्ति ("बच्चे") को संबोधित नहीं करती है। हम जानबूझकर 18 वर्ष से कम आयु के किसी भी व्यक्ति से व्यक्तिगत रूप से पहचानी जाने वाली जानकारी एकत्र नहीं करते हैं। यदि आप एक माता-पिता या अभिभावक हैं और आप जानते हैं कि आपके बच्चों ने हमें व्यक्तिगत डेटा प्रदान किया है, तो कृपया हमसे संपर्क करें। यदि हमें पता चलता है कि हमने माता-पिता की सहमति के सत्यापन के बिना बच्चों से व्यक्तिगत डेटा एकत्र किया है, तो हम उस जानकारी को अपने सर्वर से हटाने के लिए कदम उठाते हैं।</p><h2>7. इस गोपनीयता नीति में परिवर्तन</h2><p>हम समय-समय पर अपनी गोपनीयता नीति को अपडेट कर सकते हैं। हम इस पृष्ठ पर नई गोपनीयता नीति पोस्ट करके आपको किसी भी परिवर्तन के बारे में सूचित करेंगे। आपको किसी भी परिवर्तन के लिए समय-समय पर इस गोपनीयता नीति की समीक्षा करने की सलाह दी जाती है। इस गोपनीयता नीति में परिवर्तन इस पृष्ठ पर पोस्ट किए जाने पर प्रभावी होते हैं।</p><h2>8. हमसे संपर्क करें</h2><p>यदि इस गोपनीयता नीति के बारे में आपके कोई प्रश्न हैं, तो कृपया हमें ईमेल द्वारा संपर्क करें: <a href="mailto:business.newviral@gmail.com">business.newviral@gmail.com</a></p>`
        },
        'terms': {
            en: `<h1>Terms of Service for Prompt Minds</h1><p><em>Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p><h2>1. Acceptance of Terms</h2><p>By using the services of Prompt Minds ("Company," "we," "us," or "our"), you (the "Client," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services. These Terms constitute a legally binding agreement between you and Prompt Minds regarding your access to and use of our website development and related services.</p><h2>2. Services Provided</h2><p>Prompt Minds agrees to provide the Client with professional website design and development services. The scope of services is detailed in the "Website Design Service Agreement" section of our website and includes, but is not limited to:</p><ul><li>Custom website design on the Blogger platform.</li><li>Registration and setup of a .com custom domain name.</li><li>Development of custom tools and features as agreed upon.</li><li>Creation of custom graphics and animations.</li><li>Comprehensive Search Engine Optimization (SEO) setup.</li><li>Verification with Google Search Console.</li><li>Custom logo design.</li><li>Assistance in applying for ad platforms like Google AdSense.</li></ul><h2>3. Client Responsibilities</h2><p>To ensure a smooth and timely project delivery, the Client agrees to:</p><ul><li>Provide all necessary website content (text, images, brand details) in a timely manner.</li><li>Ensure that all content provided is original or that the Client holds the legal rights and copyright to use it. The Client indemnifies Prompt Minds against any claims of copyright infringement arising from the content provided by the Client.</li><li>Provide timely feedback and approvals as required during the project lifecycle.</li><li>Communicate any changes or new requirements clearly and promptly.</li></ul><h2>4. Payment Terms</h2><p>Our payment structure is designed to be result-oriented:</p><ul><li>An advance payment of 50% of the total project cost is required to commence work. This payment is non-refundable once the project has started.</li><li>The final 50% payment is due upon whichever of two conditions is met first: (a) when the website has received at least 500 visitors, or (b) two months after the project start date.</li><li>All payments are to be made through the methods specified by Prompt Minds. Failure to make payments on time may result in work stoppage or suspension of services.</li></ul><h2>5. Intellectual Property and Ownership</h2><p>Upon receipt of full and final payment, the Client will be the sole owner of the website, domain name, and all associated deliverables. All rights, title, and interest will be transferred to the Client. Prompt Minds reserves the right to display the completed project in our portfolio and marketing materials as an example of our work. This serves as a promotion for both our services and the Client's website.</p><h2>6. Term and Termination</h2><ul><li><strong>Cancellation by Client:</strong> If the Client chooses to cancel the project after work has begun, the 50% advance payment will be forfeited to cover the costs of the domain, resources, and initial work performed.</li><li><strong>Termination by Prompt Minds:</strong> We reserve the right to terminate the project if the Client fails to adhere to these terms, including failure to provide necessary content or payments.</li><li><strong>Refunds:</strong> If Prompt Minds fails to deliver the project within the agreed-upon timeline (typically 7 working days, subject to the Client providing content on time), the Client is entitled to a full refund of the advance payment.</li></ul><h2>7. Disclaimer of Warranties and Limitation of Liability</h2><p>While we strive for excellence, our services are provided on an "as is" basis. We do not warrant that your website will be error-free or that access to it will be continuous or uninterrupted. We do not guarantee approval for ad platforms like Google AdSense, as this is at the sole discretion of the respective platform. In no event shall Prompt Minds be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p><h2>8. Governing Law</h2><p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Patna, Bihar, India.</p><h2>9. Contact Us</h2><p>For any questions or clarifications regarding these Terms of Service, please contact us at <a href="mailto:business.newviral@gmail.com">business.newviral@gmail.com</a>.</p>`,
            hi: `<h1>प्रॉम्प्ट माइंड्स के लिए सेवा की शर्तें</h1><p><em>अंतिम अपडेट: ${new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p><h2>1. शर्तों की स्वीकृति</h2><p>प्रॉम्प्ट माइंड्स ("कंपनी," "हम," "हमें," या "हमारा") की सेवाओं का उपयोग करके, आप ("क्लाइंट," "आप," या "आपका") इन सेवा की शर्तों ("शर्तें") से बंधे होने के लिए सहमत हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें। ये शर्तें आपके और प्रॉम्प्ट माइंड्स के बीच हमारी वेबसाइट विकास और संबंधित सेवाओं तक आपकी पहुंच और उपयोग के संबंध में कानूनी रूप से बाध्यकारी समझौता हैं।</p><h2>2. प्रदान की जाने वाली सेवाएँ</h2><p>प्रॉम्प्ट माइंड्स क्लाइंट को पेशेवर वेबसाइट डिजाइन और विकास सेवाएँ प्रदान करने के लिए सहमत है। सेवाओं का दायरा हमारी वेबसाइट के "वेबसाइट डिज़ाइन सेवा समझौता" खंड में विस्तृत है और इसमें शामिल हैं, लेकिन यह इन्हीं तक सीमित नहीं है:</p><ul><li>ब्लॉगर प्लेटफॉर्म पर कस्टम वेबसाइट डिजाइन।</li><li>.com कस्टम डोमेन नाम का पंजीकरण और सेटअप।</li><li>सहमति के अनुसार कस्टम टूल और सुविधाओं का विकास।</li><li>कस्टम ग्राफिक्स और एनिमेशन का निर्माण।</li><li>व्यापक खोज इंजन अनुकूलन (एसईओ) सेटअप।</li><li>गूगल सर्च कंसोल के साथ सत्यापन।</li><li>कस्टम लोगो डिजाइन।</li><li>गूगल एडसेंस जैसे विज्ञापन प्लेटफार्मों के लिए आवेदन करने में सहायता।</li></ul><h2>3. क्लाइंट की जिम्मेदारियाँ</h2><p>एक सहज और समय पर प्रोजेक्ट डिलीवरी सुनिश्चित करने के लिए, क्लाइंट सहमत है:</p><ul><li>सभी आवश्यक वेबसाइट सामग्री (टेक्स्ट, चित्र, ब्रांड विवरण) समय पर प्रदान करना।</li><li>यह सुनिश्चित करना कि प्रदान की गई सभी सामग्री मूल है या क्लाइंट के पास इसका उपयोग करने का कानूनी अधिकार और कॉपीराइट है। क्लाइंट द्वारा प्रदान की गई सामग्री से उत्पन्न होने वाले किसी भी कॉपीराइट उल्लंघन के दावों के खिलाफ क्लाइंट प्रॉम्प्ट माइंड्स को क्षतिपूर्ति करता है।</li><li>प्रोजेक्ट जीवनचक्र के दौरान आवश्यकतानुसार समय पर प्रतिक्रिया और अनुमोदन प्रदान करना।</li><li>किसी भी परिवर्तन या नई आवश्यकताओं को स्पष्ट और तुरंत सूचित करना।</li></ul><h2>4. भुगतान की शर्तें</h2><p>हमारी भुगतान संरचना परिणाम-उन्मुख होने के लिए डिज़ाइन की गई है:</p><ul><li>काम शुरू करने के लिए कुल प्रोजेक्ट लागत का 50% अग्रिम भुगतान आवश्यक है। प्रोजेक्ट शुरू होने के बाद यह भुगतान गैर-वापसी योग्य है।</li><li>अंतिम 50% भुगतान दो शर्तों में से जो भी पहले हो, पर देय है: (क) जब वेबसाइट पर कम से कम 500 विज़िटर आ गए हों, या (ख) प्रोजेक्ट शुरू होने की तारीख से दो महीने बाद।</li><li>सभी भुगतान प्रॉम्प्ट माइंड्स द्वारा निर्दिष्ट तरीकों के माध्यम से किए जाने हैं। समय पर भुगतान करने में विफलता के परिणामस्वरूप काम रुक सकता है या सेवाएँ निलंबित हो सकती हैं।</li></ul><h2>5. बौद्धिक संपदा और स्वामित्व</h2><p>पूर्ण और अंतिम भुगतान प्राप्त होने पर, क्लाइंट वेबसाइट, डोमेन नाम और सभी संबंधित डिलिवरेबल्स का एकमात्र मालिक होगा। सभी अधिकार, शीर्षक और हित क्लाइंट को हस्तांतरित कर दिए जाएंगे। प्रॉम्प्ट माइंड्स हमारे काम के एक उदाहरण के रूप में हमारे पोर्टफोलियो और विपणन सामग्री में पूर्ण प्रोजेक्ट को प्रदर्शित करने का अधिकार सुरक्षित रखता है। यह हमारी सेवाओं और क्लाइंट की वेबसाइट दोनों के प्रचार के रूप में कार्य करता है।</p><h2>6. अवधि और समाप्ति</h2><ul><li><strong>क्लाइंट द्वारा रद्दीकरण:</strong> यदि क्लाइंट काम शुरू होने के बाद प्रोजेक्ट को रद्द करने का विकल्प चुनता है, तो डोमेन, संसाधनों और किए गए प्रारंभिक कार्य की लागत को कवर करने के लिए 50% अग्रिम भुगतान जब्त कर लिया जाएगा।</li><li><strong>प्रॉम्प्ट माइंड्स द्वारा समाप्ति:</strong> यदि क्लाइंट इन शर्तों का पालन करने में विफल रहता है, जिसमें आवश्यक सामग्री या भुगतान प्रदान करने में विफलता शामिल है, तो हम प्रोजेक्ट को समाप्त करने का अधिकार सुरक्षित रखते हैं।</li><li><strong>धनवापसी:</strong> यदि प्रॉम्प्ट माइंड्स सहमत समय-सीमा (आमतौर पर 7 कार्य दिवस, क्लाइंट द्वारा समय पर सामग्री प्रदान करने के अधीन) के भीतर प्रोजेक्ट देने में विफल रहता है, तो क्लाइंट अग्रिम भुगतान की पूरी वापसी का हकदार है।</li></ul><h2>7. वारंटियों का अस्वीकरण और देयता की सीमा</h2><p>जबकि हम उत्कृष्टता के लिए प्रयास करते हैं, हमारी सेवाएँ "जैसा है" के आधार पर प्रदान की जाती हैं। हम यह गारंटी नहीं देते कि आपकी वेबसाइट त्रुटि-मुक्त होगी या उस तक पहुंच निरंतर या निर्बाध होगी। हम गूगल एडसेंस जैसे विज्ञापन प्लेटफार्मों के लिए अनुमोदन की गारंटी नहीं दे सकते, क्योंकि यह संबंधित प्लेटफॉर्म के एकमात्र विवेक पर है। किसी भी स्थिति में प्रॉम्प्ट माइंड्स हमारी सेवाओं का उपयोग करने या उपयोग करने में असमर्थता के परिणामस्वरूप होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, या परिणामी नुकसान के लिए उत्तरदायी नहीं होगा।</p><h2>8. शासी कानून</h2><p>ये शर्तें भारत के कानूनों के अनुसार शासित और व्याख्या की जाएंगी, इसके कानून के सिद्धांतों के टकराव की परवाह किए बिना। इन शर्तों के तहत या इसके संबंध में उत्पन्न होने वाले किसी भी विवाद को पटना, बिहार, भारत में स्थित अदालतों के अनन्य क्षेत्राधिकार के अधीन किया जाएगा।</p><h2>9. हमसे संपर्क करें</h2><p>इन सेवा की शर्तों के संबंध में किसी भी प्रश्न या स्पष्टीकरण के लिए, कृपया हमसे <a href="mailto:business.newviral@gmail.com">business.newviral@gmail.com</a> पर संपर्क करें।</p>`
        }
    };
    function loadPageContent(pageName, containerId) {
        const container = document.getElementById(containerId);
        const currentLang = localStorage.getItem('language') || 'en';
        if (pageContents[pageName] && pageContents[pageName][currentLang]) {
            container.innerHTML = pageContents[pageName][currentLang];
        } else {
            container.innerHTML = `<p>Content not available.</p>`;
        }
    }
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const pageName = e.currentTarget.dataset.page;
            const infoModal = document.getElementById('info-modal');
            infoModal.dataset.currentPage = pageName;
            loadPageContent(pageName, 'info-modal-content');
            showModal(infoModal);
        });
    });
    
    // --- INITIAL LOAD ---
    loadReviews();
});