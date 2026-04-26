# Tutor Booking Platform — Frontend 🎨

Modern, responsive, and intuitive frontend for the Tutor Booking Platform.

## 🔗 Live URLs
- **Live Application**: [https://tutor-booking-frontend.vercel.app](https://tutor-booking-frontend.vercel.app)
- **Backend API**: [https://tutor-booking-backend.vercel.app](https://tutor-booking-backend.vercel.app)

## 📝 Project Description
The Tutor Booking Platform frontend provides a seamless experience for students to find and book tutors, and for tutors to manage their schedules and sessions. Built with performance and accessibility in mind, it features a sleek dark-themed UI with real-time updates and interactive dashboards.

## ✨ Features
- **Dynamic Dashboards**: Personalized views for Students, Tutors, and Admins.
- **Easy Booking**: Interactive calendar and slot selection for tutoring sessions.
- **Secure Auth**: Seamless login and registration with Google and Email.
- **Payment Flow**: Integrated Stripe checkout for session bookings.

- **Real-time Notifications**: Instant feedback via Sonner and SweetAlert2.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **PDF Reports**: Export session data and summaries to PDF.

## 🛠️ Technologies Used
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn UI, Lucide React
- **Data Fetching**: Axios
- **Forms**: React Hook Form + Zod
- **Utilities**: clsx, tailwind-merge, date-fns

## ⚙️ Setup Instructions
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd tutor-booking-frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=https://tutor-booking-backend.vercel.app/api/v1
    ```
4.  **Run in Development**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```
