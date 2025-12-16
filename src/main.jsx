import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import { UsersProvider } from "./context/UsersContext";
// import { RolesProvider } from "./context/RolesContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { BranchesProvider } from "./context/BranchesContext";
import { UsersProvider } from "./context/UsersContext";
import { RolesProvider } from "./context/RolesContext";
// import { BranchesProvider } from "./context/BranchesContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    {/* Auth next, so others can use useAuth */}
    <AuthProvider>
      {/* Companies first, since AuthProvider uses useCompanies */}
      <CompaniesProvider>
        <BranchesProvider>
          {/* Roles & Users can depend on Auth and Companies */}
          <RolesProvider>
            <UsersProvider>
              {/* Branches can depend on Auth + Companies as well */}
              <App />
            </UsersProvider>
          </RolesProvider>
        </BranchesProvider>
      </CompaniesProvider>
    </AuthProvider>
  </BrowserRouter>
  // </StrictMode>
);
