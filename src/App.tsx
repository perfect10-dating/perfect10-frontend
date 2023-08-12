import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'
import { LandingPage } from './components/entry/LandingPage'
import { Create } from './components/entry/Create'
import { DateReview } from './components/recording_date/DateReview'
import { JoinNewRoom } from './components/recording_date/JoinNewRoom'
import { WaitingForDate } from './components/waiting/WaitingForDate'
import { WaitingForRoom } from './components/waiting/WaitingForRoom'
import { WaitingForTime } from './components/waiting/WaitingForTime'

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          // TODO -- edit profile
      </Routes>
    </Router>
  )
}
