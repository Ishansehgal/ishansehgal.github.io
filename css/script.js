// Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling and active nav links
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const text = 'Ishan Sehgal';
let index = 0;

function type() {
    if (index < text.length) {
        typingText.textContent += text.charAt(index);
        index++;
        setTimeout(type, 150);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    typingText.textContent = '';
    setTimeout(type, 1000);
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillSection = document.querySelector('.skills');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
};

// Intersection Observer for skills animation
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
        }
    });
}, { threshold: 0.5 });

if (skillSection) {
    skillsObserver.observe(skillSection);
}

// A* Grid Animation
const createAStarGrid = () => {
    const grid = document.getElementById('astar-grid');
    if (!grid) return;
    
    for (let i = 0; i < 80; i++) {
        const cell = document.createElement('div');
        cell.style.width = '20px';
        cell.style.height = '20px';
        cell.style.background = Math.random() > 0.8 ? '#333' : 'transparent';
        cell.style.border = '1px solid rgba(0, 255, 136, 0.2)';
        
        // Animate some cells
        if (Math.random() > 0.9) {
            cell.style.background = 'var(--primary-color)';
            cell.style.animation = 'pulse 2s infinite';
        }
        
        grid.appendChild(cell);
    }
};

// Graph algorithm visualization
const animateGraph = () => {
    const nodes = document.querySelectorAll('.node');
    const edges = document.querySelectorAll('.edge');
    
    // Dijkstra's algorithm simulation
    let currentIndex = 0;
    const visitOrder = [0, 1, 3, 4, 2, 5];
    
    const visitNode = () => {
        if (currentIndex < visitOrder.length) {
            const node = nodes[visitOrder[currentIndex]];
            node.style.fill = 'var(--secondary-color)';
            node.style.r = '18';
            
            // Reset previous nodes
            nodes.forEach((n, idx) => {
                if (idx !== visitOrder[currentIndex]) {
                    n.style.fill = 'var(--primary-color)';
                    n.style.r = '15';
                }
            });
            
            currentIndex++;
            setTimeout(visitNode, 1000);
        } else {
            // Reset and restart
            setTimeout(() => {
                currentIndex = 0;
                visitNode();
            }, 2000);
        }
    };
    
    visitNode();
};

// Initialize animations
window.addEventListener('load', () => {
    createAStarGrid();
    setTimeout(animateGraph, 2000);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Contact form animation (if you add a contact form later)
const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.classList.add('fade-in-up');
});

// Add fade-in-up animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fade-in-up 0.8s ease forwards;
    }
`;
document.head.appendChild(fadeInStyle);
