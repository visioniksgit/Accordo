import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import styles from './page.module.scss';

export const metadata = {
  title: 'Return & Refund Policy',
  description:
    'Read our Return & Refund Policy, including cancellation terms, refund schedules, eligible return conditions, and procedures.',
};

export default function RefundPolicyPage() {
  return (
    <main>
      <WrapperComponent classes={{ sectionClass: styles.banner }} noRowCol>
        <Row className="justify-content-center">
          <Col xs="12" lg="10" className="text-center">
            <h1 className={styles.bannerTitle}>Return & Refund Policy</h1>
            <nav aria-label="Breadcrumb">
              <ol className={styles.breadcrumbs}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Return & Refund Policy</li>
              </ol>
            </nav>
          </Col>
        </Row>
      </WrapperComponent>

      <WrapperComponent
        classes={{ sectionClass: styles.contentSection }}
        noRowCol
      >
        <Row className="justify-content-center">
          <Col xs="12">
            <article className={styles.legalCard}>
              <h2 className={styles.sectionTitle}>Cancellation:</h2>
              <p>
                Cancellations are allowed only until the product is dispatched
                from our warehouses. Please contact our Customer Care team
                immediately via our Contact Us page or support email to assist
                you in cancelling your order.
              </p>
              <h3 className={styles.subTitle}>Refund:</h3>
              <p>
                We will initiate your refund within 3 working days of
                confirmation. However, it may take 7-15 working days for the
                amount to get credited or reflected in your bank or credit card
                account statement, depending on your bank&apos;s processing
                schedule.
              </p>
              <h3 className={styles.subTitle}>Return:</h3>
              <p>
                We are committed to our valued customers and have designed a fair
                and transparent return policy.
              </p>
              <ol>
                <li>
                  Please raise a return or replacement request within 2 days from
                  the date of delivery. In case of damaged or missing products,
                  report it within 2 days from delivery with relevant details such
                  as your order or invoice number. Our team will review your
                  request and respond within 2 working days.
                </li>
                <li>
                  Upon return approval, the product should be securely packed and
                  dispatched to our designated returns address within the
                  specified timeline.
                </li>
                <li>
                  After the product is received, our quality team will verify it
                  against the claim and initiate the replacement or refund if the
                  claim meets our policy guidelines. Replacements are subject to
                  stock availability.
                </li>
              </ol>
              <h3 className={styles.subTitle}>
                Circumstances under which returns/replacements would be
                considered:
              </h3>
              <ul>
                <li>Wrong product delivered</li>
                <li>Expired or defective product delivered</li>
                <li>
                  Damaged product delivered (physical damage or tampered packaging)
                </li>
                <li>Incomplete order (missing products or items)</li>
              </ul>
              <h3 className={styles.subTitle}>
                Circumstances under which returns/replacements would NOT be
                considered:
              </h3>
              <ul>
                <li>Opened, used, altered, or installed products</li>
                <li>Missing original packaging, tags, serial numbers, or accessories</li>
                <li>
                  The return or replacement request is raised after 2 days from
                  the date of delivery
                </li>
                <li>
                  The damaged or missing product is reported after 2 days from the
                  date of delivery
                </li>
                <li>
                  The product is received past the authorized return dispatch window.
                </li>
              </ul>
              <h3 className={styles.subTitle}>Address for returns</h3>
              <p>
                Kindly direct your approved returns, securely packed and
                appropriately labelled, to our returns warehouse as instructed by
                customer support upon initiating your return ticket.
              </p>
            </article>
          </Col>
        </Row>
      </WrapperComponent>
    </main>
  );
}
