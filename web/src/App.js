import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

let baseUrl = "https://crudmongodbpwa-production.up.railway.app";

function App() {
  const [postName, setpostName] = useState("");
  const [postPrice, setpostPrice] = useState();
  const [postDescription, setpostDescription] = useState("");
  const [getData, setgetData] = useState();
  const [istrue, setistrue] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [Editing, setEditing] = useState({
    editing_id: null,
    editingName: "",
    editingPrice: "",
    editingDescription: "",
  });
  const AllProduct = async () => {
    try {
      const response = await axios
        .get(`${baseUrl}/products`)
        .then((response) => {
          // console.log(response.data);
          setgetData(response.data.data);
        });
    } catch (err) {
      console.log("err", err);
    }
  };

  const SavePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/product`, {
        name: postName,
        price: postPrice,
        description: postDescription,
      });
      setistrue(!istrue);
    } catch (err) {
      console.log("err", err);
    }
  };
  const DeletePost = async (post_id) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${post_id}`);
      setistrue(!istrue);
    } catch (err) {
      console.log("err", err);
    }
  };
  const UpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/product/${Editing.editing_id}`,
        {
          name: Editing.editingName,
          price: Editing.editingPrice,
          description: Editing.editingDescription,
        }
      );
      setistrue(!istrue);
      setisEdit(!isEdit);
      setEditing({
        editing_id: null,
        editingName: "",
        editingPrice: "",
        editingDescription: "",
      });
    } catch (err) {
      console.log("err", err);
    }
  };
  useEffect(() => {
    AllProduct();
    console.log("chal gaya");
  }, [istrue]);
  return (
    <>
      <div>
        <form onSubmit={SavePost} className="form">
          <input
            className="input"
            type="text"
            placeholder="Product name"
            onChange={(e) => {
              setpostName(e.target.value);
            }}
          />
          <input
            className="input"
            type="number"
            placeholder="price"
            onChange={(e) => {
              setpostPrice(e.target.value);
            }}
          />
          <input
            className="input"
            type="text"
            placeholder="description"
            onChange={(e) => {
              setpostDescription(e.target.value);
            }}
          />
          <input type="submit" className="button" value="SetPost" />
        </form>
        <div className="body">
          <div className="flex">
            {getData?.map((eachPost, i) => {
              return (
                <div className="post" key={i}>
                  <div className="postText">
                    <p className="overflow">
                      {isEdit && eachPost._id === Editing.editing_id
                        ? null
                        : `_id :` + eachPost?._id}
                    </p>

                    <h3 className="postDescr overflow">
                      {isEdit && eachPost._id === Editing.editing_id ? (
                        <form className="NextForm" onSubmit={UpdatePost}>
                          <input
                            type="text"
                            className="input"
                            defaultValue={Editing.editingName}
                            onChange={(e) => {
                              setEditing({
                                ...Editing,
                                editingName: e.target.value,
                              });
                            }}
                            placeholder="Please Enter Updated Value"
                          />
                          <input
                            type="number"
                            className="input"
                            defaultValue={Editing.editingPrice}
                            onChange={(e) => {
                              setEditing({
                                ...Editing,
                                editingPrice: e.target.value,
                              });
                            }}
                            placeholder="Price"
                          />
                          <input
                            type="text"
                            className="input"
                            defaultValue={Editing.editingDescription}
                            onChange={(e) => {
                              setEditing({
                                ...Editing,
                                editingDescription: e.target.value,
                              });
                            }}
                            placeholder="description"
                          />
                          <input
                            type="submit"
                            className="button next"
                            value="Update"
                          />
                        </form>
                      ) : (
                        `Name :` + eachPost?.name
                      )}
                    </h3>

                    <span className="overflow">
                      {isEdit && eachPost._id === Editing.editing_id
                        ? null
                        : `Price :` + eachPost?.price}
                    </span>
                    <p className="overflow">
                      {isEdit && eachPost._id === Editing.editing_id
                        ? null
                        : `Description :` + eachPost?.description}
                    </p>
                    <div style={{ margin: "10px auto" }}>
                      <button
                        className="button"
                        onClick={() => {
                          DeletePost(eachPost?._id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="button"
                        onClick={() => {
                          setEditing({
                            editing_id: eachPost?._id,
                            editingName: eachPost?.name,
                            editingPrice: eachPost?.price,
                            editingDescription: eachPost?.description,
                          });
                          setisEdit(!isEdit);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <OneProduct className="newcomponent" />
        </div>
      </div>
    </>
  );
}

export default App;