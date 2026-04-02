import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="route-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.to && !isLast ? (
              <Link to={item.to} className="route-breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className={`route-breadcrumbs__label ${isLast ? "route-breadcrumbs__label--current" : ""}`}>
                {item.label}
              </span>
            )}
            {!isLast ? <ChevronRight size={14} className="route-breadcrumbs__icon" /> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

