
/* =========================================================
   EVASOFT — MAIN JAVASCRIPT
   ========================================================= */

"use strict";


/* ---------------------------------------------------------
   1. DOM READY
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    initTheme();
    initLoader();
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initActiveNavigation();
    initBackToTop();
    initCounters();
    initSmoothScroll();
    initHeroMotion();
    initTiltCards();

});


/* ---------------------------------------------------------
   2. THEME / DARK MODE
--------------------------------------------------------- */

function initTheme() {

    const root = document.documentElement;
    const themeToggle = document.querySelector("[data-theme-toggle]");

    if (!themeToggle) {
        return;
    }

    const savedTheme = localStorage.getItem("evasoft-theme");

    if (savedTheme === "light" || savedTheme === "dark") {

        root.setAttribute("data-theme", savedTheme);

    } else {

        const prefersLight = window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches;

        root.setAttribute(
            "data-theme",
            prefersLight ? "light" : "dark"
        );
    }


    themeToggle.addEventListener("click", () => {

        const currentTheme =
            root.getAttribute("data-theme") || "dark";

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        root.setAttribute("data-theme", nextTheme);

        localStorage.setItem(
            "evasoft-theme",
            nextTheme
        );

        themeToggle.classList.add("theme-changing");

        setTimeout(() => {
            themeToggle.classList.remove("theme-changing");
        }, 350);

    });


    /* Follow OS theme if user has not manually selected one */

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", event => {

            if (localStorage.getItem("evasoft-theme")) {
                return;
            }

            root.setAttribute(
                "data-theme",
                event.matches ? "dark" : "light"
            );

        });

}


/* ---------------------------------------------------------
   3. PAGE LOADER
--------------------------------------------------------- */

function initLoader() {

    const loader = document.querySelector(".page-loader");

    if (!loader) {
        return;
    }

    const hideLoader = () => {

        setTimeout(() => {
            loader.classList.add("loaded");
        }, 450);

    };


    if (document.readyState === "complete") {

        hideLoader();

    } else {

        window.addEventListener(
            "load",
            hideLoader,
            { once: true }
        );

    }

}


/* ---------------------------------------------------------
   4. HEADER
--------------------------------------------------------- */

function initHeader() {

    const header =
        document.querySelector(".site-header");

    if (!header) {
        return;
    }


    const updateHeader = () => {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };


    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

}


/* ---------------------------------------------------------
   5. MOBILE MENU
--------------------------------------------------------- */

function initMobileMenu() {

    const menuToggle =
        document.querySelector(".menu-toggle");

    const mobileNav =
        document.querySelector(".mobile-nav");

    if (!menuToggle || !mobileNav) {
        return;
    }


    const closeMenu = () => {

        mobileNav.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    const openMenu = () => {

        mobileNav.classList.add("open");

        document.body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    };


    menuToggle.addEventListener("click", event => {

        event.stopPropagation();

        const isOpen =
            mobileNav.classList.contains("open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    });


    /* Close after clicking a navigation link */

    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    /* Close when clicking outside */

    document.addEventListener("click", event => {

        if (
            !mobileNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            closeMenu();

        }

    });


    /* Escape key */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    /* Handle desktop resize */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });

}


/* ---------------------------------------------------------
   6. SCROLL REVEAL
--------------------------------------------------------- */

function initScrollReveal() {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }


    /* Respect reduced-motion */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );


    revealElements.forEach(element => {
        observer.observe(element);
    });

}


/* ---------------------------------------------------------
   7. ACTIVE NAVIGATION
--------------------------------------------------------- */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".main-nav .nav-link"
        );

    if (!sections.length || !navLinks.length) {
        return;
    }


    const linkMap = new Map();


    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (
            href &&
            href.startsWith("#")
        ) {

            linkMap.set(
                href.substring(1),
                link
            );

        }

    });


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.id;

                    navLinks.forEach(link => {
                        link.classList.remove("active");
                    });

                    const activeLink =
                        linkMap.get(id);

                    if (activeLink) {
                        activeLink.classList.add("active");
                    }

                });

            },
            {
                rootMargin:
                    "-25% 0px -65% 0px",
                threshold: 0
            }
        );


    sections.forEach(section => {
        observer.observe(section);
    });

}


/* ---------------------------------------------------------
   8. BACK TO TOP
--------------------------------------------------------- */

function initBackToTop() {

    const button =
        document.querySelector(".back-to-top");

    if (!button) {
        return;
    }


    const updateButton = () => {

        if (window.scrollY > 700) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    };


    updateButton();


    window.addEventListener(
        "scroll",
        updateButton,
        { passive: true }
    );


    button.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* ---------------------------------------------------------
   9. SMOOTH SCROLL
--------------------------------------------------------- */

function initSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    15;


                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });


                /* Update URL without jumping */

                if (
                    history.pushState &&
                    targetId !== "#"
                ) {

                    history.pushState(
                        null,
                        "",
                        targetId
                    );

                }

            }
        );

    });

}


/* ---------------------------------------------------------
   10. COUNTER ANIMATION
--------------------------------------------------------- */

function initCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    if (!counters.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        counters.forEach(counter => {

            const value =
                counter.getAttribute(
                    "data-counter"
                );

            counter.textContent = value;

        });

        return;

    }


    const animateCounter = counter => {

        const target =
            parseFloat(
                counter.getAttribute(
                    "data-counter"
                )
            );

        if (Number.isNaN(target)) {
            return;
        }


        const duration = 1500;

        const startTime =
            performance.now();


        const update = currentTime => {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /* Smooth easing */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                target * eased;


            if (Number.isInteger(target)) {

                counter.textContent =
                    Math.round(current)
                        .toLocaleString("en-US");

            } else {

                counter.textContent =
                    current.toFixed(1);

            }


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                if (Number.isInteger(target)) {

                    counter.textContent =
                        target.toLocaleString(
                            "en-US"
                        );

                } else {

                    counter.textContent =
                        target.toFixed(1);

                }

            }

        };


        requestAnimationFrame(update);

    };


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const counter =
                        entry.target;

                    if (
                        counter.dataset.animated
                    ) {
                        return;
                    }

                    counter.dataset.animated =
                        "true";

                    animateCounter(counter);

                    observer.unobserve(counter);

                });

            },
            {
                threshold: .7
            }
        );


    counters.forEach(counter => {
        observer.observe(counter);
    });

}


/* ---------------------------------------------------------
   11. HERO MOUSE MOTION
--------------------------------------------------------- */

function initHeroMotion() {

    const visual =
        document.querySelector(".hero-visual");

    if (!visual) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    let frame = null;


    visual.addEventListener(
        "mousemove",
        event => {

            const rect =
                visual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width;

            const y =
                (event.clientY - rect.top) /
                rect.height;


            const rotateY =
                (x - .5) * 5;

            const rotateX =
                (.5 - y) * 4;


            if (frame) {
                cancelAnimationFrame(frame);
            }


            frame =
                requestAnimationFrame(() => {

                    const dashboard =
                        visual.querySelector(
                            ".hero-dashboard"
                        );

                    if (!dashboard) {
                        return;
                    }


                    dashboard.style.transform =
                        `
                        perspective(1200px)
                        rotateY(${-5 + rotateY}deg)
                        rotateX(${2 + rotateX}deg)
                        translateZ(0)
                        `;

                });

        }
    );


    visual.addEventListener(
        "mouseleave",
        () => {

            const dashboard =
                visual.querySelector(
                    ".hero-dashboard"
                );

            if (!dashboard) {
                return;
            }


            dashboard.style.transform =
                `
                perspective(1200px)
                rotateY(-5deg)
                rotateX(2deg)
                translateZ(0)
                `;

        }
    );

}


/* ---------------------------------------------------------
   12. CARD TILT
--------------------------------------------------------- */

function initTiltCards() {

    const cards =
        document.querySelectorAll(
            "[data-tilt]"
        );

    if (!cards.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((y - centerY) /
                        centerY) *
                    -3;


                const rotateY =
                    ((x - centerX) /
                        centerX) *
                    3;


                card.style.transform =
                    `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-6px)
                    `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });

}


/* ---------------------------------------------------------
   13. HEADER SCROLL PROGRESS
--------------------------------------------------------- */

function initScrollProgress() {

    const progress =
        document.querySelector(
            ".scroll-progress"
        );

    if (!progress) {
        return;
    }


    const updateProgress = () => {

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight;

        const windowHeight =
            window.innerHeight;

        const scrollable =
            documentHeight -
            windowHeight;


        const percentage =
            scrollable > 0
                ? (scrollTop / scrollable) * 100
                : 0;


        progress.style.width =
            `${percentage}%`;

    };


    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );

    updateProgress();

}


/* ---------------------------------------------------------
   14. IMAGE LAZY LOAD FALLBACK
--------------------------------------------------------- */

function initLazyImages() {

    const images =
        document.querySelectorAll(
            "img[data-src]"
        );

    if (!images.length) {
        return;
    }


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const image =
                            entry.target;

                        image.src =
                            image.dataset.src;

                        image.removeAttribute(
                            "data-src"
                        );

                        observer.unobserve(
                            image
                        );

                    });

                },
                {
                    rootMargin: "150px"
                }
            );


        images.forEach(image => {
            observer.observe(image);
        });

    } else {

        images.forEach(image => {

            image.src =
                image.dataset.src;

            image.removeAttribute(
                "data-src"
            );

        });

    }

}


/* ---------------------------------------------------------
   15. PRODUCT / SERVICE PLACEHOLDER
--------------------------------------------------------- */

function initPlaceholderInteraction() {

    const placeholders =
        document.querySelectorAll(
            ".placeholder-content"
        );

    placeholders.forEach(placeholder => {

        placeholder.addEventListener(
            "mouseenter",
            () => {

                placeholder.style.transform =
                    "scale(1.03)";

            }
        );


        placeholder.addEventListener(
            "mouseleave",
            () => {

                placeholder.style.transform =
                    "";

            }
        );

    });

}


/* ---------------------------------------------------------
   16. INITIALIZE OPTIONAL FEATURES
--------------------------------------------------------- */

initScrollProgress();
initLazyImages();
initPlaceholderInteraction();


/* ---------------------------------------------------------
   17. KEYBOARD ACCESSIBILITY
--------------------------------------------------------- */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Tab") {
            return;
        }

        document.body.classList.add(
            "keyboard-navigation"
        );

    }
);


/* ---------------------------------------------------------
   18. REMOVE KEYBOARD MODE ON MOUSE USE
--------------------------------------------------------- */

document.addEventListener(
    "mousedown",
    () => {

        document.body.classList.remove(
            "keyboard-navigation"
        );

    },
    { passive: true }
);


/* ---------------------------------------------------------
   19. CONSOLE BRANDING
--------------------------------------------------------- */

console.log(
    "%c EVASOFT ",
    `
        background: #1268e8;
        color: white;
        font-size: 18px;
        font-weight: 800;
        padding: 8px 14px;
        border-radius: 8px;
    `
);

console.log(
    "%c Software · AI · Data ",
    `
        color: #3788ff;
        font-size: 12px;
        font-weight: 700;
    `
);