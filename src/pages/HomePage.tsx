import landingImage from "../assets/CellApp.png";
import appDownloadImage1 from "../assets/AppleStore.png";
import appDownloadImage2 from "../assets/GooglePlay.png";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12 items-center">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-green-600">
          Superpower food that unleashes the dragon in you!
        </h1>
        <span className="text-xl">
          Magical DragonEats food delivered quick & easy.
        </span>
      </div>
      <div className="md:grid md:grid-cols-2 gap-5 items-center">
        <img src={landingImage} alt="CellApp" className="max-w-full" />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-3xl tracking-tighter">
            Your order winged in!
          </span>
          <span>Download DragonEats App for magical food delivery!</span>
          <div className="flex gap-4">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appDownloadImage1}
                alt="Apple Store Logo"
                className="logo-img"
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appDownloadImage2}
                alt="Google Play Logo"
                className="logo-img"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
