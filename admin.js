// Firebase Admin Panel JavaScript
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { cloudinaryConfig } from './cloudinary-config.js';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables
let currentUser = null;
let projects = [];
let services = [];
let newsItems = [];
let bookings = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners first
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            showAdminPanel();
            loadContent();
            loadBookings(); // Load bookings after authentication
        } else {
            showLoginForm();
        }
    });
});

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showStatus('Login successful!', 'success');
    } catch (error) {
        showStatus('Login failed: ' + error.message, 'error');
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        showStatus('Logged out successfully!', 'success');
    } catch (error) {
        showStatus('Logout failed: ' + error.message, 'error');
    }
}

// UI functions
function showLoginForm() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
}

function showStatus(message, type) {
    // Try to find status element in both login screen and admin panel
    const loginStatusEl = document.getElementById('loginStatus');
    const adminStatusEl = document.getElementById('statusMessage');
    
    const statusEl = loginStatusEl && !loginStatusEl.closest('.hidden') ? loginStatusEl : adminStatusEl;
    
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        statusEl.classList.remove('hidden');
        
        setTimeout(() => {
            statusEl.classList.add('hidden');
        }, 3000);
    }
}

// Load content from Firestore
async function loadContent() {
    try {
        // Load hero section
        const heroDoc = await getDoc(doc(db, 'content', 'hero'));
        if (heroDoc.exists()) {
            const data = heroDoc.data();
            document.getElementById('heroHeadline').value = data.headline || '';
            document.getElementById('heroButtonText').value = data.buttonText || '';
            
            // Update preview
            const currentHeadline = document.getElementById('currentHeroHeadline');
            const currentButton = document.getElementById('currentHeroButton');
            if (currentHeadline) currentHeadline.textContent = data.headline || 'N/A';
            if (currentButton) currentButton.textContent = data.buttonText || 'N/A';
        }

        // Load projects section
        const projectsDoc = await getDoc(doc(db, 'content', 'projects'));
        if (projectsDoc.exists()) {
            const data = projectsDoc.data();
            document.getElementById('projectsTitle').value = data.title || '';
            document.getElementById('projectsDescription').value = data.description || '';
            document.getElementById('projectsCTA').value = data.cta || '';
        }

        // Load projects list
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        projects = [];
        projectsSnapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        renderProjectsList();

        // Load about section
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) {
            const data = aboutDoc.data();
            document.getElementById('aboutTitle').value = data.title || '';
            document.getElementById('aboutDescription1').value = data.description1 || '';
            document.getElementById('aboutDescription2').value = data.description2 || '';
            document.getElementById('aboutCTA').value = data.cta || '';
        }

        // Load services section
        const servicesDoc = await getDoc(doc(db, 'content', 'services'));
        if (servicesDoc.exists()) {
            const data = servicesDoc.data();
            document.getElementById('servicesTitle').value = data.title || '';
            document.getElementById('servicesTagline').value = data.tagline || '';
            document.getElementById('servicesCTA').value = data.cta || '';
        }

        // Load services list
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        services = [];
        servicesSnapshot.forEach(doc => {
            services.push({ id: doc.id, ...doc.data() });
        });
        renderServicesList();

        // Load news section
        const newsDoc = await getDoc(doc(db, 'content', 'news'));
        if (newsDoc.exists()) {
            const data = newsDoc.data();
            document.getElementById('newsTitle').value = data.title || '';
            document.getElementById('newsTagline').value = data.tagline || '';
            document.getElementById('newsCTA').value = data.cta || '';
        }

        // Load news list
        const newsSnapshot = await getDocs(collection(db, 'news'));
        newsItems = [];
        newsSnapshot.forEach(doc => {
            newsItems.push({ id: doc.id, ...doc.data() });
        });
        renderNewsList();

        // Load CTA section
        const ctaDoc = await getDoc(doc(db, 'content', 'cta'));
        if (ctaDoc.exists()) {
            const data = ctaDoc.data();
            document.getElementById('ctaHeadline').value = data.headline || '';
            document.getElementById('ctaDescription').value = data.description || '';
            document.getElementById('ctaButtonText').value = data.buttonText || '';
        }

        // Load site settings
        const settingsDoc = await getDoc(doc(db, 'content', 'settings'));
        if (settingsDoc.exists()) {
            const data = settingsDoc.data();
            document.getElementById('siteName').value = data.siteName || '';
            document.getElementById('siteTagline').value = data.siteTagline || '';
            document.getElementById('siteFavicon').value = data.siteFavicon || '';
            document.getElementById('siteLogo').value = data.siteLogo || '';
            document.getElementById('seoTitle').value = data.seoTitle || '';
            document.getElementById('seoDescription').value = data.seoDescription || '';
            document.getElementById('seoKeywords').value = data.seoKeywords || '';
            document.getElementById('contactPhone').value = data.contactPhone || '';
            document.getElementById('contactEmail').value = data.contactEmail || '';
            document.getElementById('contactAddress').value = data.contactAddress || '';
            document.getElementById('socialInstagram').value = data.socialInstagram || '';
            document.getElementById('socialLinkedIn').value = data.socialLinkedIn || '';
            document.getElementById('socialFacebook').value = data.socialFacebook || '';
            document.getElementById('socialTwitter').value = data.socialTwitter || '';
            document.getElementById('hoursWeekday').value = data.hoursWeekday || '';
            document.getElementById('hoursWeekend').value = data.hoursWeekend || '';
        }

    } catch (error) {
        console.error('Error loading content:', error);
        showStatus('Error loading content: ' + error.message, 'error');
    }
}

