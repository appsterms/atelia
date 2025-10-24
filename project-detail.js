// Firebase Integration for Project Detail Page
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

// Get project ID from URL parameter
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Convert YouTube URL to embed URL
function convertYouTubeUrl(url) {
    if (!url) return '';
    
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        /youtube\.com\/embed\/([^&\s]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    
    return url; // Return original if no pattern matches
}

// Load project data and display
async function loadProjectDetail() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const projectContent = document.getElementById('projectDetailContent');
    
    try {
        const projectId = getProjectIdFromUrl();
        
        if (!projectId) {
            throw new Error('No project ID provided');
        }
        
        // Fetch project data from Firestore
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        
        if (!projectDoc.exists()) {
            throw new Error('Project not found');
        }
        
        const project = projectDoc.data();
        
        // Update page title
        document.title = `${project.name || 'Project'} - Atelia Built`;
        
        // Display project title
        document.getElementById('projectTitle').textContent = project.name || 'Untitled Project';
        
        // Display hero image
        const heroImage = document.getElementById('projectHeroImage');
        if (project.images && project.images.length > 0) {
            heroImage.src = project.images[0];
            heroImage.alt = project.name || 'Project Image';
        } else if (project.image) {
            // Fallback to old single image field
            heroImage.src = project.image;
            heroImage.alt = project.alt || project.name || 'Project Image';
        }
        
        // Display project meta information
        const metaContainer = document.getElementById('projectMeta');
        metaContainer.innerHTML = '';
        
        // Add meta items if they exist
        const metaFields = [
            { label: 'Location:', value: project.location },
            { label: 'Project Year:', value: project.year },
            { label: 'Builder:', value: project.builder },
            { label: 'Interior Designer:', value: project.designer },
            { label: 'Photographer:', value: project.photographer }
        ];
        
        metaFields.forEach(field => {
            if (field.value) {
                const metaItem = document.createElement('div');
                metaItem.className = 'project-meta-item';
                metaItem.innerHTML = `
                    <div class="project-meta-label">${field.label}</div>
                    <div class="project-meta-value">${field.value}</div>
                `;
                metaContainer.appendChild(metaItem);
            }
        });
        
        // Display description
        const descriptionContainer = document.getElementById('projectDescription');
        if (project.description) {
            descriptionContainer.textContent = project.description;
        } else {
            descriptionContainer.style.display = 'none';
        }
        
        // Display video if available
        const videoSection = document.getElementById('projectVideoSection');
        const videoIframe = document.getElementById('projectVideo');
        if (project.videoUrl) {
            const embedUrl = convertYouTubeUrl(project.videoUrl);
            videoIframe.src = embedUrl;
            videoIframe.title = project.videoTitle || project.name || 'Project Video';
            videoSection.style.display = 'block';
        } else {
            videoSection.style.display = 'none';
        }
        
        // Display image gallery
        const galleryContainer = document.getElementById('projectGallery');
        galleryContainer.innerHTML = '';
        
        if (project.images && project.images.length > 1) {
            // Skip first image as it's already used in hero
            const galleryImages = project.images.slice(1);
            
            galleryImages.forEach((imageUrl, index) => {
                const galleryItem = document.createElement('div');
                // Make first gallery image (second overall image) featured
                galleryItem.className = index === 0 ? 'project-gallery-item featured' : 'project-gallery-item';
                
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `${project.name} - Image ${index + 2}`;
                img.loading = 'lazy';
                
                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);
            });
        } else {
            // Hide gallery if only one or no images
            galleryContainer.style.display = 'none';
        }
        
        // Hide loading, show content
        loadingState.style.display = 'none';
        projectContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading project:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }
}

// Load project when page loads
document.addEventListener('DOMContentLoaded', loadProjectDetail);

// Export for testing
export { loadProjectDetail, getProjectIdFromUrl };

