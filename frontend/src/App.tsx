import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router/AppRouter';
import './App.css';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#28a745',
            },
          },
          error: {
            style: {
              background: '#dc3545',
            },
          },
        }}
      />
    </>
  );
}

export default App;
