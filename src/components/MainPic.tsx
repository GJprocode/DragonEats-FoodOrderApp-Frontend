import food from "../assets/food.png";

const MainPic = () => {
    return(
        <div style={{ maxWidth: '1280px', maxHeight: '1024px', margin: '0 auto' }}> {/* Adjust max-width as needed */}
        <img src={food} className="w-full h-auto" alt="Main Picture" />
    </div>
    );
};

export default MainPic;