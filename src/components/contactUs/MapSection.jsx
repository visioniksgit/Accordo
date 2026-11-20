
import WrapperComponent from '../common/WrapperComponent';

const MapSection = () => {
  return (
    <WrapperComponent
      classes={{ sectionClass: 'map-section', fluidClass: 'p-0' }}
      noRowCol={true}
    >
      <div className="map-box">
        <iframe
          src="https://www.google.com/maps?q=2439%2BQ56,+D+Mart+Rd,+Sector+5,+New+Panvel+East,+Panvel,+Maharashtra+410206&output=embed"
          style={{ border: 0 }}
          width="100%"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Accordo"
        />
      </div>
    </WrapperComponent>
  );
};

export default MapSection;
