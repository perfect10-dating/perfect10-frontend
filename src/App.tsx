import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
import { LandingPage } from './components/entry/LandingPage'
import { Create } from './components/entry/Create'
import { WaitingForDate } from './components/recording_date/WaitingForDate'
import { WaitingForRoom } from './components/waiting/WaitingForRoom'

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path={"/landing"} element={<LandingPage />} />
          <Route path={"/create"} element={<Create />} />
          <Route path={"/waiting-date"} element={} />
          <Route path={"/waiting-room"} element={} />
      </Routes>
    </Router>
  )
}
