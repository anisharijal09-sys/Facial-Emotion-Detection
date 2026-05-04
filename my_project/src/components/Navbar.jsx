import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center ">
        
        
        <div className="px-16 py-4 flex justify-center gap-10">
          <Link to="/" className="text-white hover:text-violet-700">
            HOME
          </Link>
          <Link to="/Aboutus" className="text-white hover:text-violet-700">
            ABOUT US
          </Link>
          <Link to="/Prediction" className="text-white hover:text-violet-700">
            PREDICTION
          </Link>
        </div>

        <div className="px-20">
          <Link
            to="/Contact"
            className="text-white rounded-full px-3 py-3 bg-violet-700 hover:bg-violet-600"
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );

}
export default Navbar;
