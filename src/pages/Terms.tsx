import { Link } from 'react-router-dom'
import LegalDocument, { type LegalSection } from '../components/LegalDocument'

const UPDATED = '7 August 2026'

const sections: LegalSection[] = [
  {
    id: 'agreement',
    title: 'Agreement to these terms',
    body: (
      <>
        <p>
          These Terms &amp; Conditions (“Terms”) govern your use of Global Ducan’s websites, mobile
          apps, Chrome extension and related services (together, the “Service”). By creating an
          account, pasting a product link, or paying an invoice, you agree to these Terms.
        </p>
        <p>
          If you do not agree, please do not use the Service. Capitalised words have the meanings
          given in these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          Global Ducan (“we”, “us”, “our”) is an India proxy shopping and international shipping
          service. We buy eligible goods from supported Indian retailers on your behalf, receive them
          at our India warehouse, consolidate and quality-check parcels, then ship them to your
          delivery address — including markets across the Indian Ocean and Gulf.
        </p>
        <p>
          We are <strong>not</strong> Amazon, Myntra, Nykaa or any other retailer. Product
          descriptions, stock and pricing on store sites belong to those merchants.
        </p>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & accounts',
    body: (
      <>
        <p>You must be at least 18 years old (or the age of majority where you live) to use Global Ducan.</p>
        <ul>
          <li>Provide accurate registration details and keep them up to date.</li>
          <li>You are responsible for activity under your login and wallet.</li>
          <li>We may suspend or close accounts that breach these Terms or applicable law.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'service',
    title: 'How the service works',
    body: (
      <>
        <p>Typical flow:</p>
        <ul>
          <li>
            <strong>Shop</strong> on a supported Indian store (extension, paste URL, or mobile share).
          </li>
          <li>
            <strong>Pay the item fee</strong> (product price plus our proxy service fee) so we can
            purchase on your behalf.
          </li>
          <li>
            Items arrive at our <strong>India warehouse</strong> for inspection and optional storage.
          </li>
          <li>
            You <strong>consolidate and pay shipping</strong> (and estimated duties where applicable)
            based on actual or volumetric weight — the second payment step.
          </li>
          <li>We dispatch to your address according to the courier and destination rules.</li>
        </ul>
        <p>
          Landed-cost estimates shown before purchase are indicative. Final international postage is
          confirmed when the parcel is weighed after consolidation. See also our{' '}
          <Link to="/shipping">Shipping fees &amp; restrictions</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'orders-payment',
    title: 'Orders, fees & payment',
    body: (
      <>
        <ul>
          <li>
            Item fees and shipping invoices may be charged separately (wallet, card or other methods
            we offer).
          </li>
          <li>
            Currency conversion and payment gateway fees may apply and will be shown where known.
          </li>
          <li>
            If a retailer cancels, goes out of stock, or changes price after you authorise purchase,
            we will notify you and refund or adjust the unspent portion of the item fee according to
            our refund practice.
          </li>
          <li>
            Coupons and promotions are subject to their own rules and may exclude shipping or duties.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'restricted',
    title: 'Restricted & prohibited items',
    body: (
      <>
        <p>
          You must not request items that are illegal to buy, possess or import in India or your
          destination country, or that our carriers refuse (for example loose lithium batteries,
          aerosols, weapons, counterfeit goods, or perishable foods).
        </p>
        <p>
          We may refuse, cancel or dispose of restricted goods without completing international
          shipping. Review the restrictions list on our{' '}
          <Link to="/shipping">shipping page</Link> before ordering.
        </p>
      </>
    ),
  },
  {
    id: 'warehouse',
    title: 'Warehouse, storage & inspection',
    body: (
      <>
        <p>
          Eligible items receive photo quality checks at our India hub. Free storage is offered for a
          limited period (currently up to 30 days unless we notify otherwise); storage fees or
          disposition may apply after that.
        </p>
        <p>
          Warehouse photos help you confirm colour and size before consolidation. They are not a
          guarantee against all manufacturing defects or transit damage after dispatch.
        </p>
      </>
    ),
  },
  {
    id: 'shipping-customs',
    title: 'Shipping, customs & delivery',
    body: (
      <>
        <ul>
          <li>
            Transit times are estimates. Force majeure, carrier delays and customs holds are outside
            our sole control.
          </li>
          <li>
            On DDP routes we aim to settle duties with the shipping invoice; other routes may require
            duty on delivery. You remain responsible for accurate addresses and local import
            compliance.
          </li>
          <li>
            Failed delivery, incorrect address details or refused parcels may incur return or
            re-delivery charges.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'refunds',
    title: 'Cancellations, returns & refunds',
    body: (
      <>
        <p>
          Retailer return windows and policies apply once we have purchased. International returns to
          India can be costly; we will advise when a return is practical.
        </p>
        <ul>
          <li>Unused item fees for failed retailer purchases are refunded to your wallet or original method where possible.</li>
          <li>Shipping fees already paid for parcels that have left the warehouse are generally non-refundable, except where we are at fault.</li>
          <li>Contact <Link to="/support">Support</Link> promptly with your order ID and photos for damaged goods claims.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <p>
        Global Ducan branding, the Service UI and our software are protected by intellectual property
        laws. You may not copy, scrape or reverse-engineer the Service except as allowed by law.
        Retailer trademarks remain their property.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Disclaimers & liability',
    body: (
      <>
        <p>
          The Service is provided on an “as available” basis. To the fullest extent permitted by law,
          we disclaim warranties that retailers’ listings are accurate or that delivery timelines are
          guaranteed.
        </p>
        <p>
          Our aggregate liability for claims arising from a specific order is limited to the fees you
          paid us for that order (excluding retailer product cost already remitted), except where
          liability cannot be limited by law (for example death or personal injury caused by
          negligence, or fraud).
        </p>
      </>
    ),
  },
  {
    id: 'law',
    title: 'Governing law',
    body: (
      <p>
        These Terms are governed by the laws applicable to Global Ducan’s principal place of
        business, without regard to conflict-of-law rules. Courts there have exclusive jurisdiction,
        subject to any mandatory consumer protections in your country of residence.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these Terms from time to time. Material changes will be posted on this page
        with a new “Last updated” date. Continued use after changes take effect constitutes
        acceptance. Related privacy practices are described in our{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these Terms: contact us via <Link to="/support">Support</Link>.
      </p>
    ),
  },
]

export default function Terms() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms &"
      accent="conditions"
      summary="The agreement between you and Global Ducan for proxy shopping from India and international delivery."
      updated={UPDATED}
      sections={sections}
      otherDoc={{ label: 'Read our Privacy Policy', to: '/privacy' }}
    />
  )
}
