import { Circle } from 'react-leaflet';

function getRadius(intensity = 0.5) {
  return Math.max(120, Math.round(260 * intensity));
}

function getOpacity(intensity = 0.5) {
  return Math.min(0.44, 0.14 + intensity * 0.22);
}

export default function ComplaintHeatmap({ points }) {
  if (!points?.length) return null;

  return (
    <>
      {points.map((point) => (
        <Circle
          key={point.id}
          center={point.position}
          radius={getRadius(point.intensity)}
          pathOptions={{
            color: '#b87c4f',
            fillColor: '#d4af57',
            fillOpacity: getOpacity(point.intensity),
            opacity: getOpacity(point.intensity),
            weight: 0
          }}
        />
      ))}
    </>
  );
}
