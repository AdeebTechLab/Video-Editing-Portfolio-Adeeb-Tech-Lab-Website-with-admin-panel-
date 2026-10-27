import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ScrollManager } from './components/ScrollManager'
import { SiteLayout } from './components/layout/SiteLayout'
import { PageLoader } from './components/Skeletons'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The admin panel loads only when someone opens /admin.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ProjectsList = lazy(() => import('./pages/admin/ProjectsList'))
const ProjectEditor = lazy(() => import('./pages/admin/ProjectEditor'))
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin'))
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'))
const ToolsAdmin = lazy(() => import('./pages/admin/ToolsAdmin'))
const ContentAdmin = lazy(() => import('./pages/admin/ContentAdmin'))
const PublishAdmin = lazy(() => import('./pages/admin/PublishAdmin'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const CredentialsAdmin = lazy(() => import('./pages/admin/CredentialsAdmin'))

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollManager />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsList />} />
                <Route path="projects/new" element={<ProjectEditor />} />
                <Route path="projects/:id" element={<ProjectEditor />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="tools" element={<ToolsAdmin />} />
                <Route path="content" element={<ContentAdmin />} />
                <Route path="publish" element={<PublishAdmin />} />
                <Route path="settings" element={<CredentialsAdmin />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
