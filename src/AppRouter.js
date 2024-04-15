import React from 'react'
import { Route, Routes, Link } from 'react-router-dom'

import Home from './home.js'
import FCConfig from './flightcontroller.js'
import LogBrowser from './logBrowser.js'
import NetworkClients from './networkClients.js'
import NTRIPPage from './ntripcontroller.js'
import VPN from './vpnconfig'

import Logo from './images/logo.webp'

function AppRouter () {
  return (
    <div id="wrapper" className="d-flex">
      <div id="sidebar-wrapper" className="bg-light border-right">
      <div id="sidebarheading" className="sidebar-heading">
        <img src={Logo} width="100px" />
      </div>
        <div id="sidebar-items" className="list-group list-group-flush">
          <Link className='list-group-item list-group-item-action bg-light' to="/">Home</Link>
          <Link className='list-group-item list-group-item-action bg-light' to="/flightlogs">Flight Logs</Link>
          <Link className='list-group-item list-group-item-action bg-light' to="/controller">Flight Controller</Link>
          <Link className='list-group-item list-group-item-action bg-light' to="/ntrip">NTRIP Config</Link>
          <Link className='list-group-item list-group-item-action bg-light' to="/vpn">VPN Config</Link>
        </div>
      </div>

      <div className="page-content-wrapper" style={{ width: '100%' }}>
        <div className="container-fluid">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/controller" element={<FCConfig />} />
            <Route exact path="/flightlogs" element={<LogBrowser />} />
            <Route exact path="/apclients" element={<NetworkClients />} />
            <Route exact path="/ntrip" element={<NTRIPPage />} />
            <Route exact path="/vpn" element={<VPN/>} />
            <Route element={NoMatch} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function NoMatch ({ location }) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default AppRouter
