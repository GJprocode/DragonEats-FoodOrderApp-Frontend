import food from "../assets/food.png";


// main pic function is food.png to showMainPic
const MainPic = () => {
    return(
        <div style={{ maxWidth: '600px', maxHeight: '400px', margin: '0 auto' }}> {/* Adjust max-width as needed */}
        <img src={food} className="w-full h-auto" alt="Main Picture" />
    </div>
    );
};

export default MainPic;