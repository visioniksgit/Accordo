import Image from 'next/image';
import { Col } from 'reactstrap';
import contactUsImage from '../../../public/assets/images/contact/contact.png';

const ContactImageBox = () => {
  return (
    <Col lg={6} className="d-flex flex-column order-1 order-lg-2">
      <div
        className="contact-image-box position-relative w-100 flex-grow-1"
        style={{
          minHeight: '280px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={contactUsImage}
          alt="Contact Accordo"
          fill
          priority
          unoptimized
          sizes="(max-width: 991px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
    </Col>
  );
};

export default ContactImageBox;
