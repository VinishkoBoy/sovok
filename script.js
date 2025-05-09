        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyBzefxFDTHQqXFHg9t08JTiL5EaH8si1oY",
            authDomain: "dkvs-1ec88.firebaseapp.com",
            databaseURL: "https://dkvs-1ec88-default-rtdb.firebaseio.com/",
            projectId: "dkvs-1ec88",
            storageBucket: "dkvs-1ec88.appspot.com",
            messagingSenderId: "167430647129",
            appId: "1:167430647129:web:ab209fec7735f20b597048",
            measurementId: "G-H6LKMLYD10"
        };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        const counterRef = ref(db, 'counter');

        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handleScroll() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                if (isInViewport(el) && !el.classList.contains('visible')) {
                    el.classList.add('visible');
                    if (el.classList.contains('stat-item')) {
                        const countElement = el.querySelector('h3');
                        const endValue = parseInt(countElement.getAttribute('data-target'));
                        animateValue(countElement, 0, endValue, 2000);
                    }
                }
            });

            const scrollToTop = document.getElementById('scrollToTop');
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }

            const header = document.getElementById('header');
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Highlight active section in navigation
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('section');

            let currentSection = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 60) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('load', handleScroll);

        // Accordion functionality
        const acc = document.getElementsByClassName("accordion");
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Scroll to top functionality
        document.getElementById('scrollToTop').addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        
        const navMenu = document.getElementById('nav-menu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        // Close mobile menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });

        onValue(counterRef, (snapshot) => {
            const convoyCount = snapshot.val() || 0;
            document.getElementById('convoyCount').setAttribute('data-target', convoyCount);
            if (isInViewport(document.getElementById('convoyCount'))) {
                animateValue(document.getElementById('convoyCount'), 0, convoyCount, 2000);
            }
        });