import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-paper sm:text-4xl">Terms and Conditions</h1>
        <p className="mt-2 text-ink-soft dark:text-pair/60">Last updated: September 1, 2026 · Department of Science Education, SED_QUIZSTAR</p>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="font-semibold text-lg text-ink dark:text-paper mb-2">1. Purpose</h2>
        <p className="text-sm text-ink-soft dark:text-pair/60">SED_QUIZSTAR is an educational platform for Department of Science Education students to practice past questions. Accounts, scores and leaderboards exist to support learning.</p>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="font-semibold text-lg text-ink dark:text-paper mb-2">2. Your Account</h2>
        <p className="text-sm text-ink-soft dark:text-pair/60">You must provide your real name, a valid email address and a secure password when registering. You are responsible for keeping your login details private. One person may hold only one account.</p>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="font-semibold text-lg text-ink dark:text-paper mb-2">3. One Account Per Device</h2>
        <p className="text-sm text-ink-soft dark:text-pair/60">To keep the leaderboard fair, each device may be used for one account only, and each account is tied to the device it was created on.</p>
        <ul className="mt-2 list-disc list-inside text-sm text-ink-soft dark:text-pair/60 space-y-1">
          <li>Registering a second account on the same phone will be declined.</li>
          <li>Logging in from a different device will be blocked until you log out of your original device.</li>
          <li>If you change phones, use Switch Device on the login page or contact an admin.</li>
        </ul>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="font-semibold text-lg text-ink dark:text-paper mb-2">4. Privacy</h2>
        <p className="text-sm text-ink-soft dark:text-pair/60">We collect only what is needed: your name, email, encrypted password, quiz scores, and a device identifier. We do not access your contacts, files, photos, location, or sell your information.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link to="/register" className="btn btn-primary">Back to Register</Link>
        <Link to="/login" className="btn btn-outline">Login</Link>
      </div>
    </div>
  );
}
