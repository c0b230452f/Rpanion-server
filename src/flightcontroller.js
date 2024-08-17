import React from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import basePage from './basePage.js';

import './css/styles.css';

class FCPage extends basePage {
  constructor(props, useSocketIO = true) {
    super(props, useSocketIO);
    this.state = {
      telemetryStatus: this.props.telemetryStatus,
      serialPorts: [],
      baudRates: [],
      mavVersions: [],
      serialPortSelected: null,
      baudRateSelected: null,
      mavVersionSelected: null,
      enableHeartbeat: null,
      enableTCP: null,
      FCStatus: {},
      UDPoutputs: [],
      addrow: "",
      loading: true,
      error: null,
      infoMessage: null,
      socketioStatus: false,
      usedSocketIO: true,
      enableUDPB: false,
      UDPBPort: 14550,
      enableDSRequest: false,
      tlogging: false
    }

    // Socket.io client for reading in analog update values
    this.socket.on('FCStatus', function (msg) {
      this.setState({ FCStatus: msg });
    }.bind(this));
    this.socket.on('reconnect', function () {
      //refresh state
      this.componentDidMount();
    }.bind(this));
  }

  componentDidMount() {
    fetch(`/api/FCDetails`).then(response => response.json()).then(state => { this.setState(state);  this.loadDone() });
  }

  handleSerialPortChange = (value, action) => {
    this.setState({ serialPortSelected: value });
  }

  handleBaudRateChange = (value, action) => {
    this.setState({ baudRateSelected: value });
  }

  handleMavVersionChange = (value, action) => {
    this.setState({ mavVersionSelected: value });
  }

  handleUseHeartbeatChange = (event) => {
    this.setState({ enableHeartbeat: event.target.checked });
  }

  handleUseTCPChange = (event) => {
    this.setState({ enableTCP: event.target.checked });
  }

  handleTloggingChange = (event) => {
    this.setState({ tlogging: event.target.checked });
  }

  handleDSRequest = (event) => {
    this.setState({ enableDSRequest: event.target.checked });
  }

  handleUseUDPBChange = (event) => {
    this.setState({ enableUDPB: event.target.checked });
  }

  changeUDPBPort = (event) => {
    this.setState({ UDPBPort: event.target.value });
  }

  handleSubmit = (event) => {
    //user clicked start/stop telemetry
    fetch('/api/FCModify', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device: JSON.stringify(this.state.serialPortSelected),
        baud: JSON.stringify(this.state.baudRateSelected),
        mavversion: JSON.stringify(this.state.mavVersionSelected),
        enableHeartbeat: this.state.enableHeartbeat,
        enableTCP: this.state.enableTCP,
        enableUDPB: this.state.enableUDPB,
        UDPBPort: this.state.UDPBPort,
        enableDSRequest: this.state.enableDSRequest,
        tlogging: this.state.tlogging
      })
    }).then(response => response.json()).then(state => { this.setState(state) });
  }

  handleFCReboot = (event) => {
    //user clicked to reboot flight controller
    fetch('/api/FCReboot', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  handleShutdown = (event) => {
    //user clicked to reboot flight controller
    fetch('/api/shutdowncc', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  addUdpOutput = (event) => {
    //add a new udp output
    fetch('/api/addudpoutput', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newoutputIP: this.state.addrow.split(":")[0],
        newoutputPort: this.state.addrow.split(":")[1]
      })
    }).then(response => response.json()).then(state => { this.setState(state) })
  }

  removeUdpOutput = (val) => {
    //remove a udp output
    fetch('/api/removeudpoutput', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removeoutputIP: val.IPPort.split(":")[0],
        removeoutputPort: val.IPPort.split(":")[1]
      })
    }).then(response => response.json()).then(state => { this.setState(state) })
  }

  changeaddrow = event => {
    const value = event.target.value;
    this.setState({ addrow: value });
  }

  renderTitle() {
    return "フライトコントローラー";
  }

  //create a html table from a list of udpoutputs
  renderUDPTableData(udplist) {
    return udplist.map((output, index) => {
      return (
        <tr key={index}>
          <td>{output.IPPort}</td>
          <td><Button size="sm" id={index} onClick={() => this.removeUdpOutput(output)}>Delete</Button></td>
        </tr>
      )
    });
  }

  renderContent() {
    let gps = ''
    if (this.state.FCStatus.gps !== undefined) {
      let lat = parseInt(this.state.FCStatus.gps.lat) / 10000000.0
      let lon = parseInt(this.state.FCStatus.gps.lon) / 10000000.0
      let alt = parseInt(this.state.FCStatus.gps.alt) / 1000.0
      var fixState = 'NoGPS'
      switch(this.state.FCStatus.gps.status) {
        case 1:
          fixState = 'NoFix'
          break;
        case 2:
          fixState = '2DFix'
          break;
        case 3:
          fixState = '3DFix'
          break;
        case 4:
          fixState = 'DGPS'
          break;
        case 5:
          fixState = 'RTKFloat'
          break;
        case 6:
          fixState = 'RTKFixed'
          break;
        case 7:
          fixState = 'STATIC'
          break;
        case 8:
          fixState = 'PPP'
          break;
      }
      gps = <p>
        GPS fixStatus: {fixState}<br />
        Lat: {lat.toFixed(7)} Lon: {lon.toFixed(7)} Alt: {alt.toFixed(2)}m
      </p>
    }

    return (
      <div style={{ width: 600 }}>
        <h2>Status</h2>
        <p>Connection Status: {this.state.FCStatus.conStatus}</p>
        <p>Packets Received: {this.state.FCStatus.numpackets} ({this.state.FCStatus.byteRate} bytes/sec)</p>
        <p>Vehicle Type: {this.state.FCStatus.vehType}</p>
        <p>Vehicle Firmware: {this.state.FCStatus.FW}{this.state.FCStatus.fcVersion === '' ? '' : (', Version: ' + this.state.FCStatus.fcVersion)}</p>
        {gps}
        
          
            <label>Console Output:<br />
              <textarea readOnly rows="10" cols="50" value={this.state.FCStatus.statusText}></textarea>
            </label>
            <br />
            <Button size="sm" disabled={!(this.state.FCStatus.conStatus === 'Connected')} onClick={this.handleFCReboot}>FC再起動</Button>&nbsp;&nbsp;&nbsp;
            <Button size="sm" disabled={this.state.loading} onClick={this.handleShutdown}>シャットダウン</Button>
          
        
            <div class="container">
                <div id="tachometer">
                              <div class="ii">
                                  <div><b><span class="num_1">0</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_2">1</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_3">2</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_4">3</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_5">4</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_6">5</span></b></div>
                                  <div><b></b></div>
                                  <div><b><span class="num_7">6</span></b></div>
                              </div> 
                            <div id="redline"></div>
                      <div class="line"></div>
                    <div class="pin"><div class="inner"></div></div> 
                </div>

          </div>
        
      </div>
    );
  }
}


export default FCPage;
