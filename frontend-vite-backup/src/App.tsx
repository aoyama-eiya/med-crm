import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Templates from './pages/Templates'
import RichMenus from './pages/RichMenus'
import Settings from './pages/Settings'
import Simulator from './components/Simulator'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="templates" element={<Templates />} />
                    <Route path="rich-menus" element={<RichMenus />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
            <Simulator />
        </BrowserRouter>
    )
}

export default App
