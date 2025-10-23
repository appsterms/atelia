// Booking Form Handler
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Modal functions
window.openBookingModal = function() {
    document.getElementById('bookingModal').classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

window.closeBookingModal = function() {
    document.getElementById('bookingModal').classList.remove('show');
    document.body.style.overflow = ''; // Restore scroll
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingStatus').className = 'booking-status';
    document.getElementById('bookingStatus').textContent = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        window.closeBookingModal();
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-booking-btn');
            const statusDiv = document.getElementById('bookingStatus');
            
            // Get form data
            const bookingData = {
                name: document.getElementById('bookingName').value.trim(),
                email: document.getElementById('bookingEmail').value.trim(),
                phone: document.getElementById('bookingPhone').value.trim(),
                service: document.getElementById('bookingService').value,
                message: document.getElementById('bookingMessage').value.trim(),
                timestamp: serverTimestamp(),
                status: 'new',
                read: false
            };
            
            // Validate
            if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.service || !bookingData.message) {
                showStatus('Please fill in all required fields', 'error');
                return;
            }
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                // Save to Firestore
                await addDoc(collection(db, 'bookings'), bookingData);
                
                // Show success message
                showStatus('Thank you! Your booking request has been submitted. We\'ll contact you soon.', 'success');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    window.closeBookingModal();
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting booking:', error);
                showStatus('Sorry, there was an error submitting your request. Please try again or call us directly.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Booking Request';
            }
        });
    }
});

function showStatus(message, type) {
    const statusDiv = document.getElementById('bookingStatus');
    statusDiv.textContent = message;
    statusDiv.className = `booking-status ${type}`;
}

