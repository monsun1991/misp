import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryProvider } from './hooks/provider';
import { BrowserRouter } from 'react-router-dom';


window.addEventListener("error", e => {
  if (e.message?.includes("Failed to fetch dynamically imported module")) {
    console.log("Chunk load failed → Reloading...");
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  </QueryProvider>
)