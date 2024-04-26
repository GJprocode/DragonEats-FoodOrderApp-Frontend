import Footer from "@/components/Footer";
import MainPic from "@/components/MainPic";
import Header from "@/components/header"; 

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