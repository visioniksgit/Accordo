
import WrapperComponent from '../common/WrapperComponent';

const MapSection = () => {
  return (
    <WrapperComponent
      classes={{ sectionClass: 'map-section', fluidClass: 'p-0' }}
      noRowCol={true}
    >
      <div className="map-box">
        <iframe
          src="https://www.google.com/maps?q=HYPLAP+IT+SOLUTION+PVT+LTD,+701+Haware+Infotech+Park,+Vashi,+Navi+Mumbai,+Maharashtra+400703&output=embed"
          style={{ border: 0 }}
          width="100%"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="HYPLAP IT SOLUTION PVT LTD Location"
        />
      </div>
    </WrapperComponent>
  );
};

export default MapSection;
