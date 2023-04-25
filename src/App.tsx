import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import 'assets/PrimeReactTheme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'

import Overview from './pages/admin/Overview'
import Profile from './pages/admin/Profile'
import Error from './pages/Error'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Verify from './pages/Verify'
import VerifyConfirmation from './pages/VerifyConfirmation'
import { theme } from './Theme'
import Room from "./pages/gameroom/Room";

export default function App() {

    return (
        <React.StrictMode>
            <ColorModeScript/>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />}/>
                        <Route path='/login' element={<Login />}/>
                        <Route path='/register' element={<Register />}/>
                        <Route path='/verify' element={<VerifyConfirmation />}/>
                        <Route path='/room/:roomId' element={<Room />} />
                        <Route path='/reset/:adminId' element={<ResetPassword />} />
                        <Route path='/dashboard' element={<Dashboard />}>
                            <Route index element={<Overview />} />
                            <Route path='profile' element={<Profile />} />
                            <Route path='matchers/:matcherId'>
                            </Route>
                        </Route>
                        <Route path='*' element={<Error/>}/>
                    </Routes>
                </BrowserRouter>
            </ChakraProvider>
        </React.StrictMode>
    )


}
