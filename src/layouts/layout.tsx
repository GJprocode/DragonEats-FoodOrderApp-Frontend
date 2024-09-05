import Footer from "../components/Footer";
import Header from "../components/header";
import MainPic from "../components/MainPic";

type Props = {
  children: React.ReactNode;
  showMainPic?: boolean;
};

const Layout = ({ children, showMainPic = false }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showMainPic && <MainPic />}
      <div className="container mx-auto flex-1 py-10">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
