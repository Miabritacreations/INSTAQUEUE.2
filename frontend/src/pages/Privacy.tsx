import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const Privacy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: December 18, 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to InstaQueue ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our campus queue management system.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect the following personal information when you register and use our service:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Student ID number</li>
              <li>Department and year of study</li>
              <li>Password (encrypted)</li>
            </ul>

            <h3>2.2 Appointment Information</h3>
            <ul>
              <li>Appointment dates and times</li>
              <li>Department selections</li>
              <li>Queue positions and numbers</li>
              <li>Appointment status and history</li>
              <li>Reasons for appointments</li>
            </ul>

            <h3>2.3 Usage Information</h3>
            <ul>
              <li>Login times and activity logs</li>
              <li>Feedback and ratings submitted</li>
              <li>Notification preferences</li>
              <li>Browser type and version</li>
              <li>IP address</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To create and manage your account</li>
              <li>To process and manage appointments</li>
              <li>To send notifications about your queue status</li>
              <li>To improve our services and user experience</li>
              <li>To communicate with you about service updates</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To ensure system security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing and Disclosure</h2>
            <h3>4.1 Within the Institution</h3>
            <p>
              Your appointment information may be shared with relevant campus departments to facilitate service delivery. Department administrators can view appointments scheduled with their departments.
            </p>

            <h3>4.2 Third-Party Service Providers</h3>
            <p>
              We may share your information with trusted third-party service providers who assist us in operating our platform, such as:
            </p>
            <ul>
              <li>Hosting and infrastructure providers</li>
              <li>Email service providers</li>
              <li>Analytics services</li>
            </ul>
            <p>These providers are bound by confidentiality agreements and are only authorized to use your information as necessary to provide services to us.</p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or governmental regulation, or if we believe such action is necessary to:
            </p>
            <ul>
              <li>Comply with legal processes</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or security issues</li>
              <li>Protect user safety</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul>
              <li>Encryption of passwords using bcrypt hashing</li>
              <li>JWT token-based authentication</li>
              <li>HTTPS encryption for data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure database storage with backups</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>6. Your Rights and Choices</h2>
            <h3>6.1 Access and Update</h3>
            <p>
              You can access and update your personal information at any time through your profile settings.
            </p>

            <h3>6.2 Account Deletion</h3>
            <p>
              You may request deletion of your account by contacting us at support@instaqueue.com. Please note that some information may be retained for legal or administrative purposes.
            </p>

            <h3>6.3 Notification Preferences</h3>
            <p>
              You can manage your notification preferences in your account settings.
            </p>

            <h3>6.4 Data Portability</h3>
            <p>
              You have the right to request a copy of your personal data in a machine-readable format.
            </p>
          </section>

          <section>
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage and performance</li>
              <li>Improve user experience</li>
            </ul>
            <p>
              You can control cookie settings through your browser, but disabling cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for:
            </p>
            <ul>
              <li>Legal compliance (typically 7 years for educational records)</li>
              <li>Dispute resolution</li>
              <li>Fraud prevention</li>
              <li>Anonymized analytics</li>
            </ul>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our service is intended for students and staff of educational institutions. We do not knowingly collect information from individuals under 13 years of age. If we discover that we have inadvertently collected such information, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul>
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification for material changes</li>
            </ul>
            <p>
              Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@instaqueue.com</p>
              <p><strong>Support:</strong> support@instaqueue.com</p>
              <p><strong>Address:</strong> InstaQueue Privacy Department, Campus Administration Building</p>
            </div>
          </section>

          <section>
            <h2>13. GDPR Compliance (For EU Users)</h2>
            <p>
              If you are located in the European Union, you have additional rights under GDPR:
            </p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with supervisory authority</li>
            </ul>
          </section>
        </div>

        <div className="legal-acknowledgment">
          <p>
            By using InstaQueue, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Privacy;
