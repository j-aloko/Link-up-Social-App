import React from "react";
import "./NoResults.css";
import CloseIcon from "@mui/icons-material/Close";

function NoResults({ close, setClose, setNoResult }) {
  const handleClose = () => {
    setClose(true);
    setNoResult(false);
  };

  return (
    <>
      {close ? null : (
        <div className="noResults">
          <div className="closeIcon" onClick={handleClose}>
            <CloseIcon />
          </div>
          <span>No Results Found ☹️</span>
        </div>
      )}
    </>
  );
}

export default NoResults;
