import { StrictMode, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainApp from './pages/app'
import Example from './pages/example'
import Web3ReactManager from './components/Web3ReactManager'
import { Dashboard } from './pages/dashboard'
import { Provider } from 'react-redux'
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { persistor, store } from './redux/store'
import '../src/App.css';
import { Export } from './pages/export'
import Mint from './pages/mint'

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>


          <Web3ReactManager>
            <BrowserRouter>

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/app" element={<MainApp />} />
                <Route path="/ex" element={<Example />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/export" element={<Export />} />
                <Route path="/mint" element={<Mint />} />
              </Routes>

            </BrowserRouter>
          </Web3ReactManager>


        </PersistGate>
      </Provider>
    </>
  )
}

export default App
