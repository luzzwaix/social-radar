import { GeoJSON } from 'react-leaflet';
import { buildDistrictSummary } from '../../hooks/useMap';

function getStyle(feature, selectedDistrictId) {
  const isSelected = feature?.properties?.id === selectedDistrictId;

  return {
    color: isSelected ? '#b87c4f' : '#32506f',
    weight: isSelected ? 3.5 : 1.5,
    fillColor: isSelected ? '#d4af57' : '#1e2933',
    fillOpacity: isSelected ? 0.32 : 0.16,
    opacity: 0.96,
    dashArray: isSelected ? undefined : '4 5'
  };
}

function buildPopupContent(feature) {
  const summary = buildDistrictSummary(feature);

  return `
    <div style="min-width:220px;padding:2px 0;font-family:Inter,system-ui,sans-serif;color:#f8fafc">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px">
        <div style="font-weight:800;font-size:15px;line-height:1.25">${summary.name}</div>
        <div style="padding:4px 8px;border-radius:999px;background:rgba(184,124,79,0.14);border:1px solid rgba(184,124,79,0.24);color:#f0d0b3;font-size:11px;letter-spacing:.08em;text-transform:uppercase">
          Atlas
        </div>
      </div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;line-height:1.45">
        Open-data district snapshot for explainable review. Final decision stays with the expert.
      </div>
      <div style="display:grid;gap:8px;font-size:12px">
        <div style="display:flex;justify-content:space-between;gap:12px"><span style="color:#94a3b8">Schools</span><strong>${summary.schools}</strong></div>
        <div style="display:flex;justify-content:space-between;gap:12px"><span style="color:#94a3b8">Hospitals</span><strong>${summary.hospitals}</strong></div>
        <div style="display:flex;justify-content:space-between;gap:12px"><span style="color:#94a3b8">Road issues</span><strong>${summary.roads}</strong></div>
        <div style="display:flex;justify-content:space-between;gap:12px"><span style="color:#94a3b8">Complaints</span><strong>${summary.complaints}</strong></div>
      </div>
    </div>
  `;
}

export default function DistrictLayer({ districts, selectedDistrictId, onSelectDistrict }) {
  if (!districts?.features?.length) return null;

  return (
    <GeoJSON
      data={districts}
      style={(feature) => getStyle(feature, selectedDistrictId)}
      onEachFeature={(feature, layer) => {
        layer.bindPopup(buildPopupContent(feature), {
          maxWidth: 280,
          closeButton: false,
          className: 'district-popup'
        });

        layer.on({
          mouseover: (event) => {
            event.target.setStyle({
              weight: 4,
              fillOpacity: 0.3,
              color: '#b87c4f'
            });
            event.target.bringToFront();
          },
          mouseout: (event) => {
            event.target.setStyle(getStyle(feature, selectedDistrictId));
          },
          click: () => {
            if (typeof onSelectDistrict === 'function') {
              onSelectDistrict(feature?.properties?.id ?? null, feature);
            }
            layer.openPopup();
          }
        });
      }}
    />
  );
}
