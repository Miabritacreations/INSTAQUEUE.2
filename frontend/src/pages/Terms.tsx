import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/Legal.css';

const Terms: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: December 18, 2025</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to InstaQueue. By accessing or using our campus queue management system ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and InstaQueue. We reserve the right to modify these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>
              To use InstaQueue, you must:
            </p>
            <ul>
              <li>Be a currently enrolled student or authorized staff member of the institution</li>
              <li>Be at least 13 years of age</li>
              <li>Have a valid institutional email address</li>
              <li>Provide accurate and complete registration information</li>
              <li>Not have been previously banned from the Service</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              You must create an account to use our Service. When creating an account, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for safeguarding your account credentials. InstaQueue will never ask for your password via email or phone. Do not share your account with others.
            </p>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts that:
            </p>
            <ul>
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or abusive behavior</li>
              <li>Become inactive for extended periods</li>
              <li>Are associated with graduated or departed students/staff</li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <h3>4.1 Permitted Use</h3>
            <p>
              You may use InstaQueue to:
            </p>
            <ul>
              <li>Book and manage appointments with campus departments</li>
              <li>Track your position in queues</li>
              <li>Receive notifications about appointments</li>
              <li>Provide feedback on services</li>
              <li>Update your profile information</li>
            </ul>

            <h3>4.2 Prohibited Use</h3>
            <p>
              You agree NOT to:
            </p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Impersonate another person or entity</li>
              <li>Create multiple accounts to abuse the queue system</li>
              <li>Book appointments you do not intend to honor</li>
              <li>Harass, threaten, or abuse other users or staff</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Use automated tools (bots, scripts) to interact with the Service</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Introduce viruses, malware, or malicious code</li>
              <li>Scrape, mine, or harvest data from the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2>5. Appointments and Queue Management</h2>
            <h3>5.1 Booking Appointments</h3>
            <ul>
              <li>Appointments are subject to availability</li>
              <li>You may book one appointment per department at a time</li>
              <li>Queue positions are assigned automatically and fairly</li>
              <li>You must arrive within the designated time slot</li>
            </ul>

            <h3>5.2 Cancellations</h3>
            <ul>
              <li>You may cancel appointments through your dashboard</li>
              <li>Please cancel at least 24 hours in advance when possible</li>
              <li>Repeated no-shows may result in restrictions</li>
              <li>Departments reserve the right to cancel or reschedule appointments</li>
            </ul>

            <h3>5.3 Queue Etiquette</h3>
            <ul>
              <li>Arrive on time for your scheduled appointment</li>
              <li>Have all necessary documents prepared</li>
              <li>Be respectful to staff and other users</li>
              <li>Follow any additional department-specific rules</li>
            </ul>
          </section>

          <section>
            <h2>6. Notifications</h2>
            <p>
              By using our Service, you consent to receive:
            </p>
            <ul>
              <li>Appointment confirmations and reminders</li>
              <li>Queue status updates</li>
              <li>Service announcements</li>
              <li>Security alerts</li>
              <li>Policy updates</li>
            </ul>
            <p>
              You can manage notification preferences in your account settings, but some notifications are mandatory for service operation.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <h3>7.1 Ownership</h3>
            <p>
              InstaQueue and its original content, features, and functionality are owned by InstaQueue and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3>7.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for personal, non-commercial purposes in accordance with these Terms.
            </p>

            <h3>7.3 User Content</h3>
            <p>
              By submitting feedback, suggestions, or other content, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, and display such content for the purpose of operating and improving our Service.
            </p>
          </section>

          <section>
            <h2>8. Privacy and Data Protection</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <Link to="/privacy">Privacy Policy</Link> to understand our data practices.
            </p>
          </section>

          <section>
            <h2>9. Disclaimers and Limitations of Liability</h2>
            <h3>9.1 Service Availability</h3>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that:
            </p>
            <ul>
              <li>The Service will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>Results from using the Service will meet your expectations</li>
            </ul>

            <h3>9.2 Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, InstaQueue shall not be liable for:
            </p>
            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, or use</li>
              <li>Service interruptions or unavailability</li>
              <li>Errors or omissions in content</li>
              <li>Unauthorized access to your account</li>
              <li>Third-party conduct or content</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount you paid to use the Service (if any) in the 12 months preceding the claim.
            </p>

            <h3>9.3 Institutional Disclaimer</h3>
            <p>
              InstaQueue is a queue management tool. Final decisions regarding appointments, services, and departmental matters rest with the institution and relevant departments. We are not responsible for departmental policies or service delivery.
            </p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless InstaQueue, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your violation of any applicable laws</li>
            </ul>
          </section>

          <section>
            <h2>11. Third-Party Links and Services</h2>
            <p>
              Our Service may contain links to third-party websites or services. We are not responsible for:
            </p>
            <ul>
              <li>The content or privacy practices of third-party sites</li>
              <li>Any damages or losses caused by third-party services</li>
              <li>The availability or accuracy of third-party services</li>
            </ul>
            <p>
              Your use of third-party services is at your own risk and subject to their terms and policies.
            </p>
          </section>

          <section>
            <h2>12. Dispute Resolution</h2>
            <h3>12.1 Informal Resolution</h3>
            <p>
              Before filing a formal dispute, please contact us at support@instaqueue.com to seek an informal resolution.
            </p>

            <h3>12.2 Arbitration</h3>
            <p>
              Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with institutional policies, except where prohibited by law.
            </p>

            <h3>12.3 Class Action Waiver</h3>
            <p>
              You agree to resolve disputes individually and waive any right to participate in class action lawsuits or class-wide arbitration.
            </p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where the institution is located, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2>14. Modifications to Service</h2>
            <p>
              We reserve the right to:
            </p>
            <ul>
              <li>Modify or discontinue the Service (temporarily or permanently)</li>
              <li>Change features or functionality</li>
              <li>Implement usage limits</li>
              <li>Update these Terms</li>
            </ul>
            <p>
              We will provide reasonable notice of material changes when possible.
            </p>
          </section>

          <section>
            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and InstaQueue regarding the Service and supersede all prior agreements and understandings.
            </p>
          </section>

          <section>
            <h2>17. Contact Information</h2>
            <p>
              For questions, concerns, or support regarding these Terms or the Service:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@instaqueue.com</p>
              <p><strong>Support:</strong> support@instaqueue.com</p>
              <p><strong>Address:</strong> InstaQueue Legal Department, Campus Administration Building</p>
            </div>
          </section>

          <section>
            <h2>18. Acknowledgment</h2>
            <p>
              By using InstaQueue, you acknowledge that:
            </p>
            <ul>
              <li>You have read and understood these Terms</li>
              <li>You agree to be bound by these Terms</li>
              <li>You meet the eligibility requirements</li>
              <li>You will use the Service responsibly and ethically</li>
            </ul>
          </section>
        </div>

        <div className="legal-acknowledgment">
          <p>
            Thank you for using InstaQueue responsibly!
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Terms;
