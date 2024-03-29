import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext';
import LoginRequired from '@/components/LoginRequired';
import React from 'react';
import { showAlert } from '@/utils/showAlert';
import { myFetch } from '@/utils/myFetch';

export default function StoreCowData () {
    const router = useRouter();

    const [submittedDB, setSubmittedDB] = React.useState(false);
    const [submittedBlockChain, setSubmittedBlockChain] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [quality, setQuality] = React.useState({});
    const [quantity, setQuantity] = React.useState(null);


    const {id} = router.query;

    // console.log(id);

    const {token} = useAuth();

    const handleChange = (e) => {
        setQuality({ ...quality, [e.target.name]: e.target.value });
      };
    
  const addToBlockChain = async ( data ) => {
    let url = "/api/contract/cowMilkQualities"
    let formData1 = {
      _id: data._id ? data._id:"",
      cowId:data.cowId ? data.cowId: "",
      quantity:data.quantity ? data.quantity: "",
      temperature:data?.quality?.temperature ? data?.quality?.temperature: "",
      fat:data?.quality?.fat ? data?.quality?.fat: "",
      protein:data?.quality?.protein ? data?.quality?.protein: "", 
    }
    console.log(formData1);

    let data1 = await myFetch(url, "POST", formData1);

    console.log(data1);

  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setSubmitting(true);

    try {
    let url = "/api/cowMilkQualities"
    let data = await myFetch(url, "POST", 
    {
        "quality": quality,
        "quantity": quantity, 
        "cowId":id,
    });

    console.log(data);

    setQuality({}); setQuantity(null);
    setSubmittedDB(true);

    addToBlockChain(data);

    // setSubmitting(false);
    showAlert("Cow Milk Dada Stored Successfully")
    }
    catch (e) { 
        console.log(e);
        showAlert("Something went wrong", "error")
    } 
    finally{
        setSubmitting(false);
    }
    
    // console.log(name, email, password, address);
}



    if (!token) { 
        return (
            <LoginRequired  />
        )
    }

    return (
        <div className='bg-base-100 min-h-screen px-4 md:px-8 py-4'>
            
            <div className='card md:w-2/4 m-auto bg-base-200 p-4'>
                <h1 className='text-xl'>Enter the Data</h1>

                {!submittedDB && <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="">
                    <label className="block mb-2 text-sm "> Quantity</label>
                    <input
                      type="number"
                      required
                      name="quantity"
                      value={quantity}
                      onChange={(e)=> setQuantity(e.target.value)}
                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className=" mt-4">
                    <label className="block mb-2 text-sm">Temperature</label>
                    <input
                      type="number"
                      required
                      name="temperature"
                      value={quality.temperature}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className=" mt-4">
                    <label className="block mb-2 text-sm">Fat</label>
                    <input
                      type="number"
                      required
                      name="fat"
                      value={quality.fat}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className=" mt-4">
                    <label className="block mb-2 text-sm">Protein</label>
                    <input
                      type="number"
                      required
                      name="protein"
                      value={quality.protein}
                      onChange={handleChange}

                      placeholder=""
                      className="block w-full mt-2 input input-sm input-bordered"
                    />
                  </div>

                  <div className="mt-4">
                

                    {!submitting && <input type="submit" className="btn btn-primary mt-4" />}

                    {submitting && (
                      <button className="btn px-6 py-3 mt-4">
                        <span className="loading loading-spinner"></span>
                        Submitting
                      </button>
                    )}
                  </div>
                </form>

                }

                {submittedDB && <div role="alert" className="alert mt-4 alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>The data is stored in the database</span>
                </div>}

                {submittedBlockChain && <div role="alert" className="alert mt-4 alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>The data is stored in the blockchain</span>
                </div>}
            </div>
            
        </div>
    )
}