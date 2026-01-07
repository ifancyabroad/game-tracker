# Settings Setup Guide

The app now includes a settings system that allows admins to customize branding and theme.

## Initial Setup

### Deploy Security Rules

Deploy the updated security rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Or paste the rules manually in the Firebase Console under **Firestore Database** → **Rules**.

**That's it!** The settings document will be automatically created the first time an admin saves any settings changes in the app.

## Available Themes

The following theme names are available (use exactly as shown):

- `game-table` - Warm beige and brown tones (default, current light theme)
- `warm-charcoal` - Dark and cozy with warm orange accents (current dark theme)
- `ocean-breeze` - Light theme with blue and teal tones
- `ocean-night` - Deep navy theme with cyan accents
- `forest` - Natural green and brown tones
- `sunset` - Vibrant oranges and purples

## Using Settings as Admin

Once the initial document is created:

1. Log in with an admin account
2. Go to **Settings** in the sidebar (admin-only)
3. Customize:
    - **Branding:** Change app name, upload custom logo
    - **Theme:** Select from available theme presets

Changes are saved to Firestore and applied immediately across the app.

## What Settings Control

### App Name

- Appears in header (mobile)
- Appears in sidebar
- Updates browser tab title dynamically

### Logo

- Replaces default logo in header and sidebar when uploaded
- Accepts PNG, JPG, or SVG (max 2MB)
- Recommended size: 200×60px (wide format)
- Falls back to default logo + app name if not set

### Theme

- Complete color scheme for the entire app
- Replaces the previous light/dark mode toggle
- Each theme defines all CSS custom properties
- Applied dynamically without page reload

## Troubleshooting

**Can't save settings:**

- Verify you're logged in as an admin user
- Check that security rules allow admin writes to `settings/*`
- Verify `updatedBy` field is being set correctly

**Theme not applying:**

- Check that `themeName` matches one of the available themes exactly
- Look for console errors in re deployed and allow admin writes to `settings/*` variables
