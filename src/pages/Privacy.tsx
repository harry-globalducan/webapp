import { Link } from 'react-router-dom'
import LegalDocument, { type LegalSection } from '../components/LegalDocument'

const UPDATED = '7 August 2026'

const sections: LegalSection[] = [
  {
    id: 'intro',
    title: 'Introduction',
    body: (
      <>
        <p>
          This Privacy Policy explains how Global Ducan (“we”, “us”, “our”) collects, uses, shares and
          protects personal information when you use our website, apps, Chrome extension and support
          channels (the “Service”).
        </p>
        <p>
          By using the Service you acknowledge this Policy. For how shopping and shipping work
          contractually, see our <Link to="/terms">Terms &amp; Conditions</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'Information we collect',
    body: (
      <>
        <p>We may collect:</p>
        <ul>
          <li>
            <strong>Account data</strong> — name, email, phone, password (stored hashed), referral
            codes.
          </li>
          <li>
            <strong>Delivery data</strong> — shipping addresses, contact numbers, preferred language
            and currency.
          </li>
          <li>
            <strong>Order data</strong> — product URLs, store names, quantities, variants, warehouse
            photos, parcel weights and tracking numbers.
          </li>
          <li>
            <strong>Payment data</strong> — wallet balances, invoice amounts, limited payment-method
            metadata from our processors (we do not store full card numbers).
          </li>
          <li>
            <strong>Usage &amp; device data</strong> — pages viewed, approximate location (city /
            country), device/browser type, IP address, and crash or performance logs.
          </li>
          <li>
            <strong>Support content</strong> — messages, attachments and call notes when you contact
            us.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'sources',
    title: 'How we get information',
    body: (
      <ul>
        <li>Directly from you (forms, paste-capture, checkout, chat).</li>
        <li>Automatically via cookies, local storage and similar technologies.</li>
        <li>From payment, logistics and analytics partners acting on our instructions.</li>
        <li>From product pages only as needed to resolve price and variants you asked us to buy.</li>
      </ul>
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    body: (
      <>
        <p>We use personal data to:</p>
        <ul>
          <li>Create and secure your account, wallet and orders.</li>
          <li>Purchase, warehouse, consolidate and ship parcels to you.</li>
          <li>Estimate duties, convert currencies and process payments.</li>
          <li>Provide customer support and send transactional emails / WhatsApp updates.</li>
          <li>Improve the Service, prevent fraud and enforce our Terms.</li>
          <li>
            Measure product usage with analytics (including Amplitude session analytics and, where
            enabled, session replay) so we can understand flows like capture and checkout.
          </li>
          <li>Send marketing only where you have opted in or where permitted by law — you can opt out anytime.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'legal-bases',
    title: 'Legal bases (where applicable)',
    body: (
      <p>
        Depending on your location, we process data under contract (to run your orders), legitimate
        interests (security, product improvement), consent (optional marketing, certain cookies /
        replay), and legal obligation (tax, accounting, regulatory requests).
      </p>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing & processors',
    body: (
      <>
        <p>We share data only as needed with:</p>
        <ul>
          <li>Indian retailers (to place your order).</li>
          <li>Warehousing, courier and postal partners for fulfilment and customs.</li>
          <li>Payment gateways and banking partners.</li>
          <li>Cloud hosting, email/SMS, customer-support and analytics providers (e.g. Amplitude).</li>
          <li>Authorities when required by law or to protect rights and safety.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </>
    ),
  },
  {
    id: 'transfers',
    title: 'International transfers',
    body: (
      <p>
        Your data may be processed in India, your destination country and countries where our
        processors operate. Where required, we use appropriate safeguards (such as contractual
        clauses) for cross-border transfers.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'Retention',
    body: (
      <p>
        We keep account and order records for as long as you have an account and afterward as needed
        for disputes, audits, tax and legal requirements. Support chats and analytics events are kept
        for shorter operational periods unless a longer period is required.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We use industry-standard measures (encryption in transit, access controls, least-privilege
        staff access). No method of transmission or storage is 100% secure; please use a strong
        unique password and enable any security options we offer.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & similar tech',
    body: (
      <>
        <p>We use:</p>
        <ul>
          <li>Essential cookies / local storage for login, cart and preferences.</li>
          <li>Analytics cookies or SDKs to understand feature usage and improve UX.</li>
          <li>Session replay tooling (where enabled) to diagnose broken flows — sensitive fields are masked where configured.</li>
        </ul>
        <p>You can control cookies via your browser; blocking essentials may break sign-in or checkout.</p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>Subject to local law, you may have the right to:</p>
        <ul>
          <li>Access, correct or delete personal data.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Port data in a common format.</li>
          <li>Withdraw consent where processing is consent-based.</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </ul>
        <p>
          Request these via <Link to="/support">Support</Link> or your account profile tools. We may
          need to verify your identity before acting.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        The Service is not directed to children under 18. We do not knowingly collect their personal
        data. If you believe a child has registered, contact Support and we will delete the account.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this Policy and will revise the “Last updated” date above. Significant changes
        may also be announced in-product or by email.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Privacy questions: reach us through <Link to="/support">Support</Link>. For account-specific
        data requests, include the email on your Global Ducan account.
      </p>
    ),
  },
]

export default function Privacy() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy"
      accent="policy"
      summary="How Global Ducan collects, uses and protects your personal information across web, app and support."
      updated={UPDATED}
      sections={sections}
      otherDoc={{ label: 'Read our Terms & Conditions', to: '/terms' }}
    />
  )
}