// Save functions
async function saveHero() {
    try {
        const headline = document.getElementById('heroHeadline').value;
        const buttonText = document.getElementById('heroButtonText').value;
        
        await setDoc(doc(db, 'content', 'hero'), {
            headline: headline,
            buttonText: buttonText
        });
        
        // Update preview
        const currentHeadline = document.getElementById('currentHeroHeadline');
        const currentButton = document.getElementById('currentHeroButton');
        if (currentHeadline) currentHeadline.textContent = headline;
        if (currentButton) currentButton.textContent = buttonText;
        
        showStatus('Hero section saved! Refresh the homepage to see changes.', 'success');
    } catch (error) {
        showStatus('Error saving hero section: ' + error.message, 'error');
    }
}

async function saveProjects() {
    try {
        await setDoc(doc(db, 'content', 'projects'), {
            title: document.getElementById('projectsTitle').value,
            description: document.getElementById('projectsDescription').value,
            cta: document.getElementById('projectsCTA').value
        });
        showStatus('Projects section saved!', 'success');
    } catch (error) {
        showStatus('Error saving projects section: ' + error.message, 'error');
    }
}

async function saveAbout() {
    try {
        await setDoc(doc(db, 'content', 'about'), {
            title: document.getElementById('aboutTitle').value,
            description1: document.getElementById('aboutDescription1').value,
            description2: document.getElementById('aboutDescription2').value,
            cta: document.getElementById('aboutCTA').value
        });
        showStatus('About section saved!', 'success');
    } catch (error) {
        showStatus('Error saving about section: ' + error.message, 'error');
    }
}

async function saveServices() {
    try {
        await setDoc(doc(db, 'content', 'services'), {
            title: document.getElementById('servicesTitle').value,
            tagline: document.getElementById('servicesTagline').value,
            cta: document.getElementById('servicesCTA').value
        });
        showStatus('Services section saved!', 'success');
    } catch (error) {
        showStatus('Error saving services section: ' + error.message, 'error');
    }
}

