import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap as useLeafletMap } from 'react-leaflet';
import DistrictLayer from './DistrictLayer';
import InfrastructureMarkers from './InfrastructureMarkers';
import ComplaintHeatmap from './ComplaintHeatmap';
import { useMap as useMapData } from '../../hooks/useMap';

function FitToSelection({ selectedDistrict }) {
  const map = useLeafletMap();

  useEffect(() => {
    if (!selectedDistrict?.geometry?.coordinates?.length) return;

    const coordinates = selectedDistrict.geometry.coordinates[0];
    const bounds = coordinates.map(([lng, lat]) => [lat, lng]);

    map.flyToBounds(bounds, {
      paddingTopLeft: [32, 36],
      paddingBottomRight: [32, 28],
      duration: 0.75,
      easeLinearity: 0.2,
      maxZoom: 13.5
    });
  }, [map, selectedDistrict]);

  return null;
}

function MapOverlay({ activeDistrict, complaintCount, sourceLabels }) {
  const props = activeDistrict?.properties ?? {};
  const metrics = [
    { label: 'Schools', value: props.schools ?? 0 },
    { label: 'Hospitals', value: props.hospitals ?? 0 },
    { label: 'Road issues', value: props.roads ?? 0 },
    { label: 'Complaints', value: props.complaints ?? 0 }
  ];

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(50,80,111,0.12), transparent 22%, transparent 78%, rgba(184,124,79,0.1))',
          zIndex: 450
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.16,
          mixBlendMode: 'screen',
          zIndex: 455
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '14px 14px auto 14px',
          zIndex: 500,
          display: 'grid',
          gap: 12,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              minWidth: 260,
              padding: '14px 16px',
              borderRadius: 20,
              background: 'linear-gradient(180deg, rgba(22,24,29,0.94), rgba(26,28,32,0.84))',
              border: '1px solid rgba(184,124,79,0.22)',
              boxShadow: '0 18px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.02) inset',
              backdropFilter: 'blur(14px)'
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#d4af57' }}>
              Civic map feed
            </div>
            <div style={{ marginTop: 6, fontWeight: 800, fontSize: 18, color: '#f8fafc' }}>
              {props.name ?? 'Almaty District Grid'}
            </div>
            <div style={{ marginTop: 6, color: '#94a3b8', fontSize: 13, lineHeight: 1.45 }}>
              Spatial layer with district routing, open-data framing, and expert review.
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 8,
              minWidth: 280
            }}
          >
            {metrics.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '10px 12px',
                  borderRadius: 16,
                  background: 'rgba(28,32,36,0.76)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                <div style={{ color: '#94a3b8', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 999,
              background: 'rgba(10,10,15,0.76)',
              border: '1px solid rgba(184,124,79,0.22)',
              color: '#c7cbe0',
              fontSize: 12
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#d4af57',
                boxShadow: '0 0 14px rgba(212,175,87,0.45)'
              }}
            />
            {complaintCount} complaint signals
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sourceLabels.map((label) => (
              <span
                key={label}
                style={{
                  padding: '10px 12px',
                  borderRadius: 999,
                  background: 'rgba(28,32,36,0.74)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#9ca3af',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 'auto 14px 14px 14px',
          zIndex: 500,
          display: 'grid',
          gap: 10,
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 999,
              background: 'rgba(10,10,15,0.72)',
              border: '1px solid rgba(94,121,128,0.24)',
              color: '#d9e4e6',
              fontSize: 12
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#5e7980',
                boxShadow: '0 0 14px rgba(94,121,128,0.5)'
              }}
            />
            Live map layer
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 999,
              background: 'rgba(10,10,15,0.72)',
              border: '1px solid rgba(50,80,111,0.2)',
              color: '#c7cbe0',
              fontSize: 12
            }}
          >
            District overlays and live planning signals
          </div>
        </div>
      </div>
    </>
  );
}

export default function AlmatyMap({
  districts,
  infrastructure,
  complaints,
  selectedDistrictId,
  onDistrictSelect,
  center,
  zoom,
  className = '',
  height = '620px'
}) {
  const mapData = useMapData({
    districts,
    infrastructure,
    complaints,
    initialSelectedDistrictId: selectedDistrictId,
    center,
    zoom
  });

  const resolvedDistricts = districts ?? mapData.districts;
  const resolvedInfrastructure = infrastructure ?? mapData.infrastructure;
  const resolvedComplaints = complaints ?? mapData.complaints;
  const activeDistrictId = selectedDistrictId ?? mapData.selectedDistrictId;
  const activeDistrict = useMemo(
    () => resolvedDistricts.features.find((feature) => feature?.properties?.id === activeDistrictId) ?? mapData.selectedDistrict,
    [activeDistrictId, mapData.selectedDistrict, resolvedDistricts.features]
  );

  const handleSelectDistrict = (districtId, feature) => {
    if (typeof onDistrictSelect === 'function') {
      onDistrictSelect(districtId, feature);
    }
    if (!selectedDistrictId) {
      mapData.handleDistrictSelect(districtId);
    }
  };

  return (
    <div
      className={`almaty-map-shell ${className}`.trim()}
      style={{
        position: 'relative',
        height,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 28,
        border: '1px solid rgba(184,124,79,0.18)',
        background:
          'linear-gradient(180deg, rgba(23,22,19,0.98), rgba(15,14,12,0.98)), linear-gradient(rgba(212,197,176,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,197,176,0.05) 1px, transparent 1px), radial-gradient(circle at top, rgba(50,80,111,0.16), rgba(20,24,28,0.98) 55%)',
        backgroundSize: 'auto, 34px 34px, 34px 34px, auto',
        boxShadow: '0 28px 60px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.02) inset'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 20% 20%, rgba(50,80,111,0.16), transparent 24%), radial-gradient(circle at 85% 18%, rgba(184,124,79,0.14), transparent 18%), radial-gradient(circle at 50% 100%, rgba(94,121,128,0.1), transparent 20%), linear-gradient(135deg, transparent 0 48%, rgba(230,178,36,0.06) 48% 49%, transparent 49% 100%)',
          zIndex: 360
        }}
      />
      <MapContainer
        center={center ?? mapData.mapCenter}
        zoom={zoom ?? mapData.mapZoom}
        zoomControl={false}
        scrollWheelZoom
        preferCanvas
        style={{
          height: '100%',
          width: '100%',
          background: 'transparent',
          filter: 'saturate(1.12) contrast(1.03)'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          opacity={0.92}
        />
        <ZoomControl position="bottomright" />
        <DistrictLayer districts={resolvedDistricts} selectedDistrictId={activeDistrictId} onSelectDistrict={handleSelectDistrict} />
        <InfrastructureMarkers infrastructure={resolvedInfrastructure} />
        <ComplaintHeatmap points={resolvedComplaints} />
        <FitToSelection selectedDistrict={activeDistrict} />
      </MapContainer>
      <MapOverlay
        activeDistrict={activeDistrict}
        complaintCount={resolvedComplaints?.length ?? 0}
        sourceLabels={['open data', 'district hud', 'manual review']}
      />
    </div>
  );
}
