import React, { useContext } from 'react';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterFill,
  RiYoutubeFill,
} from 'react-icons/ri';

const FooterSocial = () => {
  const { themeOption } = useContext(ThemeOptionContext);

  const iconStyle = { color: 'var(--theme-color, #234BF3)' };

  return (
    <>
      <div className="social-link">
        <div className="text-content fw-semibold">Stay Connected :</div>
        <ul>
          {/* {themeOption?.footer?.facebook && ( */}
          <li>
            <a
              href={"https://www.facebook.com/"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              style={iconStyle}
            >
              <RiFacebookFill style={iconStyle} />
            </a>
          </li>
          {/* )} */}
          {/* {themeOption?.footer?.twitter && ( */}
          <li>
            <a
              href={"https://x.com/"}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              style={iconStyle}
            >
              <RiTwitterFill style={iconStyle} />
            </a>
          </li>
          {/* )} */}
          {/* {themeOption?.footer?.instagram && ( */}
          <li>
            <a
              href={"https://www.instagram.com/"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={iconStyle}
            >
              <RiInstagramLine style={iconStyle} />
            </a>
          </li>
          {/* )} */}
          {/* {themeOption?.footer?.pinterest && ( */}
          <li>
            <a
              href={"https://www.youtube.com/"}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              style={iconStyle}
            >
              <RiYoutubeFill style={iconStyle} />
            </a>
          </li>
          {/* )} */}
        </ul>
      </div>
    </>
  );
};

export default FooterSocial;
