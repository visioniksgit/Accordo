import React, { useMemo, useContext } from 'react';
import {
  FiHeadphones,
  FiPhoneCall,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import ThemeOptionContext from '@/helper/themeOptionsContext';

const FooterHighlights = () => {
  const { themeOption } = useContext(ThemeOptionContext);

  const highlights = useMemo(
    () => [
      {
        id: 1,
        label: 'Toll Free Number',
        // value:themeOption?.footer?.support_number ||
        // themeOption?.header?.support_number || '',
        value: '+91-9898989898',
        icon: <FiHeadphones />,
      },
      {
        id: 2,
        label: 'Alternative Helpline',
        value: '+91-9898989898',
        icon: <FiPhoneCall />,
      },
      {
        id: 3,
        label: 'Email',
        // value: themeOption?.footer?.support_email || '',
        value: 'test@gmail.com',
        icon: <FiMail />,
      },
      {
        id: 4,
        label: 'Address',
        // value: themeOption?.footer?.about_address || '',
        value: `701, Haware Infotech Park, Sector 30A, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703
`,
        icon: <FiMapPin />,
      },
    ],
    [
      themeOption?.footer?.about_address,
      themeOption?.footer?.support_email,
      themeOption?.footer?.support_number,
      themeOption?.header?.support_number,
    ]
  );

  return (
    <div className="footer-highlights">
      {highlights.map((item) => (
        <div
          className={`highlight-item${item.label === 'Address' ? ' highlight-item--address' : ''}`}
          key={item.id}
        >
          <div className='highlight-icon-wrapper'>
            <span className="highlight-icon">{item.icon}</span>
          </div>
          {/* <div className="highlight-content">
            <h5 className="highlight-title">{item.label}</h5>
            {item.value ? (
              <p className="highlight-subtitle">{item.value}</p>
            ) : null}
          </div> */}
          <div className="highlight-content">
            <div className="highlight-title">{item.label}</div>

            {item.label === "Email" ? (
              <a href={`mailto:${item.value}`} className="highlight-subtitle">
                {item.value}
              </a>
            ) : item.label === "Support" || item.label === "Sales" ? (
              <a
                href={`tel:${item.value.replace(/-/g, "")}`}
                className="highlight-subtitle"
              >
                {item.value}
              </a>
            ) : (
              <p className="highlight-subtitle">{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterHighlights;

