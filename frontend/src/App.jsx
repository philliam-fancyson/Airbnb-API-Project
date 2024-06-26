import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetails from './components/Spots/SpotDetails';
import CreateSpotForm from './components/Spots/CreateSpotForm';
import ManageSpots from './components/Spots/SpotManage';
import UpdateSpotForm from './components/Spots/UpdateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: 'spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: 'spots/new',
        element: <CreateSpotForm />
      },
      {
        path: 'spots/manage',
        element: <ManageSpots />
      },
      {
        path: 'spots/:spotId/edit',
        element: <UpdateSpotForm />
      },
      {
        path: '*',
        element: <h1>Page not found</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
