import React from "react";
import { useAuth } from "@/context/AuthContext";
import { myFetch } from "@/utils/myFetch";
import { showAlert } from "@/utils/showAlert";
import { useData } from "@/context/DataContext";

export default function AddCowModal({modalName}){

  const [formData, setFormData] = React.useState({});

  const [submitting, setSubmitting] = React.useState(false); // New state for loading

    const {authUser} = useAuth();
    const {fetchFarmerCows} = useData();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const storeToBlockchain = async (cowData) => {
    let url = "/api/contract/cows"
    let formData1 = {
      _id: cowData._id ? cowData._id:"",
      farmerId:cowData.farmerId ? cowData.farmerId: "",
      cowNumber:cowData.cowNumber ? cowData.cowNumber: "",
      food:cowData.food ? cowData.food: "",
      milkingSystem:cowData.milkingSystem ? cowData.milkingSystem: "",
      breed:cowData.breed ? cowData.breed: "", 
      age:cowData.age ? cowData.age: "",
    }

    let data = await myFetch(url, "POST", formData1);

    console.log(data);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSubmitting(true);

    try {
    let url = "/api/farmerCows"
    formData['farmerId'] = authUser._id;
    let data = await myFetch(url, "POST", formData);

    console.log(data);

    storeToBlockchain(data);
    // showAlert("Cow Added to blockchain Successfully");

    setFormData({
      breed:"",
      age:"",
      milkingSystem:""
    });
    // setSubmitting(false);
    document.getElementById(modalName).close();
    showAlert("Cow Added Successfully");
    fetchFarmerCows();

    }
    catch (e) { 
        showAlert("Something went wrong", "error")
    } 
    finally{
        setSubmitting(false);
    }
    
    // console.log(name, email, password, address);
}




    return (

        <dialog id={modalName} className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>

    <h3 className="font-bold text-lg">Add Cow</h3>

    <form className="mt-8" onSubmit={handleSubmit}>
                  
              <div className=" mt-4">
                    <label className="block mb-2 text-sm">Breed</label>
                    <input
                      type="text"
                      required
                      name="breed"
                      value={formData?.breed}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className=" mt-4">
                    <label className="block mb-2 text-sm">Milking System</label>
                    <input
                      type="text"
                      required
                      name="milkingSystem"
                      value={formData?.milkingSystem}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className=" mt-4">
                    <label className="block mb-2 text-sm">Age</label>
                    <input
                      type="number"
                      required
                      name="age"
                      value={formData?.age}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                 

                  <div className="mt-4">
                

                    {!submitting && <input type="submit" className="btn mt-4" />}

                    {submitting && (
                      <button className="btn px-6 py-3 mt-4">
                        <span className="loading loading-spinner"></span>
                        Submitting
                      </button>
                    )}
                  </div>
                </form>



  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

    )
}