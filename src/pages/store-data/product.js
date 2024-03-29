import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { myFetch } from '@/utils/myFetch';
import LoginRequired from '@/components/LoginRequired';
import { showAlert } from '@/utils/showAlert';

export default function ProductCheck() {

    const [submittedDB, setSubmittedDB] = React.useState(false);
    const [submittedBlockChain, setSubmittedBlockChain] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [quality, setQuality] = React.useState({});
    const [quantity, setQuantity] = React.useState(null);
    const [selected, setSelected] = React.useState();

    const [preProductQualities, setPreProductQualities] = React.useState([]);

    const handleChange = (e) => {
        setQuality({ ...quality, [e.target.name]: e.target.value });
      };

    const removeObjectById = (id) => {
        setPreProductQualities(prevState => {
            const updatedQualities = prevState.filter(obj => obj._id !== id);
            return updatedQualities;
        });
    };

    const {token, authUser} = useAuth();

    const getPreProducts = async () => {

       let url = "/api/preProductQualities?centerId=" + authUser._id +"&isProductChecked=" + false;

       let data = await myFetch(url);
       console.log(data);
       setPreProductQualities(data.preProductQualitys)

    } 

    React.useEffect(()=> {
        if (authUser){
            getPreProducts();
        }
    }, [authUser])

   
    const changeStatusToStored = async () => {
        removeObjectById(selected.split(",")[0]);

        let url = "/api/preProductQualities"
        let formData =  {
            "id":  selected.split(",")[0],
            "isProductChecked": true,
        }

        let data = await myFetch(url, "PUT", formData);
        console.log(data);
        
    }



  const storeToBlockchain = async (data) => {
    let url = "/api/contract/productQualities"
    let formData1 = {
      _id: data._id ? data._id:"",
      centerId:data.centerId ? data.centerId: "",
      productName: data.productName ? data.productName:"",
      quantity:data.quantity ? data.quantity: "",
      temperature:data?.quality?.temperature ? data?.quality?.temperature: "",
      fat:data?.quality?.fat ? data?.quality?.fat: "",
      protein:data?.quality?.protein ? data?.quality?.protein: "", 
    }

    let data1 = await myFetch(url, "POST", formData1);

    console.log(data1);
  }
  
        
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!selected) {

        showAlert("Please select a product", "error")
        return 

    }


    setSubmitting(true);

    try {
    let url = "/api/productQualities";
    let productName = selected.split(",")[1]
    let preProductQualityId = selected.split(",")[0]

    let data = await myFetch(url, "POST", 
    {   
        "centerId": authUser._id, 
        "productName": productName,
        "quality": quality,
        "quantity": quantity, 
        "preProductQualityId": preProductQualityId,
    });

    console.log(data);

    setQuality({
      temperature: "",
      fat:"",
      protein:""
    }); setQuantity("");
    setSelected("");

    setSubmittedDB(true);
    storeToBlockchain(data);
    changeStatusToStored();

    // setSubmitting(false);
    showAlert("Data Stored Successfully")
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

        return <LoginRequired />
     }


    return (
        <div className='bg-base-100 min-h-screen px-4 md:px-8 py-4'>
            
            <div className='card md:w-2/4 m-auto bg-base-200 p-4'>

            {preProductQualities.length===0 &&
                <h1 className='text-xl text-info'> All the data stored for all the products</h1>
            }

            
            {( preProductQualities.length>0) && <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="">

                  <h1 className='text-xl mb-4'>Enter the data for products</h1>


                  <select value={selected} onChange={(e)=> setSelected(e.target.value)} className="select mb-4  select-sm select-bordered">
                <option selected disabled value="">Selecte Product Name: </option>

                {preProductQualities.map((item, index)=> 
                
                <option key={index} value={item._id+","+item.productName}>{item.productName}</option>
                )}


            </select>
            


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

                {submittedBlockChain && <div role="alert" className="alert mt-4 alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>The Data is Stored in the Database</span>
                </div>}


            </div>

        </div>
    )
}