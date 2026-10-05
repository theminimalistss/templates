import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "../ui/layouts/Layout";
const Home = lazy(() => import("../ui/pages/HomePage"));
const Studio = lazy(() => import("../ui/pages/StudioPage"));
const Work = lazy(() => import("../ui/pages/WorkPage"));
const Project = lazy(() => import("../ui/pages/ProjectPage"));
const Services = lazy(() => import("../ui/pages/ServicesPage"));
const Journal = lazy(() => import("../ui/pages/JournalPage"));
const Article = lazy(() => import("../ui/pages/ArticlePage"));
const Contact = lazy(() => import("../ui/pages/ContactPage"));
const NotFound = lazy(() => import("../ui/pages/NotFoundPage"));
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="studio" element={<Studio />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<Project />} />
        <Route path="services" element={<Services />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/:slug" element={<Article />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