async function saveNews() {
    try {
        await setDoc(doc(db, 'content', 'news'), {
            title: document.getElementById('newsTitle').value,
            tagline: document.getElementById('newsTagline').value,
            cta: document.getElementById('newsCTA').value
        });
        showStatus('News section saved!', 'success');
    } catch (error) {
        showStatus('Error saving news section: ' + error.message, 'error');
    }
}

async function saveCTA() {
    try {
        await setDoc(doc(db, 'content', 'cta'), {
            headline: document.getElementById('ctaHeadline').value,
            description: document.getElementById('ctaDescription').value,
            buttonText: document.getElementById('ctaButtonText').value
        });
        showStatus('CTA section saved!', 'success');
    } catch (error) {
        showStatus('Error saving CTA section: ' + error.message, 'error');
    }
}

async function saveSettings() {
    try {
        await setDoc(doc(db, 'content', 'settings'), {
            siteName: document.getElementById('siteName').value,
            siteTagline: document.getElementById('siteTagline').value,
            siteFavicon: document.getElementById('siteFavicon').value,
            siteLogo: document.getElementById('siteLogo').value,
            seoTitle: document.getElementById('seoTitle').value,
            seoDescription: document.getElementById('seoDescription').value,
            seoKeywords: document.getElementById('seoKeywords').value,
            contactPhone: document.getElementById('contactPhone').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactAddress: document.getElementById('contactAddress').value,
            socialInstagram: document.getElementById('socialInstagram').value,
            socialLinkedIn: document.getElementById('socialLinkedIn').value,
            socialFacebook: document.getElementById('socialFacebook').value,
            socialTwitter: document.getElementById('socialTwitter').value,
            hoursWeekday: document.getElementById('hoursWeekday').value,
            hoursWeekend: document.getElementById('hoursWeekend').value
        });
        showStatus('Site settings saved! Refresh the homepage to see changes.', 'success');
    } catch (error) {
        showStatus('Error saving settings: ' + error.message, 'error');
    }
}

// Project management
function renderProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'item-card';
        projectDiv.innerHTML = `
            <h4>Project ${index + 1}</h4>
            <div class="grid">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" id="projectName_${project.id}" value="${project.name || ''}">
                </div>
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="text" id="projectImage_${project.id}" value="${project.image || ''}" readonly>
                    <button onclick="uploadProjectImage('${project.id}')" class="btn" style="margin-top: 10px;">Upload Image</button>
                    ${project.image ? `<img src="${project.image}" class="image-preview" alt="Preview">` : ''}
                </div>
                <div class="form-group">
                    <label>Alt Text:</label>
                    <input type="text" id="projectAlt_${project.id}" value="${project.alt || ''}">
                </div>
            </div>
            <div class="btn-group">
                <button onclick="updateProject('${project.id}')" class="btn btn-success">Update</button>
                <button onclick="deleteProject('${project.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(projectDiv);
    });
}

async function addProject() {
    try {
        await addDoc(collection(db, 'projects'), {
            name: 'New Project',
            image: '',
            alt: ''
        });
        loadContent();
        showStatus('Project added!', 'success');
    } catch (error) {
        showStatus('Error adding project: ' + error.message, 'error');
    }
}

async function updateProject(projectId) {
    try {
        await updateDoc(doc(db, 'projects', projectId), {
            name: document.getElementById(`projectName_${projectId}`).value,
            image: document.getElementById(`projectImage_${projectId}`).value,
            alt: document.getElementById(`projectAlt_${projectId}`).value
        });
        showStatus('Project updated!', 'success');
    } catch (error) {
        showStatus('Error updating project: ' + error.message, 'error');
    }
}

async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteDoc(doc(db, 'projects', projectId));
            loadContent();
            showStatus('Project deleted!', 'success');
        } catch (error) {
            showStatus('Error deleting project: ' + error.message, 'error');
        }
    }
}

// Service management
function renderServicesList() {
    const container = document.getElementById('servicesList');
    container.innerHTML = '';
    
    services.forEach((service, index) => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'item-card';
        serviceDiv.innerHTML = `
            <h4>Service ${index + 1}</h4>
            <div class="grid">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" id="serviceName_${service.id}" value="${service.name || ''}">
                </div>
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="text" id="serviceImage_${service.id}" value="${service.image || ''}" readonly>
                    <button onclick="uploadServiceImage('${service.id}')" class="btn" style="margin-top: 10px;">Upload Image</button>
                    ${service.image ? `<img src="${service.image}" class="image-preview" alt="Preview">` : ''}
                </div>
                <div class="form-group">
                    <label>Alt Text:</label>
                    <input type="text" id="serviceAlt_${service.id}" value="${service.alt || ''}">
                </div>
            </div>
            <div class="btn-group">
                <button onclick="updateService('${service.id}')" class="btn btn-success">Update</button>
                <button onclick="deleteService('${service.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(serviceDiv);
    });
}

