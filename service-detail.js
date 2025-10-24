// Firebase Integration for Service Detail Page
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

// Get service ID from URL parameter
function getServiceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load service data and display
async function loadServiceDetail() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const serviceContent = document.getElementById('serviceDetailContent');
    
    try {
        const serviceId = getServiceIdFromUrl();
        
        if (!serviceId) {
            throw new Error('No service ID provided');
        }
        
        // Fetch service data from Firestore
        const serviceDoc = await getDoc(doc(db, 'services', serviceId));
        
        if (!serviceDoc.exists()) {
            throw new Error('Service not found');
        }
        
        const service = serviceDoc.data();
        
        // Update page title
        document.title = `${service.name || 'Service'} - Atelia Built`;
        
        // Display service title in hero and header
        document.getElementById('serviceHeroTitle').textContent = service.name || 'Our Service';
        document.getElementById('serviceTitle').textContent = service.name || 'Untitled Service';
        
        // Display category if available
        if (service.category) {
            document.getElementById('serviceCategory').textContent = service.category;
        } else {
            document.getElementById('serviceCategory').style.display = 'none';
        }
        
        // Display hero image
        const heroImage = document.getElementById('serviceHeroImage');
        if (service.images && service.images.length > 0) {
            heroImage.src = service.images[0];
            heroImage.alt = service.name || 'Service Image';
        } else if (service.image) {
            // Fallback to old single image field
            heroImage.src = service.image;
            heroImage.alt = service.name || 'Service Image';
        }
        
        // Display short description
        const shortDescContainer = document.getElementById('serviceShortDescription');
        if (service.shortDescription) {
            shortDescContainer.textContent = service.shortDescription;
        } else if (service.description && service.description.length > 0) {
            // Fallback to first sentence of description
            const firstSentence = service.description.split('.')[0] + '.';
            shortDescContainer.textContent = firstSentence;
        } else {
            shortDescContainer.style.display = 'none';
        }
        
        // Display full description
        const descriptionContainer = document.getElementById('serviceDescription');
        if (service.fullDescription) {
            // Support multiple paragraphs
            const paragraphs = service.fullDescription.split('\n\n');
            descriptionContainer.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        } else if (service.description) {
            descriptionContainer.innerHTML = `<p>${service.description}</p>`;
        } else {
            descriptionContainer.style.display = 'none';
        }
        
        // Display features if available
        const featuresSection = document.getElementById('serviceFeaturesSection');
        const featuresGrid = document.getElementById('featuresGrid');
        if (service.features && service.features.length > 0) {
            featuresGrid.innerHTML = '';
            service.features.forEach(feature => {
                const featureItem = document.createElement('div');
                featureItem.className = 'feature-item';
                featureItem.innerHTML = `
                    <div class="feature-icon">✓</div>
                    <div class="feature-text">${feature}</div>
                `;
                featuresGrid.appendChild(featureItem);
            });
            featuresSection.style.display = 'block';
        } else {
            featuresSection.style.display = 'none';
        }
        
        // Display process steps if available
        const processSection = document.getElementById('serviceProcessSection');
        const processSteps = document.getElementById('processSteps');
        if (service.process && service.process.length > 0) {
            processSteps.innerHTML = '';
            service.process.forEach((step, index) => {
                const stepItem = document.createElement('div');
                stepItem.className = 'process-step';
                stepItem.innerHTML = `
                    <div class="step-number">${String(index + 1).padStart(2, '0')}</div>
                    <div class="step-title">${step.title || `Step ${index + 1}`}</div>
                    <div class="step-description">${step.description || ''}</div>
                `;
                processSteps.appendChild(stepItem);
            });
            processSection.style.display = 'block';
        } else {
            processSection.style.display = 'none';
        }
        
        // Display image gallery
        const gallerySection = document.getElementById('serviceGallerySection');
        const galleryContainer = document.getElementById('serviceGallery');
        galleryContainer.innerHTML = '';
        
        if (service.images && service.images.length > 1) {
            // Skip first image as it's already used in hero
            const galleryImages = service.images.slice(1);
            
            galleryImages.forEach((imageUrl, index) => {
                const galleryItem = document.createElement('div');
                // Make first gallery image (second overall image) featured
                galleryItem.className = index === 0 ? 'gallery-item featured' : 'gallery-item';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${service.name} - Image ${index + 2}`;
                img.loading = 'lazy';
                
                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);
            });
            
            gallerySection.style.display = 'block';
        } else {
            // Hide gallery if only one or no images
            gallerySection.style.display = 'none';
        }
        
        // Hide loading, show content
        loadingState.style.display = 'none';
        serviceContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading service:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }
}

// Load service when page loads
document.addEventListener('DOMContentLoaded', loadServiceDetail);

// Export for testing
export { loadServiceDetail, getServiceIdFromUrl };

