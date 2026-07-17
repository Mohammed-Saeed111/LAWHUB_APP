import AppRoutes from './routes/AppRoutes.jsx';

/**
 * Root component. Routing is delegated to AppRoutes,
 * global providers (language, auth) live in main.jsx.
 */
const App = () => <AppRoutes />;

export default App;
