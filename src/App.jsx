import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import 'react-phone-input-2/lib/style.css';


function App() {
  return (
    <>
      <Toaster />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
