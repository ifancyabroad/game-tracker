# Authentication Setup Guide

This application uses Firebase Authentication with role-based access control (RBAC).

## User Roles

- **Admin**: Full access to create, edit, and delete all data (players, games, events, results, users)
- **User**: View-only access with ability to edit their own profile

## First Admin Setup

Since the Firestore security rules require an admin user to create other users, you'll need to manually set up the first admin account.

### Step 1: Create Firebase Auth User

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to your project
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter email and password for the first admin
6. Copy the **User UID** (you'll need this in the next step)

### Step 2: Create Firestore User Document

1. In Firebase Console, go to **Firestore Database**
2. Navigate to the `users` collection (create it if it doesn't exist)
3. Add a new document with the **User UID** as the document ID
4. Set the following fields:

```
{
  "id": "<User UID>",
  "email": "admin@example.com",
  "role": "admin",
  "linkedPlayerId": null,
  "createdAt": "2026-01-02T12:00:00.000Z"
}
```

**Important:** Make sure the document ID matches the Firebase Auth UID and the `role` field is set to `"admin"`.

### Step 3: Deploy Firestore Security Rules

Deploy the security rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Or use the Firebase Console to manually paste the rules from the `firestore.rules` file.

## Creating Additional Users

Once you have an admin account set up:

1. Log in with your admin credentials
2. Navigate to **Users** in the sidebar (admin-only section)
3. Click **Add User**
4. Fill in the user details:
    - Email (required)
    - Role (admin or user)
    - Link to Player (optional)
5. Click **Create User**

The system will automatically:

- Create the Firebase Auth account with a temporary password
- Send a password reset email to the user
- Create the user document in Firestore

**Tell the new user to check their email inbox** for a password setup link from Firebase. They should:

1. Check their email (including spam folder)
2. Click the password reset link
3. Set their own password
4. Return to the app and log in with their email and new password

## Linking Users to Players

Users can be linked to player profiles:

- Admins can link/unlink users to players in the Users management page
- When linked, user profile edits (via /profile page) directly update the linked player data
- When unlinking, a warning is shown but the user account remains active
- Players can exist without linked users (for tracking guests)
- Users can exist without linked players (for admin-only accounts)

## Password Reset

Users can reset their password at any time using Firebase's built-in password reset flow:

1. On the login page, click **"Forgot password?"**
2. Enter your email address (the same field used for logging in)
3. Click the **"Forgot password?"** link
4. Check your email for the reset link
5. Follow the link to set a new password
6. Return to the app and log in with your new password

Note: You must enter your email address before clicking "Forgot password?" so the system knows where to send the reset link.

## Permissions Summary

| Action             | Admin | User | Unauthenticated |
| ------------------ | ----- | ---- | --------------- |
| View all data      | ✅    | ✅   | ✅              |
| Manage players     | ✅    | ❌   | ❌              |
| Manage games       | ✅    | ❌   | ❌              |
| Manage events      | ✅    | ❌   | ❌              |
| Manage results     | ✅    | ❌   | ❌              |
| Manage users       | ✅    | ❌   | ❌              |
| Edit linked player | ✅    | ✅   | ❌              |

## Future Enhancements

Potential features for future development:

- User profile pages with linked player stats
- Email verification for new users
- Invite-only user creation with tokens
- Activity logging (who created/modified what)
- Player self-management (players editing their own data)
- Comments and interactions on events/games
