import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure this path is correct

const App = () => {
  const [editid, seteditid] = useState(null);
  const [getdata, setgetdata] = useState([]);
  const [userdata, setuserdata] = useState({
    fullname: "",
    email: "",
  });
  const [file, setfile] = useState(null);
  const [uploads, setUploads] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserdata({ ...userdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editid) {
      await axios.put(`http://localhost:6002/editdata/${editid}`, userdata);
      seteditid(null);
    } else {
      await axios.post(`http://localhost:6002/postdata`, userdata);
    }
    setuserdata({ fullname: "", email: "" });
    fetchdata();
  };

  const fetchdata = async () => {
    const res = await axios.get(`http://localhost:6002/getdata`);
    setgetdata(res.data);
  };

  const handledelete = async (id) => {
    await axios.delete(`http://localhost:6002/deletedata/${id}`);
    fetchdata();
  };

  const handleedit = (data) => {
    setuserdata({ fullname: data.fullname, email: data.email });
    seteditid(data._id);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`http://localhost:6002/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setfile(null);
      fetchUploads();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImage = (e) => {
    const selectedfile = e.target.files[0];
    if (selectedfile) {
      setfile(selectedfile);
    }
  };

  const fetchUploads = () => {
    axios
      .get("http://localhost:6002/getuploads")
      .then((res) => setUploads(res.data))
      .catch((error) => console.error("Error fetching uploads:", error));
  };

  useEffect(() => {
    fetchdata();
    fetchUploads();
  }, []);

  return (
    <div className="container">
      <h1 className="main-title">React Form & Upload Example</h1>

      <form onSubmit={handleImageSubmit} className="form upload-form">
        <label>Upload Image</label>
        <input type="file" name="file" onChange={handleChangeImage} />
        <button type="submit">Upload</button>
      </form>

      <form onSubmit={handleSubmit} className="form user-form">
        <label>Full Name</label>
        <input
          type="text"
          name="fullname"
          value={userdata.fullname}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={userdata.email}
          onChange={handleChange}
        />
        <button type="submit">{editid ? "Update" : "Submit"}</button>
      </form>

      <div className="form-data">
        <h2>Submitted Data</h2>
        {getdata.length > 0 ? (
          getdata.map((data) => (
            <div className="data-entry" key={data._id}>
              <p><strong>Name:</strong> {data.fullname}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <button className="btn-delete" onClick={() => handledelete(data._id)}>
                Delete
              </button>
              <button className="btn-edit" onClick={() => handleedit(data)}>
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>

      <div className="uploaded-images">
        <h2>Uploaded Images</h2>
        <div className="image-grid">
          {uploads.map((item, index) => (
            <div className="image-wrapper" key={index}>
              <img
                src={`http://localhost:6002/uploads/${item.imagename}`}
                alt="Uploaded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