async function addService() {
    try {
        await addDoc(collection(db, 'services'), {
            name: 'New Service',
            image: '',
            alt: ''
        });
        loadContent();
        showStatus('Service added!', 'success');
    } catch (error) {
        showStatus('Error adding service: ' + error.message, 'error');
    }
}

async function updateService(serviceId) {
    try {
        await updateDoc(doc(db, 'services', serviceId), {
            name: document.getElementById(`serviceName_${serviceId}`).value,
            image: document.getElementById(`serviceImage_${serviceId}`).value,
            alt: document.getElementById(`serviceAlt_${serviceId}`).value
        });
        showStatus('Service updated!', 'success');
    } catch (error) {
        showStatus('Error updating service: ' + error.message, 'error');
    }
}

async function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        try {
            await deleteDoc(doc(db, 'services', serviceId));
            loadContent();
            showStatus('Service deleted!', 'success');
        } catch (error) {
            showStatus('Error deleting service: ' + error.message, 'error');
        }
    }
}

// News management
function renderNewsList() {
    const container = document.getElementById('newsList');
    container.innerHTML = '';
    
    newsItems.forEach((news, index) => {
        const newsDiv = document.createElement('div');
        newsDiv.className = 'item-card';
        newsDiv.innerHTML = `
            <h4>News Item ${index + 1}</h4>
            <div class="grid">
                <div class="form-group">
                    <label>Date:</label>
                    <input type="text" id="newsDate_${news.id}" value="${news.date || ''}">
                </div>
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" id="newsTitle_${news.id}" value="${news.title || ''}">
                </div>
                <div class="form-group">
                    <label>Image URL:</label>
                    <input type="text" id="newsImage_${news.id}" value="${news.image || ''}" readonly>
                    <button onclick="uploadNewsImage('${news.id}')" class="btn" style="margin-top: 10px;">Upload Image</button>
                    ${news.image ? `<img src="${news.image}" class="image-preview" alt="Preview">` : ''}
                </div>
                <div class="form-group">
                    <label>Alt Text:</label>
                    <input type="text" id="newsAlt_${news.id}" value="${news.alt || ''}">
                </div>
                <div class="form-group">
                    <label>Link Text:</label>
                    <input type="text" id="newsLink_${news.id}" value="${news.linkText || ''}">
                </div>
            </div>
            <div class="btn-group">
                <button onclick="updateNews('${news.id}')" class="btn btn-success">Update</button>
                <button onclick="deleteNews('${news.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(newsDiv);
    });
}

async function addNews() {
    try {
        await addDoc(collection(db, 'news'), {
            date: 'New Date',
            title: 'New News Item',
            image: '',
            alt: '',
            linkText: 'Learn more'
        });
        loadContent();
        showStatus('News item added!', 'success');
    } catch (error) {
        showStatus('Error adding news item: ' + error.message, 'error');
    }
}

async function updateNews(newsId) {
    try {
        await updateDoc(doc(db, 'news', newsId), {
            date: document.getElementById(`newsDate_${newsId}`).value,
            title: document.getElementById(`newsTitle_${newsId}`).value,
            image: document.getElementById(`newsImage_${newsId}`).value,
            alt: document.getElementById(`newsAlt_${newsId}`).value,
            linkText: document.getElementById(`newsLink_${newsId}`).value
        });
        showStatus('News item updated!', 'success');
    } catch (error) {
        showStatus('Error updating news item: ' + error.message, 'error');
    }
}

async function deleteNews(newsId) {
    if (confirm('Are you sure you want to delete this news item?')) {
        try {
            await deleteDoc(doc(db, 'news', newsId));
            loadContent();
            showStatus('News item deleted!', 'success');
        } catch (error) {
            showStatus('Error deleting news item: ' + error.message, 'error');
        }
    }
}

// Cloudinary Upload Functions
function uploadProjectImage(projectId) {
    openCloudinaryWidget((imageUrl) => {
        document.getElementById(`projectImage_${projectId}`).value = imageUrl;
        showStatus('Image uploaded successfully!', 'success');
        loadContent(); // Refresh to show preview
    });
}

function uploadServiceImage(serviceId) {
    openCloudinaryWidget((imageUrl) => {
        document.getElementById(`serviceImage_${serviceId}`).value = imageUrl;
        showStatus('Image uploaded successfully!', 'success');
        loadContent(); // Refresh to show preview
    });
}

function uploadNewsImage(newsId) {
    openCloudinaryWidget((imageUrl) => {
        document.getElementById(`newsImage_${newsId}`).value = imageUrl;
        showStatus('Image uploaded successfully!', 'success');
        loadContent(); // Refresh to show preview
    });
}

function openCloudinaryWidget(onSuccess) {
    const widget = cloudinary.createUploadWidget(
        {
            cloudName: cloudinaryConfig.cloudName,
            uploadPreset: 'atelia_uploads', // You need to create this preset
            folder: 'atelia',
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFileSize: 5000000, // 5MB
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            cropping: true,
            croppingAspectRatio: null,
            croppingShowDimensions: true,
            showSkipCropButton: true,
            theme: 'minimal',
            styles: {
                palette: {
                    window: '#FFFFFF',
                    windowBorder: '#3A3A3A',
                    tabIcon: '#3A3A3A',
                    menuIcons: '#3A3A3A',
                    textDark: '#000000',
                    textLight: '#FFFFFF',
                    link: '#3A3A3A',
                    action: '#3A3A3A',
                    inactiveTabIcon: '#999999',
                    error: '#F44235',
                    inProgress: '#3A3A3A',
                    complete: '#4CAF50',
                    sourceBg: '#F5F5F5'
                }
            }
        },
        (error, result) => {
            if (!error && result && result.event === 'success') {
                console.log('Upload successful:', result.info);
                const imageUrl = result.info.secure_url;
                if (onSuccess) {
                    onSuccess(imageUrl);
                }
                widget.close();
            } else if (error) {
                console.error('Upload error:', error);
                showStatus('Upload failed: ' + error.message, 'error');
            }
        }
    );
    
    widget.open();
}

// Bookings Management
async function loadBookings() {
    try {
        const bookingsList = document.getElementById('bookingsList');
        if (!bookingsList) return; // Exit if element doesn't exist
        
        const q = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
        const bookingsSnapshot = await getDocs(q);
        bookings = [];
        bookingsSnapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        renderBookings();
        updateBookingsCount();
    } catch (error) {
        console.error('Error loading bookings:', error);
        const bookingsList = document.getElementById('bookingsList');
        if (bookingsList) {
            bookingsList.innerHTML = '<p style="text-align: center; color: #dc3545;">Error loading bookings. Please refresh or check your connection.</p>';
        }
    }
}

function renderBookings() {
    const container = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">No bookings yet.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = `booking-card ${!booking.read ? 'unread' : ''}`;
        
        const timestamp = booking.timestamp?.toDate ? booking.timestamp.toDate().toLocaleString() : 'N/A';
        
        bookingCard.innerHTML = `
            <div class="booking-header">
                <div class="booking-info">
                    <h4>${booking.name}</h4>
                    <div class="booking-meta">${timestamp}</div>
                </div>
                <span class="booking-status-badge ${booking.status || 'new'}">${(booking.status || 'new').toUpperCase()}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail-row">
                    <div class="booking-detail-label">Email:</div>
                    <div class="booking-detail-value"><a href="mailto:${booking.email}">${booking.email}</a></div>
                </div>
                <div class="booking-detail-row">
                    <div class="booking-detail-label">Phone:</div>
                    <div class="booking-detail-value"><a href="tel:${booking.phone}">${booking.phone}</a></div>
                </div>
                <div class="booking-detail-row">
                    <div class="booking-detail-label">Service:</div>
                    <div class="booking-detail-value">${booking.service}</div>
                </div>
                <div class="booking-detail-row">
                    <div class="booking-detail-label">Message:</div>
                    <div class="booking-detail-value">${booking.message}</div>
                </div>
            </div>
            <div class="booking-actions">
                ${!booking.read ? `<button onclick="markAsRead('${booking.id}')" class="btn btn-success">Mark as Read</button>` : ''}
                <button onclick="updateBookingStatus('${booking.id}', 'contacted')" class="btn">Mark Contacted</button>
                <button onclick="updateBookingStatus('${booking.id}', 'completed')" class="btn">Mark Completed</button>
                <button onclick="deleteBooking('${booking.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        
        container.appendChild(bookingCard);
    });
}

