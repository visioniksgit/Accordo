import CustomHeading from '@/components/common/CustomHeading';
import ContactUsForm from './ContactUsForm';
import { Col } from 'reactstrap';

const ContactRightSidebar = () => {
  return (
    <Col lg={6} className="d-flex flex-column order-2 order-lg-1">
      {/* <CustomHeading
        title={'ContactUs'}
        customtitleClass={'d-xxl-none d-block'}
      /> */}
      <div className="right-sidebar-box h-100">
        <ContactUsForm />
      </div>
    </Col>
  );
};

export default ContactRightSidebar;
