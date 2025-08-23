import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import { PatientView } from './PatientView';
import { PatientDetail } from './PatientDetail';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
     <ApolloProvider client={client}>
    <div className="App">
       <Router>
      <Routes>
         <Route path="/" element={ <PatientView />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
      </Routes>
      </Router>
    </div>
    </ApolloProvider>
  );
}

export default App;
