import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/main/Header";
import Search from "./components/main/Search";
import Meal from "./components/main/Meal";
import AddRecipe from "./components/main/Add";
import RegisterForm from "./components/user/Register";
import LoginForm from "./components/user/Login";
import EditMeal from "./components/main/Edit";
import Profile from "./components/user/Profile";
import Category from "./components/main/Category";
import Footer from "./components/main/Footer";
import SharePage from "./components/user/sharePage";
import CommunityPage from "./components/main/comunity";

function App() {
  return (
    <Router>
      <Header />
      <main className="max-w-4xl mx-auto px-1">
        {" "}
        {/* Updated max-width to 4xl for a wider content area */}
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/meal/:id" element={<Meal />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/edit/:id" element={<EditMeal />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/category" element={<Category />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </main>
      <Footer />;
    </Router>
  );
}

export default App;
