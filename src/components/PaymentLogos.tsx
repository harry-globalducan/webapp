/** Compact payment marks for the footer. */

const shell =
  'flex h-8 items-center justify-center rounded-md border border-white/15 bg-white px-2.5 shadow-sm'

export default function PaymentLogos() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {/* Visa */}
      <span className={shell} title="Visa">
        <svg viewBox="0 0 48 16" className="h-3.5 w-10" aria-hidden>
          <path
            fill="#1A1F71"
            d="M18.8 15.2H16l1.7-10.5h2.8L18.8 15.2zm12.1-10.2c-.6-.2-1.4-.5-2.5-.5-2.7 0-4.6 1.4-4.6 3.4 0 1.5 1.4 2.3 2.5 2.8 1.1.5 1.5.8 1.5 1.3 0 .7-.9 1-1.7 1-1 0-1.6-.1-2.5-.6l-.4-.2-.4 2.1c.6.3 1.8.5 3 .5 2.9 0 4.7-1.4 4.7-3.5 0-1.2-.7-2.1-2.3-2.8-1-.4-1.6-.8-1.6-1.3 0-.5.5-.9 1.6-.9.9 0 1.5.2 2 .4l.3.1.4-2zm7.8-.3h-2.1c-.7 0-1.1.2-1.4.9l-4 9.6h2.8l.6-1.5h3.5l.3 1.5H41l-2.3-10.5zm-3.4 6.8 1-3.6.1-.4.5 2 .6 2h-2.2zM10 4.7 7.4 11.5l-.3-1.4C6.6 8.5 5 6.7 3.2 5.8l2.4 9.4h2.8L13 4.7H10z"
          />
          <path fill="#F9A51A" d="M5.4 4.7H2.5l-.1.2C5.9 6 8 8.1 8.9 10.6L8 5.6c-.1-.6-.6-1-1.2-1.2.2.1-.4.2-1.4.3z" />
        </svg>
        <span className="sr-only">Visa</span>
      </span>

      {/* Mastercard */}
      <span className={shell} title="Mastercard">
        <svg viewBox="0 0 38 24" className="h-5 w-8" aria-hidden>
          <circle cx="14" cy="12" r="8" fill="#EB001B" />
          <circle cx="24" cy="12" r="8" fill="#F79E1B" />
          <path
            fill="#FF5F00"
            d="M19 5.6a8 8 0 0 1 0 12.8 8 8 0 0 1 0-12.8z"
          />
        </svg>
        <span className="sr-only">Mastercard</span>
      </span>

      {/* Amex */}
      <span className={`${shell} !bg-[#2E77BC] !border-[#2E77BC]`} title="American Express">
        <svg viewBox="0 0 40 16" className="h-3.5 w-9" aria-hidden>
          <text
            x="20"
            y="11.5"
            textAnchor="middle"
            fill="#fff"
            fontSize="7"
            fontFamily="Inter,Arial,sans-serif"
            fontWeight="700"
            letterSpacing="0.5"
          >
            AMEX
          </text>
        </svg>
        <span className="sr-only">American Express</span>
      </span>

      {/* PayPal */}
      <span className={shell} title="PayPal">
        <svg viewBox="0 0 48 16" className="h-3.5 w-12" aria-hidden>
          <text
            x="0"
            y="12"
            fill="#003087"
            fontSize="11"
            fontFamily="Inter,Arial,sans-serif"
            fontWeight="800"
          >
            Pay
          </text>
          <text
            x="22"
            y="12"
            fill="#009CDE"
            fontSize="11"
            fontFamily="Inter,Arial,sans-serif"
            fontWeight="800"
          >
            Pal
          </text>
        </svg>
        <span className="sr-only">PayPal</span>
      </span>

      {/* UPI */}
      <span className={shell} title="UPI">
        <svg viewBox="0 0 40 16" className="h-3.5 w-9" aria-hidden>
          <text
            x="20"
            y="11.5"
            textAnchor="middle"
            fill="#097A4B"
            fontSize="9"
            fontFamily="Inter,Arial,sans-serif"
            fontWeight="800"
            letterSpacing="1"
          >
            UPI
          </text>
        </svg>
        <span className="sr-only">UPI</span>
      </span>

      {/* SWIFT */}
      <span className={shell} title="SWIFT bank transfer">
        <svg viewBox="0 0 56 16" className="h-3.5 w-12" aria-hidden>
          <text
            x="28"
            y="11.5"
            textAnchor="middle"
            fill="#E31937"
            fontSize="8"
            fontFamily="Inter,Arial,sans-serif"
            fontWeight="800"
            letterSpacing="0.8"
          >
            SWIFT
          </text>
        </svg>
        <span className="sr-only">SWIFT</span>
      </span>
    </div>
  )
}
