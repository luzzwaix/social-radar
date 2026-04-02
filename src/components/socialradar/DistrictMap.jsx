import React, { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleMarker, GeoJSON, MapContainer, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import { riskLevelTone } from "../../hooks/useSocialRadarWorkspace";
import { normalizeDisplayText } from "../../utils/text";

const numberFormatter = new Intl.NumberFormat("ru-RU");

function safeText(value) {
  return normalizeDisplayText(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function InvalidateMap() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 160);
    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function FocusOnDistrict({ district }) {
  const map = useMap();

  useEffect(() => {
    if (!district?.properties?.center) {
      return;
    }

    map.flyTo(district.properties.center, 11.5, {
      animate: true,
      duration: 0.9
    });
  }, [district, map]);

  return null;
}

function metricDescription(metric) {
  if (metric === "total") {
    return "\u0427\u0438\u0441\u043b\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u043d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u044f";
  }

  if (metric === "riskScore") {
    return "\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0440\u0438\u0441\u043a\u0430 (\u0441\u043d\u044d\u043f\u0448\u043e\u0442)";
  }

  if (metric === "youthShare") {
    return "\u0414\u043e\u043b\u044f 0\u201315";
  }

  return "\u0414\u043e\u043b\u044f 65+";
}

function metricValue(metric, district) {
  const value = district?.[metric];

  if (metric === "total") {
    return numberFormatter.format(Math.round(value ?? 0));
  }

  if (metric === "riskScore") {
    return isFiniteNumber(value) ? value.toFixed(1) : "\u041d/\u0434";
  }

  return isFiniteNumber(value) ? `${value.toFixed(1)}%` : "\u041d/\u0434";
}

function getFill(metric, value, min, max) {
  if (!isFiniteNumber(value)) {
    return "#0f1722";
  }

  if (max === min) {
    return "#0ea5e9";
  }

  const ratio = (value - min) / (max - min);

  if (metric === "riskScore") {
    if (value >= 75) {
      return "#fb7185";
    }

    if (value >= 55) {
      return "#f97316";
    }

    if (value >= 35) {
      return "#38bdf8";
    }

    return "#0f2434";
  }

  if (metric === "seniorShare") {
    if (ratio > 0.7) {
      return "#f97316";
    }

    if (ratio > 0.45) {
      return "#38bdf8";
    }

    return "#122233";
  }

  if (ratio > 0.74) {
    return "#7dd3fc";
  }

  if (ratio > 0.48) {
    return "#38bdf8";
  }

  return "#0f1c2a";
}

export default function DistrictMap({
  geoJson,
  districts,
  metric,
  metricOptions,
  selectedDistrictName,
  onSelectDistrict,
  onMetricChange,
  liveStatus,
  liveAlerts,
  onOpenDistrict,
  openDistrictLabel = "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0434\u043e\u0441\u044c\u0435"
}) {
  const districtLookup = useMemo(
    () =>
      new Map(
        districts.map((district) => [
          district.district,
          {
            ...district
          }
        ])
      ),
    [districts]
  );

  const metricValues = districts.map((district) => district[metric]).filter(isFiniteNumber);
  const minMetric = metricValues.length ? Math.min(...metricValues) : 0;
  const maxMetric = metricValues.length ? Math.max(...metricValues) : 100;

  const features = useMemo(
    () =>
      geoJson.features
        .map((feature) => {
          const district = districtLookup.get(feature.properties.name);

          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...(district ?? {}),
              metricValue: district?.[metric] ?? 0
            }
          };
        })
        .filter((feature) => districtLookup.has(feature.properties.name)),
    [districtLookup, geoJson.features, metric]
  );

  const selectedFeature = features.find((feature) => feature.properties.name === selectedDistrictName) ?? features[0];
  const midpoint = (minMetric + maxMetric) / 2;
  const legendValue = (value) =>
    metric === "total"
      ? numberFormatter.format(Math.round(value))
      : metric === "riskScore"
        ? value.toFixed(1)
        : `${value.toFixed(1)}%`;

  const legendItems = [
    { label: "\u041c\u0438\u043d", color: getFill(metric, minMetric, minMetric, maxMetric), value: legendValue(minMetric) },
    { label: "\u0421\u0440", color: getFill(metric, midpoint, minMetric, maxMetric), value: legendValue(midpoint) },
    { label: "\u041c\u0430\u043a\u0441", color: getFill(metric, maxMetric, minMetric, maxMetric), value: legendValue(maxMetric) }
  ];

  return (
    <motion.section
      className="surface surface-map overflow-hidden"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="border-b border-white/8 px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="data-kicker">{safeText("\u041a\u0430\u0440\u0442\u0430")}</p>
              <span className="status-badge status-badge--slate">
                {safeText("\u0440\u0430\u0439\u043e\u043d\u044b \u0410\u043b\u043c\u0430\u0442\u044b")}
              </span>
            </div>
            <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-white">
              {safeText("\u0420\u0430\u0439\u043e\u043d\u044b \u0410\u043b\u043c\u0430\u0442\u044b")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {safeText(
                "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0430\u0439\u043e\u043d, \u0447\u0442\u043e\u0431\u044b \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u043c\u0435\u0442\u0440\u0438\u043a\u0438 \u0438 \u0432\u0445\u043e\u0434 \u0432 \u043a\u0435\u0439\u0441\u044b."
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {metricOptions.map((option) => (
              <motion.button
                key={option.id}
                type="button"
                className={`pill ${option.id === metric ? "pill--active" : "pill--ghost"}`}
                onClick={() => onMetricChange(option.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {safeText(option.label)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative border-b border-white/8 xl:border-b-0 xl:border-r">
          <div className="map-stage">
            <div className="map-stage__hud map-stage__hud--top-left">
              <div className="map-stage__badge">{safeText("\u0412\u044b\u0431\u0440\u0430\u043d\u043e")}</div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedFeature?.properties?.name}
                  className="map-stage__hud-content"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="map-stage__value">{safeText(selectedFeature?.properties?.name)}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="map-stage__hud map-stage__hud--top-right">
              <div className="map-stage__badge">{safeText("\u041c\u0435\u0442\u0440\u0438\u043a\u0430")}</div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={metric}
                  className="map-stage__hud-content"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="map-stage__value">{metricDescription(metric)}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="map-stage__hud map-stage__hud--bottom-left">
              <div className="map-stage__badge">{safeText("\u041b\u0435\u0433\u0435\u043d\u0434\u0430")}</div>
              <div className="mt-2 space-y-2">
                {legendItems.map((item) => (
                  <div key={item.label} className="map-stage__legend">
                    <span className="map-stage__legend-swatch" style={{ background: item.color }} />
                    <span className="map-stage__legend-label">{safeText(item.label)}</span>
                    <span className="map-stage__legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-stage__hud map-stage__hud--bottom-right">
              <div className="map-stage__badge">{safeText("\u0422\u0435\u043b\u0435\u043c\u0435\u0442\u0440\u0438\u044f")}</div>
              <div className="mt-2 grid gap-2">
                <div className="map-stage__telemetry">
                  <span>{safeText("\u0420\u0430\u0439\u043e\u043d\u044b")}</span>
                  <span>{districts.length}</span>
                </div>
                <div className="map-stage__telemetry">
                  <span>{safeText("\u041f\u043e\u0434\u043b\u043e\u0436\u043a\u0430")}</span>
                  <span>CARTO dark</span>
                </div>
                <div className="map-stage__telemetry">
                  <span>{safeText("\u0421\u043d\u044d\u043f\u0448\u043e\u0442")}</span>
                  <span>
                    {liveStatus === "ready"
                      ? safeText("\u043e\u043d\u043b\u0430\u0439\u043d")
                      : liveStatus === "error"
                        ? safeText("\u0440\u0435\u0437\u0435\u0440\u0432")
                        : safeText("\u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u044f")}
                  </span>
                </div>
                {liveAlerts ? (
                  <div className="map-stage__telemetry">
                    <span>{safeText("\u041a\u0440\u0438\u0442\u0438\u0447\u043d\u044b\u0435")}</span>
                    <span>{liveAlerts.critical_count ?? 0}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <MapContainer
              center={[43.238949, 76.889709]}
              zoom={10.8}
              minZoom={10}
              zoomControl={false}
              scrollWheelZoom
              className="h-full w-full"
            >
              <InvalidateMap />
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              <GeoJSON
                data={{ type: "FeatureCollection", features }}
                style={(feature) => {
                  const isSelected = feature?.properties?.name === selectedDistrictName;
                  const value = feature?.properties?.metricValue ?? 0;

                  return {
                    color: isSelected ? "#dbeafe" : "#27435b",
                    weight: isSelected ? 2.1 : 1.1,
                    fillColor: getFill(metric, value, minMetric, maxMetric),
                    fillOpacity: isSelected ? 0.76 : 0.48,
                    dashArray: isSelected ? undefined : "5 5"
                  };
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                    click: () => onSelectDistrict(feature.properties.name),
                    mouseover: () => layer.setStyle({ weight: 2, fillOpacity: 0.72, color: "#bfdbfe" }),
                    mouseout: () =>
                      layer.setStyle({
                        weight: feature.properties.name === selectedDistrictName ? 2.1 : 1.1,
                        fillOpacity: feature.properties.name === selectedDistrictName ? 0.76 : 0.48,
                        color: feature.properties.name === selectedDistrictName ? "#dbeafe" : "#27435b"
                      })
                  });

                  layer.bindTooltip(
                    `${safeText(feature.properties.name)}\n${metricDescription(metric)}: ${metricValue(metric, feature.properties)}`
                  );
                }}
              />

              {features.map((feature, index) => (
                <CircleMarker
                  key={feature.properties.id}
                  center={feature.properties.center}
                  radius={feature.properties.name === selectedDistrictName ? 6.8 : 4.8}
                  pathOptions={{
                    color: "#d9f6ff",
                    fillColor: feature.properties.name === selectedDistrictName ? "#7dd3fc" : "#38bdf8",
                    fillOpacity: 0.94,
                    weight: 1
                  }}
                  eventHandlers={{
                    click: () => onSelectDistrict(feature.properties.name)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                    <div className="space-y-1">
                      <div className="data-kicker">Node {String(index + 1).padStart(2, "0")}</div>
                      <div className="text-sm text-slate-100">{safeText(feature.properties.name)}</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}

              {selectedFeature?.properties?.center ? (
                <CircleMarker
                  key={`selected-node-${selectedFeature.properties.name}`}
                  center={selectedFeature.properties.center}
                  radius={8}
                  interactive={false}
                  pathOptions={{
                    color: "#d9f6ff",
                    fillColor: metric === "riskScore" ? "#fb7185" : "#7dd3fc",
                    fillOpacity: 0.95,
                    weight: 1.2,
                    className: "map-selected-node"
                  }}
                />
              ) : null}

              {selectedFeature?.properties?.center ? (
                <CircleMarker
                  key={`selected-ring-${selectedFeature.properties.name}-${metric}`}
                  center={selectedFeature.properties.center}
                  radius={12}
                  interactive={false}
                  pathOptions={{
                    color: metric === "riskScore" ? "#fb7185" : "#7dd3fc",
                    fillColor: metric === "riskScore" ? "#fb7185" : "#7dd3fc",
                    fillOpacity: 0.08,
                    weight: 1.1,
                    className: "map-pulse-ring"
                  }}
                />
              ) : null}

              <FocusOnDistrict district={selectedFeature} />
            </MapContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${selectedFeature?.properties?.name}-${metric}`}
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div>
                <p className="data-kicker">{safeText("\u041f\u0430\u043d\u0435\u043b\u044c \u0440\u0430\u0439\u043e\u043d\u0430")}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-[-0.04em] text-white">
                    {safeText(selectedFeature?.properties?.name)}
                  </h3>
                  {selectedFeature?.properties?.riskLevel ? (
                    <span className={`status-badge status-badge--${riskLevelTone(
                      selectedFeature.properties.riskLevel,
                      selectedFeature.properties.riskScore
                    )}`}>
                      {safeText(selectedFeature.properties.riskLevel)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-400">{metricDescription(metric)}</p>
                <p className="mt-4 font-mono text-[2.1rem] leading-none tracking-[-0.05em] text-white">
                  {metricValue(metric, selectedFeature?.properties)}
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    label: "\u041d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u0435",
                    value: numberFormatter.format(selectedFeature?.properties?.total ?? 0)
                  },
                  {
                    label: "\u0422\u0440\u0443\u0434\u043e\u0441\u043f\u043e\u0441\u043e\u0431\u043d\u044b\u0435",
                    value: numberFormatter.format(selectedFeature?.properties?.workingAge ?? 0)
                  },
                  {
                    label: "\u0414\u043e\u043b\u044f 0\u201315",
                    value: `${Number(selectedFeature?.properties?.youthShare ?? 0).toFixed(1)}%`
                  },
                  {
                    label: "\u0414\u043e\u043b\u044f 65+",
                    value: `${Number(selectedFeature?.properties?.seniorShare ?? 0).toFixed(1)}%`
                  },
                  {
                    label: "\u0420\u0438\u0441\u043a",
                    value: isFiniteNumber(selectedFeature?.properties?.riskScore)
                      ? selectedFeature.properties.riskScore.toFixed(1)
                      : "\u041d/\u0434"
                  },
                  {
                    label: "\u0422\u043e\u043f-\u0444\u0430\u043a\u0442\u043e\u0440",
                    value: safeText(selectedFeature?.properties?.topFactor ?? "\u041d/\u0434")
                  }
                ].map((item, index) => (
                  <motion.article
                    key={item.label}
                    className="glass-block readout-card p-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.04 + index * 0.03, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                  >
                    <p className="data-kicker">{safeText(item.label)}</p>
                    <p className="mt-2 font-mono text-base text-white">{item.value}</p>
                  </motion.article>
                ))}
              </div>

              {onOpenDistrict ? (
                <button
                  type="button"
                  className="control-button mt-3 w-full justify-center"
                  onClick={() => onOpenDistrict(selectedFeature?.properties?.name)}
                >
                  {safeText(openDistrictLabel)}
                </button>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
