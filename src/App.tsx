import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { ResumePreview } from './pages/ResumePreview';

export default function App() {
  return (
    <BrowserRouter>
      {/* <NavBar /> We can uncomment or create a new simplified NavBar later */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preview" element={<ResumePreview />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
