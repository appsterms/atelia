// Firebase Integration for News Detail Page
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDl_lGXfhPrgB5MtFAfOwkDp1ralQw6Flc",
    authDomain: "atelia-a0e81.firebaseapp.com",
    projectId: "atelia-a0e81",
    storageBucket: "atelia-a0e81.firebasestorage.app",
    messagingSenderId: "364749141331",
    appId: "1:364749141331:web:547dcb0e8592413cd01da6",
    measurementId: "G-086T2JDMSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get news ID from URL parameter
function getNewsIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Recently';
    
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// Setup share buttons
function setupShareButtons(title, url) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    
    // Twitter
    const twitterBtn = document.getElementById('shareTwitter');
    if (twitterBtn) {
        twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    }
    
    // Facebook
    const facebookBtn = document.getElementById('shareFacebook');
    if (facebookBtn) {
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }
    
    // LinkedIn
    const linkedInBtn = document.getElementById('shareLinkedIn');
    if (linkedInBtn) {
        linkedInBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    
    // Email
    const emailBtn = document.getElementById('shareEmail');
    if (emailBtn) {
        emailBtn.href = `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`;
    }
}

// Load news data and display
async function loadNewsDetail() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const newsContent = document.getElementById('newsDetailContent');
    
    try {
        const newsId = getNewsIdFromUrl();
        
        if (!newsId) {
            throw new Error('No news ID provided');
        }
        
        // Fetch news data from Firestore
        const newsDoc = await getDoc(doc(db, 'news', newsId));
        
        if (!newsDoc.exists()) {
            throw new Error('News article not found');
        }
        
        const news = newsDoc.data();
        
        // Update page title
        document.title = `${news.title || 'Article'} - Atelia Built`;
        
        // Display news title
        document.getElementById('newsTitle').textContent = news.title || 'Untitled Article';
        
        // Display hero image
        const heroImage = document.getElementById('newsHeroImage');
        if (news.images && news.images.length > 0) {
            heroImage.src = news.images[0];
            heroImage.alt = news.title || 'News Image';
        } else if (news.image) {
            // Fallback to old single image field
            heroImage.src = news.image;
            heroImage.alt = news.title || 'News Image';
        }
        
        // Display category
        const categoryEl = document.getElementById('newsCategory');
        if (news.category) {
            categoryEl.textContent = news.category;
        } else {
            categoryEl.textContent = 'News';
        }
        
        // Display date
        const dateEl = document.getElementById('newsDate');
        if (news.date) {
            dateEl.textContent = formatDate(news.date);
        } else {
            dateEl.style.display = 'none';
        }
        
        // Display author if available
        const authorEl = document.getElementById('newsAuthor');
        if (news.author) {
            authorEl.textContent = news.author;
            authorEl.style.display = 'inline';
        }
        
        // Display excerpt
        const excerptEl = document.getElementById('newsExcerpt');
        if (news.excerpt) {
            excerptEl.textContent = news.excerpt;
        } else if (news.description) {
            // Fallback to description
            excerptEl.textContent = news.description;
        } else {
            excerptEl.style.display = 'none';
        }
        
        // Display full article body
        const bodyEl = document.getElementById('newsBody');
        if (news.content) {
            // Support HTML content with paragraphs, headings, lists, etc.
            // Convert line breaks to paragraphs
            const paragraphs = news.content.split('\n\n');
            bodyEl.innerHTML = paragraphs.map(p => {
                // Check if it's a heading
                if (p.startsWith('## ')) {
                    return `<h2>${p.substring(3)}</h2>`;
                } else if (p.startsWith('### ')) {
                    return `<h3>${p.substring(4)}</h3>`;
                } else if (p.startsWith('> ')) {
                    return `<blockquote>${p.substring(2)}</blockquote>`;
                } else {
                    return `<p>${p}</p>`;
                }
            }).join('');
        } else if (news.description) {
            bodyEl.innerHTML = `<p>${news.description}</p>`;
        } else {
            bodyEl.innerHTML = '<p>No content available.</p>';
        }
        
        // Display image gallery
        const gallerySection = document.getElementById('newsGallerySection');
        const galleryContainer = document.getElementById('newsGallery');
        galleryContainer.innerHTML = '';
        
        if (news.images && news.images.length > 1) {
            // Skip first image as it's already used in hero
            const galleryImages = news.images.slice(1);
            
            galleryImages.forEach((imageUrl, index) => {
                const galleryItem = document.createElement('div');
                // Make first gallery image (second overall image) featured
                galleryItem.className = index === 0 && galleryImages.length > 1 ? 'gallery-item featured' : 'gallery-item';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${news.title} - Image ${index + 2}`;
                img.loading = 'lazy';
                
                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);
            });
            
            gallerySection.style.display = 'block';
        } else {
            gallerySection.style.display = 'none';
        }
        
        // Display tags
        const tagsSection = document.getElementById('newsTagsSection');
        if (news.tags && news.tags.length > 0) {
            tagsSection.innerHTML = news.tags.map(tag => 
                `<span class="news-tag">#${tag}</span>`
            ).join('');
            tagsSection.style.display = 'flex';
        } else {
            tagsSection.style.display = 'none';
        }
        
        // Setup share buttons
        const currentUrl = window.location.href;
        setupShareButtons(news.title || 'Article', currentUrl);
        
        // Hide loading, show content
        loadingState.style.display = 'none';
        newsContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading news:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }
}

// Load news when page loads
document.addEventListener('DOMContentLoaded', loadNewsDetail);

// Export for testing
export { loadNewsDetail, getNewsIdFromUrl };

