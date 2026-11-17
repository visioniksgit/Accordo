import { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import CategoryContext from '@/helper/categoryContext';

const FooterCategory = ({ footerMenu, setFooterMenu }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { filterCategory } = useContext(CategoryContext);
  const categoryData = filterCategory('product');

  const column1Items = [
    { title: 'Wires & Cables', href: '/collections?department=consumer-ayurved' },
    { title: 'Wiring Accessories', href: '/collections?department=electric' },
    { title: 'Lighting', href: '/collections?department=electric' },
    { title: 'Pumps & Valves', href: '/collections?department=electricr' },
    { title: 'V-Belts', href: '/collections?department=electric' },
  ];

  const column2Items = [
    { title: 'Fans & Ventilation', href: '/collections?department=electric' },
    { title: 'Switchgears', href: '/collections?department=electric' },
    { title: 'Motors', href: '/collections?department=electric' },
    { title: 'Solar Panels', href: '/collections?department=electric' },
    { title: 'Appliances', href: '/collections?department=electric' },
  ];

  return (
    <Col xl={4} lg={4} md={6} sm={12}>
      <div
        className={`footer-title ${footerMenu == 'category' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu((prev) => (prev !== 'category' ? 'category' : ''))
        }
      >
        <h4>Shop Online</h4>
      </div>

      <div className="footer-contain">
        <Row className="g-2">
          <Col xs={6}>
            <ul>
              {column1Items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <a href={item.href} className="text-content-color">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={6}>
            <ul>
              {column2Items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <a href={item.href} className="text-content-color">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default FooterCategory;
