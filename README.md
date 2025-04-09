# Innoprint - 3D Printing Service

Innoprint is a web application that allows users to upload 3D models and order high-quality prints delivered to their doorstep.

## Firebase Authentication Setup

This project uses Firebase for authentication. Follow these steps to set up Firebase authentication:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a web app to your Firebase project
3. Enable Authentication in the Firebase console and set up the following providers:
   - Email/Password
   - Google
4. Copy your Firebase configuration from the Firebase console
5. Update the `.env.local` file with your Firebase configuration values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Authentication Features

The following authentication features have been implemented:

- **Sign Up**: Users can create a new account using email/password or Google authentication
- **Login**: Users can sign in with their email/password or Google account
- **Forgot Password**: Users can reset their password via email
- **Profile Management**: Users can view and manage their profile information
- **Protected Routes**: Certain pages are only accessible to authenticated users - 3D Printing Service Website

Innoprint is a comprehensive 3D printing service platform that allows users to upload their 3D designs, browse a catalog of models, and order high-quality 3D prints with customizable specifications.

## Features

- **Home Page**: Attractive landing page with options to upload or browse catalog
- **Upload Page**: Drag-and-drop interface for uploading STL/OBJ and other 3D model files
- **Catalog Page**: Browse user-uploaded designs with filtering and search capabilities
- **Model Preview Page**: Interactive 3D model viewer with options to order prints or download models
- **Print Specification Page**: Customize material, size, quality, and other printing parameters
- **Delivery Page**: Options for pickup or address entry for delivery
- **Razorpay Payment Integration**: Secure payment processing
- **Order Confirmation**: Detailed order summary and next steps

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js with React Three Fiber and Drei
- **Payment**: Razorpay integration
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/innoprint.git
cd innoprint
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── public/            # Static files (images, 3D models)
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
├── .env.local         # Environment variables (create this file)
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies
└── tailwind.config.js # Tailwind CSS configuration
```

## Deployment

The application can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js applications.

```bash
npm run build
# or
yarn build
```

## Future Enhancements

- User profiles and saved designs
- Admin dashboard for order management
- Real-time order tracking
- Integration with more payment gateways
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.