import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import GalleryManager from "@/components/admin/GalleryManager";
import ConnectorFilesManager from "@/components/admin/ConnectorFilesManager";
import ConnectorDownloadAnalytics from "@/components/admin/ConnectorDownloadAnalytics";

const AdminGalleryPage = () => {
  return (
    <>
      <Helmet>
        <title>Gallery Admin | SS. Tharan</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation persisted />
        <PageTransition>
          <main className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 max-w-5xl space-y-12">
            <GalleryManager />
            <div className="border-t-2 border-border pt-10">
              <ConnectorFilesManager />
            </div>
            <div className="border-t-2 border-border pt-10">
              <ConnectorDownloadAnalytics />
            </div>
          </main>
        </PageTransition>
        <Footer persisted />
      </div>
    </>
  );
};

export default AdminGalleryPage;
