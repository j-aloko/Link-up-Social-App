import React, { useState, useContext, useEffect } from "react";
import "./Settings.css";
//import { storage } from "../../Firebase/Firebase";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useHistory } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axiosInstance from "./../../axios";

function Settings() {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  //const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [relationship, setRelationship] = useState("");
  const [from, setFrom] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [deleteError, setDeleteError] = useState(0);

  const { user } = useContext(userContext);
  const location = useLocation();
  const history = useHistory();
  const userId = location.pathname.split("/")[2];

  //Uploading Image to firebase then get downloadUrl
  /*const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    const uploadTask = storage.ref(`blogImages/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const status = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(status);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("blogImages")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setProfilePic(url);
            setUploading(false);
          });
      }
    );
  };*/

  //Uploading ProfilePic to my server
  useEffect(() => {
    if (file) {
      const uploadProfilePic = async () => {
        const data = new FormData();
        data.append("file", file);
        try {
          const res = await axiosInstance.post("upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setProfilePic(res.data.filePath);
        } catch (error) {
          console.log(error);
        }
      };
      uploadProfilePic();
    }
  }, [file, profilePic]);

  //Uploading Cover Photo to my server
  useEffect(() => {
    if (img) {
      const uploadcoverPhoto = async () => {
        const data = new FormData();
        data.append("file", img);
        try {
          const res = await axiosInstance.post("upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setCoverPhoto(res.data.filePath);
        } catch (error) {
          console.log(error);
        }
      };
      uploadcoverPhoto();
    }
  }, [img]);

  //Updating User Info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedUser = {
      username,
      email,
      password,
      profilePic,
      coverPhoto,
      relationship,
      from,
      city,
      description,
    };
    //Updating LocalStorage Items
    try {
      await axiosInstance.put("users/" + userId, updatedUser);
      const storageItem = JSON.parse(localStorage.getItem("user"));
      const newStorageItem = {
        ...storageItem,
        username: username,
        email: email,
        password: password,
        profilePic: profilePic,
        coverPhoto: coverPhoto,
        relationship: relationship,
        from: from,
        city: city,
      };

      localStorage.setItem("user", JSON.stringify(newStorageItem));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        history.push(`/profile/${userId}`);
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  //Deleting User Account and Posts
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError(1);
    try {
      await axiosInstance.delete(
        "users/" + userId,

        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        },
        {
          username: user.username,
        }
      );
      setDeleteError(0);
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log(error);
      setDeleteError(2);
    }
  };

  return (
    <>
      <div className="settings">
        <div className="settingsWrapper">
          <div className="settingsTitleAndButton">
            <h3 className="updateTitle">Update Your Account</h3>
            <button
              className="deleteAccount"
              onClick={handleDelete}
              disabled={deleteError === 1}
            >
              {deleteError === 1 ? (
                <CircularProgress color="success" />
              ) : (
                "Delete Account"
              )}
            </button>
            {deleteError === 2 && (
              <span style={{ color: "red" }}>
                Failed! cannot delete this Account
              </span>
            )}
          </div>
          <div>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="bio"
              autoFocus={true}
              placeholder="Write a brief description about your personality..."
            ></textarea>
          </div>
          <div className="profilePictureWrapper">
            <div className="updateProfilePicture">
              <span className="profileTitle">Profile Picture</span>
              <label htmlFor="file"></label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="updateCoverPhoto">
              <span className="profileTitle">Cover Photo</span>
              <label htmlFor="file"></label>
              <input
                type="file"
                id="file"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
          <form className="updateForm">
            <div className="inputItems">
              <label>Username</label>
              <input
                type="text"
                id="username"
                placeholder={user.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inputItems">
              <label>Email</label>
              <input
                type="email"
                id="email"
                placeholder={user.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputItems">
              <label>Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="inputItems">
              <label>Relationship</label>
              <select
                onChange={(e) => setRelationship(e.target.value)}
                name="relationship"
                id="relationship"
                className="selectField"
              >
                <option>Choose</option>
                <option value="Single">Single</option>
                <option value="Dating">Dating</option>
                <option value="Married">Married</option>
              </select>
            </div>
            <div className="inputItems">
              <label>Country</label>
              <select
                id="from"
                name="from"
                className="selectField"
                onChange={(e) => setFrom(e.target.value)}
              >
                <option value="Afganistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antigua & Barbuda">Antigua & Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bonaire">Bonaire</option>
                <option value="Bosnia & Herzegovina">
                  Bosnia & Herzegovina
                </option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Ter">
                  British Indian Ocean Ter
                </option>
                <option value="Brunei">Brunei</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Canary Islands">Canary Islands</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">
                  Central African Republic
                </option>
                <option value="Chad">Chad</option>
                <option value="Channel Islands">Channel Islands</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos Island">Cocos Island</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote DIvoire">Cote DIvoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Curaco">Curacao</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="East Timor">East Timor</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands">Falkland Islands</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Ter">French Southern Ter</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Great Britain">Great Britain</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="Indonesia">Indonesia</option>
                <option value="India">India</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea North">Korea North</option>
                <option value="Korea Sout">Korea South</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macau">Macau</option>
                <option value="Macedonia">Macedonia</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Malawi">Malawi</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Midway Islands">Midway Islands</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Nambia">Nambia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherland Antilles">Netherland Antilles</option>
                <option value="Netherlands">
                  Netherlands (Holland, Europe)
                </option>
                <option value="Nevis">Nevis</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau Island">Palau Island</option>
                <option value="Palestine">Palestine</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Phillipines">Philippines</option>
                <option value="Pitcairn Island">Pitcairn Island</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Republic of Montenegro">
                  Republic of Montenegro
                </option>
                <option value="Republic of Serbia">Republic of Serbia</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="St Barthelemy">St Barthelemy</option>
                <option value="St Eustatius">St Eustatius</option>
                <option value="St Helena">St Helena</option>
                <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                <option value="St Lucia">St Lucia</option>
                <option value="St Maarten">St Maarten</option>
                <option value="St Pierre & Miquelon">
                  St Pierre & Miquelon
                </option>
                <option value="St Vincent & Grenadines">
                  St Vincent & Grenadines
                </option>
                <option value="Saipan">Saipan</option>
                <option value="Samoa">Samoa</option>
                <option value="Samoa American">Samoa American</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome & Principe">Sao Tome & Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Tahiti">Tahiti</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Thailand">Thailand</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad & Tobago">Trinidad & Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks & Caicos Is">Turks & Caicos Is</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Erimates">
                  United Arab Emirates
                </option>
                <option value="United States of America">
                  United States of America
                </option>
                <option value="Uraguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Vatican City State">Vatican City State</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Virgin Islands (Brit)">
                  Virgin Islands (Brit)
                </option>
                <option value="Virgin Islands (USA)">
                  Virgin Islands (USA)
                </option>
                <option value="Wake Island">Wake Island</option>
                <option value="Wallis & Futana Is">Wallis & Futana Is</option>
                <option value="Yemen">Yemen</option>
                <option value="Zaire">Zaire</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
            </div>
            <div className="inputItems">
              <label>City</label>
              <input
                onChange={(e) => setCity(e.target.value)}
                type="text"
                id="city"
              />
            </div>
          </form>
          {success ? null : (
            <button className="updateInfoButton" onClick={handleSubmit}>
              {loading ? <CircularProgress color="success" /> : "Update"}
            </button>
          )}
          {success && (
            <div
              style={{
                width: "350px",
                padding: "5px",
                backgroundColor: "green",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  color: "white",
                }}
              >
                <CheckCircleOutlineIcon style={{ color: "white" }} /> Updated
                Successfully!
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                width: "350px",
                padding: "5px",
                backgroundColor: "red",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  color: "red",
                }}
              >
                <WarningAmberIcon style={{ color: "white" }} /> Something went
                wrong!
              </span>
            </div>
          )}
        </div>
        <div className="Sidebar"></div>
      </div>
    </>
  );
}

export default Settings;
