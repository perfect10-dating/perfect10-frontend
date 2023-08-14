import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
import {Test} from "./components/Test";

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path={"/test"} element={<Test />} />
          // TODO -- edit profile
      </Routes>
    </Router>
  )
}
