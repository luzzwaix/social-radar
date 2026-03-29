import { CircleMarker, Polyline, Popup } from 'react-leaflet';

const COLORS = {
  school: '#32506f',
  hospital: '#5e7980',
  road: '#d4af57'
};

function isPoint(item) {
  return Array.isArray(item?.position) && item.position.length === 2;
}

function isPolyline(item) {
  return Array.isArray(item?.geometry) && item.geometry.length > 1;
}

function PopupFrame({ title, subtitle, status }) {
  return (
    <div style={{ minWidth: 190, fontFamily: 'Inter,system-ui,sans-serif', color: '#f8fafc' }}>
      <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>{title}</div>
      <div style={{ marginTop: 4, color: '#94a3b8', fontSize: 12 }}>{subtitle}</div>
      <div
        style={{
          marginTop: 10,
          padding: '8px 10px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: '#cbd5e1',
          fontSize: 12,
          lineHeight: 1.5
        }}
      >
        {status}
      </div>
    </div>
  );
}

export default function InfrastructureMarkers({ infrastructure }) {
  const schools = infrastructure?.schools ?? [];
  const hospitals = infrastructure?.hospitals ?? [];
  const roads = infrastructure?.roads ?? [];

  return (
    <>
      {schools.map((item) =>
        isPoint(item) ? (
          <CircleMarker
            key={item.id}
            center={item.position}
            radius={7}
            pathOptions={{
              color: COLORS.school,
              fillColor: COLORS.school,
              fillOpacity: 0.92,
              weight: 2
            }}
          >
            <Popup>
              <PopupFrame title={item.name} subtitle="School signal" status={`Source: open data / demo. ${item.status}`} />
            </Popup>
          </CircleMarker>
        ) : null
      )}

      {hospitals.map((item) =>
        isPoint(item) ? (
          <CircleMarker
            key={item.id}
            center={item.position}
            radius={8}
            pathOptions={{
              color: COLORS.hospital,
              fillColor: COLORS.hospital,
              fillOpacity: 0.92,
              weight: 2
            }}
          >
            <Popup>
              <PopupFrame title={item.name} subtitle="Healthcare signal" status={`Source: open data / demo. ${item.status}`} />
            </Popup>
          </CircleMarker>
        ) : null
      )}

      {roads.map((item) =>
        isPolyline(item) ? (
          <Polyline
            key={item.id}
            positions={item.geometry}
            pathOptions={{
              color: COLORS.road,
              weight: 5,
              opacity: 0.82,
              dashArray: '10 8'
            }}
          >
            <Popup>
              <PopupFrame title={item.name} subtitle="Road issue segment" status={`Source: mock / open-data framing. ${item.status}`} />
            </Popup>
          </Polyline>
        ) : null
      )}
    </>
  );
}
