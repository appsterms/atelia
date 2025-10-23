# Atelia Built - Production Mode Setup

## Firebase Production Configuration

Follow these steps to set up Firebase in **production mode** with proper security.

---

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **atelia-a0e81**
3. Click **Authentication** in the left sidebar
4. Click **Get Started**
5. Click on **Sign-in method** tab
6. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle to **Enable**
   - Click **Save**

---

## Step 2: Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **Add User**
3. Enter credentials:
   ```
   Email: admin@ateliabuilt.com
   Password: Atelia2024!Admin
   ```
4. Click **Add User**

**IMPORTANT:** Change this password immediately after first login!

---

## Step 3: Set Up Firestore Database (Production Mode)

1. Click **Firestore Database** in the left sidebar
2. Click **Create Database**
3. **Important:** Select **Production mode** (NOT test mode)
4. Choose your region (e.g., `us-central` or closest to your users)
5. Click **Enable**

---

## Step 4: Deploy Firestore Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with the content from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Content collections - read by everyone, write only by authenticated admins
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    // Projects collection
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    // Services collection
    match /services/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    // News collection
    match /news/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

---

## Step 5: Set Up Firebase Storage (Production Mode)

1. Click **Storage** in the left sidebar
2. Click **Get Started**
3. **Important:** Select **Production mode**
4. Choose the same region as your Firestore
5. Click **Done**

---

## Step 6: Deploy Storage Security Rules

1. In Storage, click the **Rules** tab
2. Replace the default rules with the content from `storage.rules` file:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Images folder - read by everyone, write only by authenticated admins
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    match /projects/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    match /services/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    match /news/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@ateliabuilt.com';
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

---

## Step 7: Enable Firebase Hosting (Optional - for deployment)

1. Click **Hosting** in the left sidebar
2. Click **Get Started**
3. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
4. Login to Firebase:
   ```bash
   firebase login
   ```
5. Initialize Firebase in your project folder:
   ```bash
   cd C:\Users\omar\Desktop\atelia
   firebase init
   ```
6. Select:
   - **Hosting** (use spacebar to select)
   - Use existing project: **atelia-a0e81**
   - Public directory: `.` (current directory)
   - Configure as single-page app: **No**
   - Set up automatic builds: **No**

7. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

Your site will be live at: `https://atelia-a0e81.web.app`

---

## Step 8: Configure Custom Domain (Optional)

1. In Firebase Console, go to **Hosting**
2. Click **Add custom domain**
3. Enter your domain (e.g., `ateliabuilt.com`)
4. Follow the DNS configuration instructions
5. Wait for SSL certificate provisioning (can take up to 24 hours)

---

## Security Rules Explanation

### Firestore Rules:
- ✅ **Public Read Access**: Anyone can read content (for the landing page)
- 🔒 **Admin Write Access**: Only `admin@ateliabuilt.com` can write/update
- ❌ **All Other Collections**: Denied by default

### Storage Rules:
- ✅ **Public Read Access**: Anyone can view images
- 🔒 **Admin Upload Access**: Only admin can upload/delete images
- ❌ **All Other Paths**: Denied by default

---

## Testing in Production Mode

1. Start your local server:
   ```bash
   python -m http.server 8000
   ```

2. Open admin panel:
   ```
   http://localhost:8000/admin.html
   ```

3. Login with admin credentials

4. Try to:
   - ✅ Read data (should work)
   - ✅ Write data when logged in (should work)
   - ❌ Write data when logged out (should fail)

---

## Security Checklist

- [x] Firebase Authentication enabled
- [x] Admin user created
- [x] Firestore in production mode
- [x] Firestore security rules deployed
- [x] Storage in production mode
- [x] Storage security rules deployed
- [ ] Change default admin password
- [ ] Set up 2FA for admin account (recommended)
- [ ] Enable Firebase App Check (recommended)
- [ ] Set up monitoring and alerts

---

## Monitoring and Maintenance

### Check Firebase Usage:
1. Go to Firebase Console
2. Click **Usage and billing**
3. Monitor:
   - Firestore reads/writes
   - Storage bandwidth
   - Authentication users

### Firebase Free Tier Limits:
- **Firestore**: 50K reads/day, 20K writes/day
- **Storage**: 1GB storage, 10GB/month bandwidth
- **Authentication**: Unlimited users
- **Hosting**: 10GB storage, 360MB/day bandwidth

---

## Backup Strategy

Set up automated backups:

1. Go to **Firestore Database**
2. Click **Import/Export** tab
3. Set up scheduled exports to Cloud Storage
4. Choose frequency (daily recommended)

---

## Admin Access URLs

- **Local Development**: http://localhost:8000/admin.html
- **Firebase Hosting**: https://atelia-a0e81.web.app/admin.html
- **Custom Domain**: https://ateliabuilt.com/admin.html

---

## Default Admin Credentials

```
Email: admin@ateliabuilt.com
Password: Atelia2024!Admin
```

⚠️ **CRITICAL:** Change this password immediately after first login!

To change password:
1. Firebase Console → Authentication → Users
2. Click on admin user
3. Click "Reset password" or use "Forgot password" on login page

---

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Check browser console for errors
3. Verify security rules are published
4. Ensure admin email matches exactly in rules

For Firebase support:
- Documentation: https://firebase.google.com/docs
- Support: https://firebase.google.com/support

