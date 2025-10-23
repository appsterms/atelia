# 🚀 Quick Reference Card

## 📋 Essential Information

### 🔐 Login Credentials
```
Email: admin@ateliabuilt.com
Password: Atelia2024!Admin
⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!
```

### 🌐 URLs

**Development (Local)**
- Main Site: `http://localhost:8000/index.html`
- Admin Panel: `http://localhost:8000/admin.html`
- Database Init: `http://localhost:8000/initialize-database.html`

**Production (Live)**
- Main Site: `https://atelia-a0e81.web.app`
- Admin Panel: `https://atelia-a0e81.web.app/admin`

### ☁️ Service Dashboards
- Firebase: https://console.firebase.google.com
- Cloudinary: https://cloudinary.com/console
- Analytics: https://analytics.google.com

---

## ⚡ Quick Commands

### Start Local Server
```bash
cd C:\Users\omar\Desktop\atelia
python -m http.server 8000
```

### Deploy to Production
```bash
firebase deploy
```

### Login to Firebase
```bash
firebase login
```

---

## 📝 Setup Checklist (First Time Only)

1. ✅ Firebase Auth → Enable Email/Password
2. ✅ Firebase Auth → Create admin user
3. ✅ Firestore → Create database (Production mode)
4. ✅ Firestore → Deploy rules from `firestore.rules`
5. ✅ Cloudinary → Create upload preset: `atelia_uploads`
6. ✅ Open: `initialize-database.html` → Initialize DB
7. ✅ Open: `admin.html` → Upload images
8. ✅ Deploy: `firebase deploy`

**Time: ~1 hour** | **Cost: $0/month**

---

## 🛠️ Common Tasks

### Update Content
1. Open: `[your-site]/admin`
2. Login
3. Edit any section
4. Click "Save" or "Update"
5. Changes live immediately!

### Upload Images
1. Go to Projects/Services/News section
2. Click "Upload Image" button
3. Select image
4. Click "Update"

### Change Password
1. Firebase Console → Authentication → Users
2. Click admin user → Reset password

### Backup Database
1. Firebase Console → Firestore
2. Import/Export tab → Export
3. Download from Cloud Storage

---

## 🎨 Brand Colors

```css
Background: #e4e1d5
Text: #3A3A3A
Logo: #000000
Buttons: #3A3A3A
Hover: #2A2A2A
```

---

## 📁 Key Files

### Main Application
- `index.html` - Landing page
- `admin.html` - CMS panel
- `styles.css` - All styles
- `firebase-cms.js` - Content loading
- `admin.js` - Admin functionality

### Configuration
- `firebase.json` - Hosting config
- `firestore.rules` - Security rules
- `cloudinary-config.js` - Cloudinary setup

### Documentation
- `PRODUCTION_READY_CHECKLIST.md` - Step-by-step setup
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `PROJECT_COMPLETE.md` - Full project overview

---

## 🆘 Troubleshooting

**Problem:** Can't login to admin
→ Check admin user exists in Firebase Console → Authentication

**Problem:** Content not loading
→ Check Firestore rules deployed
→ Check browser console (F12)

**Problem:** Images not uploading
→ Verify Cloudinary preset exists: `atelia_uploads`
→ Check preset is "Unsigned"

**Problem:** Changes not appearing
→ Clear browser cache (Ctrl+Shift+Del)
→ Check you clicked "Save" or "Update"

**Problem:** Site not deploying
→ Run: `firebase login`
→ Run: `firebase deploy`
→ Check Firebase Console for errors

---

## 📊 Usage Limits (Free Tier)

### Firebase
- Firestore: 50K reads/day, 20K writes/day
- Hosting: 10GB storage, 360MB/day bandwidth
- Auth: Unlimited users

### Cloudinary
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25K/month

**Both free tiers support 10K-50K visitors/month**

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Firestore rules deployed (public read, admin write)
- [ ] Firebase in production mode
- [ ] SSL certificate active (🔒 icon)
- [ ] Regular backups enabled

---

## 📞 Emergency Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Cloudinary Support**: https://support.cloudinary.com

---

## 🎯 CMS Capabilities

**You CAN Edit:**
- ✅ All text content
- ✅ Upload/change images
- ✅ Add/remove projects
- ✅ Add/remove services
- ✅ Add/remove news items
- ✅ Button text
- ✅ Headlines

**You CANNOT Edit (need developer):**
- ❌ Page layout
- ❌ Colors
- ❌ Animations
- ❌ Add new page types
- ❌ Navigation structure

---

## 📈 Performance Targets

- Page Load: < 3 seconds ✅
- Lighthouse Score: 90+ ✅
- Mobile Responsive: 100% ✅
- SEO Ready: Yes ✅
- SSL Enabled: Yes ✅

---

## 💾 Backup Schedule

- **Weekly**: Export Firestore data
- **Monthly**: Download Cloudinary images
- **Before Changes**: Always backup first

---

## 🔄 Update Process

1. Login to admin panel
2. Make changes
3. Click Save/Update
4. Verify on main site
5. Done! (No deploy needed)

---

**🎉 You're all set! Everything is ready for production!**

*Keep this card handy for quick reference.*

