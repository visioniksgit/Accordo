import { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import CategoryContext from '@/helper/categoryContext';

const FooterCategory = ({ footerMenu, setFooterMenu }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { filterCategory } = useContext(CategoryContext);
  const categoryData = filterCategory('product');

  const column1Items = [
    { title: 'Wires & Cables', href: '/collections?department=cables' },
    { title: 'Wiring Accessories', href: '/collections?department=cables' },
    { title: 'Lighting', href: '/collections?department=cables' },
    { title: 'Pumps & Valves', href: '/collections?department=cables' },
    { title: 'V-Belts', href: '/collections?department=cables' },
  ];

  const column2Items = [
    { title: 'Fans & Ventilation', href: '/collections?department=cables' },
    { title: 'Switchgears', href: '/collections?department=cables' },
    { title: 'Motors', href: '/collections?department=cables' },
    { title: 'Solar Panels', href: '/collections?department=cables' },
    { title: 'Appliances', href: '/collections?department=cables' },
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
