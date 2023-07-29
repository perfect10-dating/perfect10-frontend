import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Home } from './components/Home'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path='/survey/:mask' element={<SurveyNavbar />}>*/}
        {/*  <Route path='/survey/:mask' element={<Survey />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/WomenForDiehl' element={<PageNavbarWFD />}>*/}
        {/*  <Route path='/page/WomenForDiehl' element={<VideoRedirectWFD />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/B2BTour' element={<PageNavbarLE />}>*/}
        {/*  <Route path='/page/B2BTour' element={<VideoRedirectLE />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/MeetLeah' element={<PageNavbarLA />}>*/}
        {/*  <Route path='/page/MeetLeah' element={<VideoRedirectLA />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/daily-diehl-infra' element={<PageNavbarInfra />}>*/}
        {/*  <Route path='/page/daily-diehl-infra' element={<VideoRedirectInfra />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/daily-diehl-vaccine-mandates' element={<PageNavbarInfra />}>*/}
        {/*  <Route path='/page/daily-diehl-vaccine-mandates' element={<VideoRedirectVax />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/daily-diehl-small-business' element={<PageNavbarInfra />}>*/}
        {/*  <Route path='/page/daily-diehl-small-business' element={<VideoRedirectSB />} />*/}
        {/*</Route>*/}
        {/*<Route path='/page/daily-diehl-political-agendas-in-school' element={<PageNavbarInfra />}>*/}
        {/*  <Route path='/page/daily-diehl-political-agendas-in-school' element={<VideoRedirectPS />} />*/}
        {/*</Route>*/}
      </Routes>
    </Router>
  )
}
