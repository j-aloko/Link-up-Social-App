import React from "react";
import "./SearchResults.css";
import { useHistory } from "react-router-dom";

function SearchResults({ result, close, setClose }) {
  const history = useHistory();

  const handleFind = () => {
    setClose(true);
    history.push(`/profile/${result?._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {close ? null : (
        <div className="searchResults">
          <div className="resultField">
            <div className="userImageNameAndClose">
              <div className="userImageAndName" onClick={handleFind}>
                <img
                  src={
                    result?.profilePic ||
                    "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  }
                  alt=""
                  className="userImg"
                />
                <span className="username">{result?.username}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResults;
