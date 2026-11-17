import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import styles from './page.module.scss';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Read our Terms & Conditions and Disclaimer, including legal notices, privacy references, jurisdiction, and usage rules.',
};

export default function TermsAndConditionsPage() {
  return (
    <main>
      <WrapperComponent classes={{ sectionClass: styles.banner }} noRowCol>
        <Row className="justify-content-center">
          <Col xs="12" lg="10" className="text-center">
            <h1 className={styles.bannerTitle}>Terms & Conditions</h1>
            <nav aria-label="Breadcrumb">
              <ol className={styles.breadcrumbs}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Terms & Conditions</li>
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
              <h2 className={styles.sectionTitle}>Terms & Conditions:</h2>
              <p>
                The following terms &amp; conditions have been designed keeping
                in mind the comfort and safety of your visit to our website.
              </p>
              <p>
                These terms and conditions outline the rules and regulations for
                the use of our website and related services.
              </p>
              <p>
                By accessing this website, it is presumed that you accept these
                terms and conditions laid forth herein. Acceptance of terms and
                conditions in part or part thereof is not acceptable under the
                terms &amp; conditions. Do not continue to use this site if you
                do not agree to take all the terms and conditions stated on this
                page.
              </p>
              <p>
                The following terminology applies to these Terms & Conditions,
                Privacy Policy and Disclaimer Notice and all Agreements:
                &ldquo;Client&rdquo;, &ldquo;You&rdquo; and &ldquo;Your&rdquo;
                refers to you, the person who logs in on this website and
                compliant to the Company&apos;s terms and conditions. &ldquo;The
                Company&rdquo;, &ldquo;Ourselves&rdquo;, &ldquo;We&rdquo;,
                &ldquo;Our&rdquo; and &ldquo;Us&rdquo;, refers to our Company.
                &ldquo;Party&rdquo;, &ldquo;Parties&rdquo;, or &ldquo;Us&rdquo;,
                refers to both the Client and ourselves. All terms refer to the
                offer, acceptance and consideration of payment necessary to
                undertake the process of our assistance to the Client in the
                most appropriate manner for the express purpose of meeting the
                Client&apos;s needs in respect of provision of the
                Company&apos;s stated services, in accordance with and subject
                to, prevailing law. Any use of the above terminology or
                other words in the singular, plural, capitalization and/or
                he/she or they, are taken as interchangeable and therefore as
                referring to same.
              </p>

              <h3 className={styles.subTitle}>Cookies</h3>
              <p>
                We employ the use of cookies. By accessing this website, you
                agree to use cookies in agreement with our Privacy Policy.
              </p>
              <p>
                Most interactive websites use cookies to let them retrieve the
                user&apos;s details for each visit. Cookies are used by our
                website to enable the functionality of certain areas and to
                make it easier for people visiting our website. Some of our
                affiliate or advertising partners may also use cookies.
              </p>

              <h3 className={styles.subTitle}>License</h3>
              <p>
                Unless otherwise stated, the Company and/or its licensors own the
                intellectual property rights for all material on this website.
                All intellectual property rights are reserved. You may access
                this for your own personal use subjected to restrictions set in
                these terms and conditions.
              </p>
              <p>
                <strong>You must not:</strong>
              </p>
              <ul>
                <li>Republish material from this website.</li>
                <li>Sell, rent or sub-license material.</li>
                <li>Reproduce, duplicate or copy material.</li>
                <li>Redistribute content.</li>
              </ul>
              <p>This Agreement shall begin on the date hereof.</p>
              <p>
                Parts of this website offer an opportunity for users to post and
                exchange opinions and information in certain areas of the
                website. The Company does not filter, edit, publish or review
                comments prior to their presence on the website. Comments do not
                reflect the views and opinions of the Company, its agents and/or
                affiliates. Comments reflect the views and opinions of the
                person who posts them. To the extent permitted by applicable
                laws, the Company shall not be liable for the comments or for
                any liability, damages or expenses caused and/or suffered as a
                result of any use of and/or posting of and/or appearance of the
                comments on this website.
              </p>
              <p>
                The Company reserves the right to monitor all comments and to
                remove any comments which can be considered inappropriate,
                offensive or causes breach of these Terms and Conditions.
              </p>
              <p>
                <strong>You warrant and represent that:</strong>
              </p>
              <ol>
                <li>
                  You are entitled to post the comments on our website and that
                  the comments do not invade any intellectual property right,
                  including without limitation copyright, patent or trademark
                  of any third party.
                </li>
                <li>
                  The comments do not contain any defamatory, libellous,
                  offensive, indecent or otherwise unlawful material which is an
                  invasion of privacy.
                </li>
                <li>
                  The comments will not be used to solicit or promote business
                  or custom or present commercial activities or unlawful
                  activity.
                </li>
              </ol>

              <h3 className={styles.subTitle}>Hyperlinking to our Content</h3>
              <p>
                Our website may provide links to third-party websites or
                content such as blogs or forums. Please note that the Company is
                not liable for the content, products, or services of such
                third-party websites or services.
              </p>

              <h3 className={styles.subTitle}>Frames</h3>
              <p>
                Without prior approval and written permission, you may not
                create frames around our Web pages that alter in any way the
                visual presentation or appearance of our Website.
              </p>

              <h3 className={styles.subTitle}>Your Privacy</h3>
              <p>
                We request you to read our Privacy Policy{' '}
                <Link href="/privacy-policy">here</Link>.
              </p>

              <h3 className={styles.subTitle}>Reservation of Rights</h3>
              <p>
                We reserve the right to request that you remove all links or any
                particular link to our Website. You approve to immediately
                remove all links to our Website upon request. We also reserve
                the right to amend these terms and conditions and its linking
                policy at any time. By continuously linking to our Website, you
                agree to be bound to and follow these linking terms and
                conditions.
              </p>

              <h3 className={styles.subTitle}>
                Removal of links from our website
              </h3>
              <p>
                If you find any link on our Website that is offensive for any
                reason, you are free to contact and inform us at any moment. We
                will consider requests to remove links but we are not obligated
                to do so or to respond to you directly.
              </p>
              <p>
                We do not ensure that the information on this website is
                correct, we do not warrant its completeness or accuracy; nor do
                we promise to ensure that the website remains available or that
                the material on the website is kept up to date.
              </p>

              <h3 className={styles.subTitle}>Disclaimer</h3>
              <p>
                All the information on this website is published in good faith
                and for general information purposes only. The Company does not
                make any warranties about the completeness, reliability, and
                accuracy of this information. Any action you take upon the
                information you find on this website is strictly at your own
                risk. The Company will not be liable for any losses and/or
                damages in connection with the use of our website.
              </p>
              <p>
                By using our website, you hereby consent to our disclaimer and
                agree to its terms.
              </p>

              <h3 className={styles.subTitle}>Jurisdiction</h3>
              <p>
                These terms of use are governed by and construed in accordance
                with applicable laws. All users accessing this website agree that
                disputes arising in connection with these terms shall be subject
                to the exclusive jurisdiction of the competent courts. Users are
                responsible for complying with local laws applicable in their
                respective jurisdictions.
              </p>

              <h3 className={styles.subTitle}>Update</h3>
              <p>
                Should we update, amend or make any changes to this document,
                those changes will be prominently posted here.
              </p>
            </article>
          </Col>
        </Row>
      </WrapperComponent>
    </main>
  );
}