function updateBookingsCount() {
    const unreadCount = bookings.filter(b => !b.read).length;
    const badge = document.getElementById('bookingsCount');
    if (badge) {
        badge.textContent = unreadCount > 0 ? unreadCount : '';
    }
}

async function markAsRead(bookingId) {
    try {
        await updateDoc(doc(db, 'bookings', bookingId), {
            read: true
        });
        await loadBookings();
        showStatus('Booking marked as read', 'success');
    } catch (error) {
        showStatus('Error updating booking: ' + error.message, 'error');
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        await updateDoc(doc(db, 'bookings', bookingId), {
            status: status,
            read: true
        });
        await loadBookings();
        showStatus(`Booking status updated to ${status}`, 'success');
    } catch (error) {
        showStatus('Error updating booking: ' + error.message, 'error');
    }
}

async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        await loadBookings();
        showStatus('Booking deleted successfully', 'success');
    } catch (error) {
        showStatus('Error deleting booking: ' + error.message, 'error');
    }
}

async function refreshBookings() {
    await loadBookings();
    showStatus('Bookings refreshed', 'success');
}

// Copy to Clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent || element.innerText;
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showStatus('Copied to clipboard!', 'success');
        }).catch(err => {
            // Fallback to old method
            fallbackCopy(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showStatus('Copied to clipboard!', 'success');
    } catch (err) {
        showStatus('Failed to copy. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Make functions globally available
window.saveHero = saveHero;
window.saveProjects = saveProjects;
window.saveAbout = saveAbout;
window.saveServices = saveServices;
window.saveNews = saveNews;
window.saveCTA = saveCTA;
window.saveSettings = saveSettings;
window.addProject = addProject;
window.updateProject = updateProject;
window.deleteProject = deleteProject;
window.uploadProjectImage = uploadProjectImage;
window.addService = addService;
window.updateService = updateService;
window.deleteService = deleteService;
window.uploadServiceImage = uploadServiceImage;
window.addNews = addNews;
window.updateNews = updateNews;
window.deleteNews = deleteNews;
window.uploadNewsImage = uploadNewsImage;
window.markAsRead = markAsRead;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.refreshBookings = refreshBookings;
window.copyToClipboard = copyToClipboard;
